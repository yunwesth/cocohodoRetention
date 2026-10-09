-- Run once in a fresh Supabase project. All reward writes go through the RPC below.
begin;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table private.staff_accounts (
  user_id uuid primary key references auth.users(id),
  created_at timestamptz not null default now()
);
alter table private.staff_accounts enable row level security;

create table public.members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id),
  member_code text not null unique default upper(replace(gen_random_uuid()::text, '-', '')),
  stamps integer not null default 0 check (stamps between 0 and 10),
  pending_stamps integer not null default 0 check (pending_stamps >= 0),
  joined_at timestamptz not null default now(),
  constraint pending_requires_full_card check (pending_stamps = 0 or stamps = 10)
);

create table public.loyalty_events (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique,
  member_id uuid not null references public.members(id),
  actor_id uuid not null,
  kind text not null check (kind in ('award', 'redeem')),
  drinks integer not null,
  stamps_after integer not null check (stamps_after between 0 and 10),
  pending_after integer not null check (pending_after >= 0),
  created_at timestamptz not null default now(),
  constraint valid_drinks check ((kind = 'award' and drinks between 1 and 100) or (kind = 'redeem' and drinks = 0))
);
create index loyalty_events_member_time on public.loyalty_events(member_id, created_at desc);
alter table public.members enable row level security;
alter table public.loyalty_events enable row level security;
revoke all on public.members, public.loyalty_events from public, anon, authenticated;
grant select on public.members, public.loyalty_events to authenticated;
create policy read_own_membership on public.members for select to authenticated using (user_id = (select auth.uid()));
create policy read_own_activity on public.loyalty_events for select to authenticated using (
  exists (select 1 from public.members m where m.id = member_id and m.user_id = (select auth.uid()))
);

create function private.reject_event_mutation() returns trigger language plpgsql set search_path = '' as $$
begin raise exception 'Loyalty history is append-only'; end;
$$;
create trigger loyalty_events_immutable before update or delete on public.loyalty_events for each row execute function private.reject_event_mutation();

create function public.is_staff() returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from private.staff_accounts where user_id = auth.uid());
$$;

create function private.card_json(p_member_id uuid) returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'member_code', m.member_code, 'stamps', m.stamps, 'pending_stamps', m.pending_stamps,
    'joined_at', m.joined_at,
    'total_drinks', coalesce((select sum(e.drinks) from public.loyalty_events e where e.member_id = m.id and e.kind = 'award'), 0),
    'total_rewards', (select count(*) from public.loyalty_events e where e.member_id = m.id and e.kind = 'redeem'),
    'activity', coalesce((select jsonb_agg(jsonb_build_object('id', e.id, 'kind', e.kind, 'drinks', e.drinks, 'created_at', e.created_at) order by e.created_at desc, e.id desc)
      from (select * from public.loyalty_events where member_id = m.id order by created_at desc, id desc limit 50) e), '[]'::jsonb)
  ) from public.members m where m.id = p_member_id;
$$;

create function public.get_my_card() returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_id uuid;
begin
  if auth.uid() is null then raise exception 'Not authenticated' using errcode = '42501'; end if;
  if not exists (select 1 from auth.users where id = auth.uid() and phone is not null and phone_confirmed_at is not null) then
    raise exception 'Sign in with a verified phone number to access your rewards.' using errcode = '42501';
  end if;
  insert into public.members(user_id) values (auth.uid()) on conflict (user_id) do nothing;
  select id into v_id from public.members where user_id = auth.uid();
  return private.card_json(v_id);
end;
$$;

create function public.lookup_member(p_member_code text) returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_id uuid;
begin
  if not public.is_staff() then raise exception 'Cashier access required. Please sign in again.' using errcode = '42501'; end if;
  select id into v_id from public.members where member_code = upper(trim(p_member_code));
  if v_id is null then raise exception 'Member not found. Check the code and try again.'; end if;
  return private.card_json(v_id);
end;
$$;

create function public.apply_loyalty_action(p_member_code text, p_kind text, p_drinks integer, p_request_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_member public.members%rowtype;
  v_previous public.loyalty_events%rowtype;
  v_total integer;
begin
  if not public.is_staff() then raise exception 'Cashier access required. Please sign in again.' using errcode = '42501'; end if;
  if p_request_id is null or p_kind is null or p_kind not in ('award', 'redeem') or p_drinks is null
    or (p_kind = 'award' and p_drinks not between 1 and 100) or (p_kind = 'redeem' and p_drinks <> 0) then
    raise exception 'Invalid transaction. Enter between 1 and 100 eligible drinks.' using errcode = '22023';
  end if;
  -- Serialize identical request IDs, including accidental reuse against another member.
  perform pg_advisory_xact_lock(hashtextextended(p_request_id::text, 0));
  select * into v_member from public.members where member_code = upper(trim(p_member_code)) for update;
  if not found then raise exception 'Member not found. Check the code and try again.'; end if;
  select * into v_previous from public.loyalty_events where request_id = p_request_id;
  if found then
    if v_previous.member_id <> v_member.id or v_previous.kind <> p_kind or v_previous.drinks <> p_drinks or v_previous.actor_id <> auth.uid() then
      raise exception 'This request was already used for a different transaction.' using errcode = '22023';
    end if;
    return private.card_json(v_member.id);
  end if;
  if p_kind = 'award' then
    if v_member.stamps = 10 then raise exception 'Redeem the completed card before adding more stamps.'; end if;
    v_total := v_member.stamps + p_drinks;
    v_member.stamps := least(10, v_total);
    v_member.pending_stamps := greatest(0, v_total - 10);
  else
    if v_member.stamps <> 10 then raise exception 'This member needs 10 stamps before redeeming a free drink.'; end if;
    v_member.stamps := least(10, v_member.pending_stamps);
    v_member.pending_stamps := greatest(0, v_member.pending_stamps - 10);
  end if;
  update public.members set stamps = v_member.stamps, pending_stamps = v_member.pending_stamps where id = v_member.id;
  insert into public.loyalty_events(request_id, member_id, actor_id, kind, drinks, stamps_after, pending_after)
    values (p_request_id, v_member.id, auth.uid(), p_kind, p_drinks, v_member.stamps, v_member.pending_stamps);
  return private.card_json(v_member.id);
end;
$$;

-- PostgreSQL grants EXECUTE to PUBLIC by default; explicitly close every entry point.
revoke all on all functions in schema private from public, anon, authenticated;
revoke all on function public.is_staff() from public, anon, authenticated;
revoke all on function public.get_my_card() from public, anon, authenticated;
revoke all on function public.lookup_member(text) from public, anon, authenticated;
revoke all on function public.apply_loyalty_action(text, text, integer, uuid) from public, anon, authenticated;
grant execute on function public.is_staff() to authenticated;
grant execute on function public.get_my_card() to authenticated;
grant execute on function public.lookup_member(text) to authenticated;
grant execute on function public.apply_loyalty_action(text, text, integer, uuid) to authenticated;
commit;
