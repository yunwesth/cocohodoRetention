# Rewards app — @cocohodo/rewards

Customer membership and QR cards, phone verification, and the authorized staff stamp/redemption workflow. This app runs at port 3000 and is intended for `app.<shop-domain>`.

## Run and configure

From the repository root:

```sh
npm ci
npm run env:setup
npm run dev
```

Edit this app's ignored `.env.local`:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable/anon key only; browser-visible |
| `NEXT_PUBLIC_WEBSITE_URL` | Public website origin; defaults to localhost:3001 in development |

Blank Supabase variables enable the read-only preview. Service-role/secret keys must never be placed in public variables. SMS provider secrets belong in Supabase's provider settings. Configure hosted deployments through host environment settings and rebuild when public values change.

## Modules

| Directory | Responsibility |
| --- | --- |
| `app/` | Route wrappers, metadata, global styles and app manifest |
| `features/auth/` | Sign-in form and `useAuthForm` state/actions |
| `features/cashier/` | Staff UI, camera scanner, and `useCashier` authorization/transaction journal |
| `features/rewards/` | Dashboard, stamp card, activity history, QR screen, membership synchronization |
| `features/mascot/` | Hodo artwork and animation |
| `components/layout/` | App shell and shared loading/notice presentation |
| `config/` | Public environment configuration and privileged-key rejection |
| `lib/` | Supabase browser adapter and pure loyalty utilities/types |

Shared brand artwork comes from `@cocohodo/ui/brand-mark`. Do not import source files from the website app.

## Routes

- `/`: customer rewards
- `/login`: customer SMS verification
- `/qr`: enlarged member QR
- `/cashier/login`: staff sign-in
- `/cashier`: authorized scanner and transactions

The database enforces staff permissions, member isolation and idempotent transactions. Refactors must preserve request IDs and session-storage recovery in `useCashier`; a lost response must not create duplicate awards.

## Build and verify

From the root: `npm run build`, `npm run typecheck`, `npm test`, `npm run test:db`, `npm run test:e2e`, and `npm run test:flows`. The root `start` command forwards extra CLI arguments, e.g. `npm run start -- --port 3100`.

Database migrations are in [../../supabase/migrations](../../supabase/migrations). See the [implementation reference](../../docs/REWARDS_REFERENCE.md), [environment guide](../../docs/ENVIRONMENT.md), and [live-service checklist](../../LAUNCH_CHECKLIST.md).
