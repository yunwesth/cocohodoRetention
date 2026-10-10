# Cocohodo MVP — run, configure, and release

## Local development

Use Node 24, as required by the repository. Install root dependencies with `npm ci` if they are missing. Both applications use the root lockfile and installed packages; run commands from the repository root.

```sh
nvm use
npm ci
npm run dev:all
```

- Public website: <http://localhost:3001>
- Customer rewards preview: <http://localhost:3000>
- Staff preview: <http://localhost:3000/cashier>

For this implementation session, a checksum-verified Node 24.21.0 runtime was downloaded to `/private/tmp/node-v24.21.0-darwin-arm64/bin`. It is temporary and may be removed by the OS. It does not replace the user's installed Node versions. To use it while available:

```sh
PATH=/private/tmp/node-v24.21.0-darwin-arm64/bin:$PATH npm run dev:all
```

The launcher starts both servers and stops both when interrupted. If a port is in use, stop the previous server deliberately before restarting. The rewards app defaults to a read-only sample without Supabase configuration.

## Content maintenance

| File | Edit here |
| --- | --- |
| `apps/website/content/store.json` | Name, address, telephone, hours, ordering providers, provenance, program approval status |
| `apps/website/content/menu.json` | Menu items, categories, short descriptions, image choices |
| `apps/website/public/photos/` | Locally served reference images; replace or confirm rights before publication |
| `apps/website/styles/` | Public-site visual styles |
| `apps/website/app/privacy/page.tsx` | Actual data practices and shop-approved support/privacy details |
| `apps/website/app/rewards/terms/page.tsx` | Final reward eligibility, value, and terms |

Square is explicitly excluded in the store content and is filtered out by the public site's provider list. DoorDash and Uber Eats currently have enabled links. Grubhub stays disabled because automated verification hit a regional restriction. A listing verification does not prove a checkout or guarantee availability for every customer's address.

Do not add prices until the shop confirms them. The menu deliberately shows no prices. Changes to static content or public environment values require a rebuild.

## Environment values

Run `npm run env:setup` to create `apps/rewards/.env.local`, `apps/website/.env.local`, and the root tools `.env.local` without overwriting existing values. Do not commit real environment files. Production hosts should provide variables in their project settings.

| App | Variable | Production intent |
| --- | --- | --- |
| Public site | `NEXT_PUBLIC_SITE_URL` | Actual public HTTPS origin, e.g. `https://njcocohodo.com` |
| Public site | `NEXT_PUBLIC_REWARDS_URL` | Actual rewards HTTPS origin, e.g. `https://app.njcocohodo.com` |
| Public site | `NEXT_PUBLIC_REWARDS_LIVE` | Keep `false` until live enrollment is ready |
| Public site | `WEBSITE_PUBLIC_LAUNCH` | Keep `false` for previews; `true` enables indexing and sitemap entries |
| Rewards | `NEXT_PUBLIC_WEBSITE_URL` | Actual public HTTPS origin for return links |
| Rewards | `NEXT_PUBLIC_SUPABASE_URL` | Shop's Supabase project URL |
| Rewards | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable/anon key, never a privileged service-role key |

Enabling live website copy additionally requires `rewards.status` in `apps/website/content/store.json` to be `owner_confirmed`. Before changing that status, update the terms page from its preview wording, finalize the privacy notice, confirm eligibility/value, and complete the live checks. This guards the public CTA; it is not an authentication or access-control mechanism. Supabase permissions enforce rewards authorization.

## Staging rewards service

1. Create a shop-owned staging Supabase project and apply `supabase/migrations/202609270001_loyalty.sql` once.
2. Enable phone auth and configure the shop's SMS provider through Supabase. Keep SMS credentials out of browser variables. Follow the [official phone-auth guide](https://supabase.com/docs/guides/auth/phone-login).
3. Configure the actual app origin and applicable redirect destinations in Supabase; see [redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls).
4. Create a shared staff auth account, verify its email, and add its UUID to the private staff allowlist as documented in the root README. Keep access details in a password manager.
5. Set the two Supabase browser variables on the staging rewards deployment and rebuild. Use test accounts only.
6. Complete [LAUNCH_CHECKLIST.md](../../LAUNCH_CHECKLIST.md) on physical iPhone and Android devices, including real SMS, two-device QR scanning, recovery after interrupted requests, and sign-in restoration.

No shop service account, credentials, SMS sender, or database has been created by this implementation. Automated HTTP mocks and PGlite tests are not evidence of real SMS delivery or production database configuration.

## Two deployable applications

Use two projects from the same repository on a host supporting Next.js. Preserve the repository root for both builds so they share the root lockfile and both apps can resolve the shared UI workspace.

| Setting | Rewards project | Public website project |
| --- | --- | --- |
| Node | 24 | 24 |
| Install from repo root | `npm ci` | `npm ci` |
| Build from repo root | `npm run build` | `npm run build:website` |
| Next build directory | `apps/rewards/.next` | `apps/website/.next` |
| Self-hosted start | `npm run start` | `npm run start:website` |
| Intended domain | `app.<domain>` | `<domain>` |

For a workspace-aware hosting platform, select `apps/rewards` or `apps/website` as the respective app root. Install with the repository's root lockfile (`npm ci` from the root), run the selected workspace's `build` script, and include `packages/ui` in its source. If the platform requires an explicit install command from an app directory, use `cd ../.. && npm ci`. Both apps now depend on `@cocohodo/ui` through npm workspaces and do not import each other's files. Confirm the host's monorepo settings in staging before configuring DNS.

For a provider-independent production rehearsal, set both URL variables explicitly, build, and start each app on separate ports with the scripts above. Put each behind HTTPS for physical-device camera tests. Do not set public URLs to localhost on a hosted deployment.

## Domain cutover and rollback

1. Confirm ownership of the chosen domain, existing site management access, hosting plan, costs, and operational owner.
2. Export or record the current DNS values and website deployment. Preserve MX, SPF, DKIM, DMARC, and other email-related records.
3. Deploy both applications to staging URLs. Check direct routes, redirects, metadata, image loading, and cross-site navigation.
4. Configure the app subdomain first using the exact records returned by the host. Verify HTTPS and authentication on its final origin. See [Vercel custom domains](https://vercel.com/docs/domains/working-with-domains/add-a-domain) if using Vercel.
5. Confirm the public site's menu/photos/hours and privacy/terms. Keep rewards in preview if its live checks are incomplete; the public website can be launched separately once approved.
6. Before cutover, crawl/inventory the current website's full URLs. `/menu/` and `/contact/` are retained. `/privacy-policy` redirects to `/privacy/`; check for additional old URLs before switching.
7. Select the canonical root or `www` domain. Configure the host's redirect for the alternate. Change only the required web records; enable `WEBSITE_PUBLIC_LAUNCH=true` when publishing the actual site.
8. Verify the final website, ordering links, direct app routes, actual phone directions, certificate, and absence of staging URLs.
9. If a release fails, restore the previous deployment/domain mapping or recorded web DNS values. Keep the rewards database and audit ledger intact; do not roll back customer data by dropping tables. Disable enrollment links if the rewards service is unhealthy.

No DNS values, live domain, hosting configuration, or production account was changed during this work.

## Verification commands

```sh
npm run lint
npm run typecheck
npm run typecheck:website
npm test
npm run test:db
npm run build
npm run build:website
npx playwright install chromium webkit
npm run test:website
npm run test:e2e
npm run test:flows
```

Run browser suites sequentially because the rewards app shares generated type files. Authenticated flow tests build a separate `apps/rewards/.next-live` app and mock Supabase at the HTTP boundary. For this session browser binaries use `PLAYWRIGHT_BROWSERS_PATH=/private/tmp/cocohodo-playwright`; use that variable for tests while using those temporary binaries. Real PostgreSQL contention and physical-device tests remain separate gates.
