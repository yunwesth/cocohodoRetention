# Rewards implementation reference

A responsive loyalty web app for a single coffee shop. Customers verify their phone number, show their personal QR code, and collect stamps. A shared staff account scans codes, awards stamps, and redeems free drinks.

## Run locally

Use **Node.js 24** (`nvm use`, if you use nvm).

```sh
npm ci
npm run env:setup
npm run dev
```

Open http://localhost:3000. With blank service variables, the customer dashboard and cashier station are clearly labeled **read-only previews**. Preview cannot send texts, sign in, or mutate rewards. No demo credentials or authentication bypass are included.

- `/` — customer QR code, stamps, and recent visits
- `/login` — customer SMS sign-in / registration
- `/cashier/login` — shared staff email/password sign-in
- `/cashier` — camera scanner, manual member lookup, awards, and redemption

## Connect a live shop

1. Create a new Supabase project. In its SQL Editor, run `supabase/migrations/202609270001_loyalty.sql` once. Alternatively apply it with the Supabase CLI migration workflow. This creates the membership tables, role checks, RLS policies, and transaction functions.
2. Set these public browser-safe variables in `apps/rewards/.env.local`, then restart the app:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
   ```

   The legacy Supabase `anon` key also works in the publishable-key variable. Never use a secret/service-role key here.
3. In **Supabase Authentication → Providers → Phone**, enable phone sign-in, select Twilio, and configure the Twilio credentials and sender/messaging service required by that provider. Configure a **six-digit SMS OTP**, 60-second resend interval, and a short expiry (for example, five minutes). Set project SMS rate limits appropriate to the shop before launch. Keep all Twilio secrets in Supabase, outside this app. See [Supabase’s phone login setup](https://supabase.com/docs/guides/auth/phone-login?showSmsProvider=Twilio).
4. Finish any sender setup required in your Twilio account and test delivery to a real US phone. Supabase test phone/OTP mappings are useful for a staging project; remove them before production. No marketing messages are sent.
5. Enable email/password authentication. In **Supabase Authentication → Users → Add user**, create the shared shop account with its email and a strong password, marked email-confirmed. Do not create a public staff signup form. Copy its UUID, then run:

   ```sql
   insert into private.staff_accounts(user_id)
   values ('REPLACE_WITH_STAFF_AUTH_USER_UUID');
   ```

   Only a project administrator should execute this SQL. Being able to sign in by email does **not** grant staff access; membership in this private table does. Remove the row to revoke cashier access. Reset the shared password through the Supabase admin dashboard if needed. A phone-based customer cannot promote themselves.
6. On a customer phone, open `/login`, request a code, verify it, and keep the rewards page open. On another device, sign in at `/cashier/login`, scan the customer QR code, and confirm the number of eligible paid drinks. The customer dashboard refreshes every 15 seconds while visible and whenever it regains focus.

## Loyalty rules

- One paid eligible drink earns one stamp. Cashiers determine eligibility; free reward drinks do not earn stamps.
- Ten stamps completes a card. Additional awards are blocked until the cashier redeems it.
- Overflow from the purchase that completes a card is preserved. Eight stamps plus three drinks becomes ten active stamps and one pending stamp. Redemption moves that pending stamp to the next card.
- Large purchases can have more than ten pending stamps. Each redemption activates at most ten; further overflow remains pending for subsequent cards. No value is lost.
- A transaction accepts 1–100 paid drinks, a practical input guard against accidental bulk awards.
- Stamps and rewards do not expire. New digital members start at zero; paper cards are not migrated.
- The app requires a connection for awards and redemptions. Unknown transaction outcomes remain in browser session storage, with a “Confirm saved transaction” action. Retrying uses the same request ID and cannot duplicate the award. Do not clear browser data or switch devices to retry an uncertain transaction; first check its outcome on the current device.

## Data and authorization

Supabase Auth verifies identity; the database enforces authorization independently of the interface.

- `members`: one membership per verified phone-auth user; random opaque member code, active stamps, pending stamps, and join date.
- `private.staff_accounts`: administrator-managed allowlist; inaccessible to browser roles.
- `loyalty_events`: append-only transaction log with request UUID, member, shared staff actor, action, quantity, resulting balances, and timestamp. No customer phone appears in the QR or cashier response.
- Customers may read only their own membership/history using RLS. Both customers and staff are denied direct balance or history writes. Staff resolve customer cards only through authenticated functions.
- Customer card creation checks `phone_confirmed_at` on the trusted auth record.
- A member row lock and a request advisory lock make balance updates, audit insertion, and duplicate checks atomic. Duplicate IDs return the current card without applying the change again; conflicting reuse is rejected.
- Reward history cannot be edited or deleted through the app; the database trigger also blocks update/delete. No refund/undo interface is included. Phone changes/account recovery require assistance from the project administrator and are not automated in v1.

### Browser RPC interface

All functions require an authenticated Supabase session. Only `is_staff` and `get_my_card` are useful to customers; staff-only methods validate the private allowlist on every call.

| RPC | Arguments | Result |
| --- | --- | --- |
| `is_staff` | None | Boolean |
| `get_my_card` | None | Own card; creates empty membership after verified phone login |
| `lookup_member` | `p_member_code` | Matching card, staff only |
| `apply_loyalty_action` | `p_member_code`, `p_kind` (`award` or `redeem`), `p_drinks` (zero for redeem), `p_request_id` (UUID) | Current card after atomic operation, staff only |

A card contains `member_code`, `stamps`, `pending_stamps`, `joined_at`, `total_drinks`, `total_rewards`, and the latest 50 `activity` events (`id`, `kind`, `drinks`, `created_at`). QR payloads are `cocohodo:<member_code>`. Manual entry accepts the same code, grouped with spaces or hyphens. Possessing a code alone never grants permission to award or redeem.

## Checks

```sh
npm run lint
npm run typecheck
npm test
npm run test:db
npm run build
npx playwright install chromium webkit
npm run test:e2e
npm run test:flows
```

The SQL test runner executes the real migration against an in-memory PostgreSQL engine (PGlite), with Supabase-compatible test auth roles. It covers access boundaries, RLS, unverified accounts, invalid inputs, overflow, full-card blocking, idempotency, concurrent submissions, and immutable audit history. PGlite serializes transactions. For actual lock contention across separate PostgreSQL connections, run the same suite against an **empty, disposable test database**:

```sh
# Set TEST_DATABASE_URL in the ignored root .env.local first.
npm run test:db
```

The runner refuses any database with an existing `auth` schema. Never point tests at production. CI provisions PostgreSQL 17 and runs this concurrent variant, along with unit tests, the production build, and browser tests.

Playwright covers the read-only preview on desktop Chromium, mobile Chromium, and mobile WebKit. `test:flows` builds a separate production app with mocked Supabase HTTP responses, then checks phone verification, persisted sign-in, staff authorization, overflow/redemption, retry after a lost response and reload, and camera-denial recovery on Chromium and mobile WebKit. A Chromium test decodes a real QR from a synthetic video stream and verifies camera release. The service mocks exist only in tests, not in the application.

Run the browser suites sequentially; Next.js generates shared type files during startup. Browser emulation does not replace testing camera permissions, focus, and QR decoding on physical phones. Before launch, complete `LAUNCH_CHECKLIST.md` against a staging project, including real SMS and two-device cashier/customer tests.

Historical pre-refactor verification: 17 unit tests, 26 database scenarios on both PGlite and PostgreSQL 17 with concurrent connections, 12 preview browser tests, and 13 authenticated browser tests passed. The synthetic video test is intentionally skipped on WebKit; physical iPhone/Android camera and live SMS checks remain pending. Lint, TypeScript, and the production build passed.

## Deploy over HTTPS

1. Push this project to your repository and import it into a Next.js-compatible host such as Vercel. Select Node 24 and the standard `npm run build` command.
2. Set the two public Supabase environment variables in the deployment environment **before building**. They are included in the browser bundle and are intentionally public; RLS and RPC authorization protect the data.
3. Configure your HTTPS site URL in Supabase Authentication URL settings. Rebuild/redeploy after changing public variables. Keep staging and production Supabase projects separate.
4. Apply the migration, provision the staff account, and enable your SMS provider on the corresponding production project.
5. Test sign-in, award, overflow, and redemption from the deployed HTTPS URL. Camera access requires HTTPS (localhost is allowed for development).
6. Add the app to the home screen using the browser’s install/share menu. The app includes an installation manifest and icons; it intentionally does not cache private account data or queue offline writes.

Monitor SMS delivery and auth rate limits in Supabase/Twilio and review failed app requests in your hosting logs. The append-only event table provides the reward audit trail. Configure database backups through your hosting plan. There are no analytics trackers, payment services, POS integrations, or marketing sends in this version.
