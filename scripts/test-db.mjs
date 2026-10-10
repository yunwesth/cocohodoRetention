import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';

// Tool-only database credentials load from the ignored root environment file.
// Existing CI/shell variables take precedence. Never read app production envs.
try { process.loadEnvFile(new URL('../.env.local', import.meta.url)); }
catch (error) { if (error.code !== 'ENOENT') throw error; }

// Optional real PostgreSQL target MUST be an empty, disposable test database.
const usePostgres = Boolean(process.env.TEST_DATABASE_URL);
let db;
if (usePostgres) {
  const { Pool } = await import('pg');
  const pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
  db = {
    query: (sql, params) => pool.query(sql, params), exec: (sql) => pool.query(sql), close: () => pool.end(),
    transaction: async (fn) => {
      const client = await pool.connect();
      try { await client.query('begin'); const result = await fn(client); await client.query('commit'); return result; }
      catch (error) { await client.query('rollback'); throw error; }
      finally { client.release(); }
    },
  };
} else { db = new PGlite(); }
let passed = 0;
async function test(name, fn) {
  await fn(); passed++; console.log(`✓ ${name}`);
}
const users = { staff: randomUUID(), alice: randomUUID(), bob: randomUUID(), unverified: randomUUID() };
async function asUser(user, fn, role = 'authenticated') {
  return db.transaction(async (tx) => {
    await tx.query(`set local role ${role}`);
    await tx.query("select set_config('request.jwt.claim.sub', $1, true)", [user ?? '']);
    return fn(tx);
  });
}
async function myCard(user) {
  return asUser(user, async (tx) => (await tx.query('select public.get_my_card() as card')).rows[0].card);
}
async function act(code, kind, drinks = 0, id = randomUUID(), actor = users.staff) {
  return asUser(actor, async (tx) => (await tx.query('select public.apply_loyalty_action($1,$2,$3,$4) as card', [code, kind, drinks, id])).rows[0].card);
}
try {
  const existing = await db.query("select exists(select 1 from information_schema.schemata where schema_name='auth') as present");
  assert.equal(existing.rows[0].present, false, 'Refusing to run against an existing auth schema. Use a fresh test database.');
  await db.exec(`
    create role anon nologin;
    create role authenticated nologin;
    create schema auth;
    create table auth.users(id uuid primary key, phone text, phone_confirmed_at timestamptz);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema auth to anon, authenticated;
  `);
  await db.exec(await readFile(new URL('../supabase/migrations/202609270001_loyalty.sql', import.meta.url), 'utf8'));
  for (const [name, id] of Object.entries(users)) {
    await db.query('insert into auth.users values ($1, $2, $3)', [id, name === 'staff' ? null : '+12015550123', ['staff','unverified'].includes(name) ? null : new Date().toISOString()]);
  }
  await db.query('insert into private.staff_accounts(user_id) values ($1)', [users.staff]);
  let alice, bob;
  await test('verified customer starts with an empty card and a private random code', async () => {
    alice = await myCard(users.alice); bob = await myCard(users.bob);
    assert.equal(alice.stamps, 0); assert.equal(alice.pending_stamps, 0);
    assert.match(alice.member_code, /^[A-F0-9]{32}$/); assert.notEqual(alice.member_code, bob.member_code);
  });
  await test('returning sign-in keeps the same membership', async () => assert.equal((await myCard(users.alice)).member_code, alice.member_code));
  await test('unverified phone cannot create a card', async () => assert.rejects(myCard(users.unverified), /verified phone/));
  await test('anonymous callers cannot execute customer or staff operations', async () => {
    await assert.rejects(asUser(null, (tx) => tx.query('select public.get_my_card()'), 'anon'), /permission denied/);
    await assert.rejects(asUser(null, (tx) => tx.query('select public.is_staff()'), 'anon'), /permission denied/);
  });
  await test('customers can only select their own member and activity rows', async () => {
    const rows = await asUser(users.alice, (tx) => tx.query('select * from public.members'));
    assert.equal(rows.rows.length, 1); assert.equal(rows.rows[0].member_code, alice.member_code);
  });
  await test('customers cannot award, redeem, or resolve another code', async () => {
    await assert.rejects(act(alice.member_code, 'award', 1, randomUUID(), users.alice), /Cashier access required/);
    await assert.rejects(act(alice.member_code, 'redeem', 0, randomUUID(), users.alice), /Cashier access required/);
    await assert.rejects(asUser(users.alice, (tx) => tx.query('select public.lookup_member($1)', [bob.member_code])), /Cashier access required/);
  });
  await test('customers cannot change balances or self-assign staff status', async () => {
    await assert.rejects(asUser(users.alice, (tx) => tx.query('update public.members set stamps = 10')), /permission denied/);
    await assert.rejects(asUser(users.alice, (tx) => tx.query('insert into private.staff_accounts(user_id) values ($1)', [users.alice])), /permission denied/);
    assert.equal((await asUser(users.alice, (tx) => tx.query('select public.is_staff() as staff'))).rows[0].staff, false);
  });
  await test('staff resolves an existing member without exposing a phone number', async () => {
    const result = (await asUser(users.staff, (tx) => tx.query('select public.lookup_member($1) as card', [alice.member_code]))).rows[0].card;
    assert.equal(result.member_code, alice.member_code); assert.equal('phone' in result, false);
  });
  await test('invalid member codes fail without mutations', async () => assert.rejects(act('BAD-CODE', 'award', 1), /Member not found/));
  await test('staff cannot directly update the balance or ledger', async () => {
    await assert.rejects(asUser(users.staff, (tx) => tx.query('update public.members set stamps=10')), /permission denied/);
    await assert.rejects(asUser(users.staff, (tx) => tx.query('delete from public.loyalty_events')), /permission denied/);
  });
  await test('invalid quantities and transaction kinds are rejected', async () => {
    for (const value of [0, -1, 101, null]) await assert.rejects(act(alice.member_code, 'award', value), /Invalid transaction/);
    await assert.rejects(act(alice.member_code, 'other', 1), /Invalid transaction/);
    await assert.rejects(act(alice.member_code, 'redeem', 1), /Invalid transaction/);
    await assert.rejects(act(alice.member_code, 'award', 1, null), /Invalid transaction/);
  });
  await test('redemption below ten stamps is rejected', async () => assert.rejects(act(alice.member_code, 'redeem'), /needs 10 stamps/));
  await test('eight purchased drinks produce eight stamps', async () => { alice = await act(alice.member_code, 'award', 8); assert.equal(alice.stamps, 8); assert.equal(alice.total_drinks, 8); });
  const overflowId = randomUUID();
  await test('8 + 3 completes the card and saves one pending stamp', async () => {
    alice = await act(alice.member_code, 'award', 3, overflowId);
    assert.equal(alice.stamps, 10); assert.equal(alice.pending_stamps, 1); assert.equal(alice.total_drinks, 11);
  });
  await test('retry of the same award is idempotent even on a full card', async () => {
    const result = await act(alice.member_code, 'award', 3, overflowId);
    assert.equal(result.total_drinks, 11); assert.equal(result.activity.length, 2);
  });
  await test('reusing a request for another quantity or member is rejected', async () => {
    await assert.rejects(act(alice.member_code, 'award', 2, overflowId), /different transaction/);
    await assert.rejects(act(bob.member_code, 'award', 3, overflowId), /different transaction/);
  });
  await test('additional awards on a full card are blocked', async () => assert.rejects(act(alice.member_code, 'award', 1), /Redeem the completed card/));
  const redeemId = randomUUID();
  await test('redemption activates pending stamps and does not earn another stamp', async () => {
    alice = await act(alice.member_code, 'redeem', 0, redeemId);
    assert.equal(alice.stamps, 1); assert.equal(alice.pending_stamps, 0); assert.equal(alice.total_rewards, 1); assert.equal(alice.total_drinks, 11);
  });
  await test('retry of redemption does not redeem twice', async () => assert.equal((await act(alice.member_code, 'redeem', 0, redeemId)).total_rewards, 1));
  await test('multiple-card overflow remains pending until each redemption', async () => {
    bob = await act(bob.member_code, 'award', 25); assert.equal(bob.stamps, 10); assert.equal(bob.pending_stamps, 15);
    bob = await act(bob.member_code, 'redeem'); assert.equal(bob.stamps, 10); assert.equal(bob.pending_stamps, 5);
    bob = await act(bob.member_code, 'redeem'); assert.equal(bob.stamps, 5); assert.equal(bob.pending_stamps, 0);
  });
  await test('simultaneously submitted distinct awards do not lose stamps', async () => {
    await Promise.all([act(alice.member_code, 'award', 1), act(alice.member_code, 'award', 1)]);
    assert.equal((await myCard(users.alice)).stamps, 3);
  });
  await test('simultaneously submitted duplicate awards apply once', async () => {
    const id = randomUUID();
    await Promise.all([act(alice.member_code, 'award', 1, id), act(alice.member_code, 'award', 1, id)]);
    assert.equal((await myCard(users.alice)).stamps, 4);
  });
  await test('competing awards at nine stamps cannot overfill the active card', async () => {
    await act(alice.member_code, 'award', 5);
    const results = await Promise.allSettled([act(alice.member_code, 'award', 1), act(alice.member_code, 'award', 1)]);
    assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1);
    assert.equal((await myCard(users.alice)).stamps, 10);
  });
  await test('competing redemptions cannot spend the same reward twice', async () => {
    const results = await Promise.allSettled([act(alice.member_code, 'redeem'), act(alice.member_code, 'redeem')]);
    assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1);
    assert.equal((await myCard(users.alice)).stamps, 0);
  });
  await test('activity RLS hides other members’ history', async () => {
    const events = (await asUser(users.alice, (tx) => tx.query('select * from public.loyalty_events'))).rows;
    assert(events.length > 0); assert.equal(new Set(events.map((e) => e.member_id)).size, 1);
  });
  await test('audit history cannot be edited or deleted, even by its owner', async () => {
    await assert.rejects(db.query('update public.loyalty_events set drinks = 1 where kind = $1', ['award']), /append-only/);
    await assert.rejects(db.query('delete from public.loyalty_events'), /append-only/);
  });
  console.log(`\n${passed} database scenarios passed (${usePostgres ? 'PostgreSQL with concurrent connections' : 'PGlite; transactions serialized by the embedded engine'}).`);
} finally { await db.close(); }
