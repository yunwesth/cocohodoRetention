# Architecture and module ownership

## Workspaces

The root package is a development/test coordinator. `apps/rewards` and `apps/website` are independently buildable Next.js apps. `packages/ui` supplies shared presentation. npm workspaces and the root lockfile connect them.

```text
apps/website ─── @cocohodo/ui ─── apps/rewards
      │                              │
      └──── ordinary HTTP links ──────┘
                                     │
                              Supabase Auth / DB
```

An app must not import another app's source. Share genuinely reusable UI through the package, and connect the deployed applications with configured origins. The public website has no database client or access to rewards credentials.

## Rewards flow

Route components compose feature views. `useAuthForm` owns sign-in state, OTP resend timing, and staff authorization. `useMemberCard` synchronizes the customer's membership. `useCashier` owns staff access, lookup, online state, mutations, and the pending-transaction journal. Presentation components consume these hooks. Database transaction and RLS rules remain in `supabase/migrations`.

`lib/supabase.ts` is the service adapter. `config/public.ts` is the only browser environment reader. `config/validate.ts` rejects privileged Supabase key formats, including before compilation in the Next config. This safeguard does not make public variables secret.

## Website flow

Routes compose feature sections and UI primitives. Menu search loads static menu content. `lib/content.ts` selects display data; `lib/metadata.ts` builds page metadata. `config/public.ts` reads explicitly public values; `config/server.ts` holds the indexing flag and is imported only by server routes/layouts.

Styling is separated into base, layout, home, rewards, other pages, and responsive modules. `app/globals.css` is their ordered entry point.

## Configuration and tests

Each app loads its own ignored `.env.local`; root `.env.local` belongs to tools only. `npm run env:setup` never overwrites existing files. Test fixtures use synthetic credentials and intercepted endpoints, never real service keys. CI generates its disposable PostgreSQL password at runtime.

Unit/environment tests run at the root. Browser suites cover each app and the HTTP journey between them. Both application builds compile the shared package. See [environment handling](ENVIRONMENT.md) and the [root README](../README.md).
