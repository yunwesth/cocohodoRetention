# Closter Cocohodo MVP — implementation and handoff

Updated October 10, 2026.

**The website MVP is built and available locally.** The public website and existing rewards app run separately and link to each other. The actual `app` subdomain, live SMS service, and shop pilot are not activated.

## Open the MVP

| Experience | Local URL |
| --- | --- |
| Public homepage | http://localhost:3001 |
| Searchable menu | http://localhost:3001/menu/ |
| Online ordering | http://localhost:3001/order/ |
| Rewards introduction | http://localhost:3001/rewards/ |
| Visit information | http://localhost:3001/contact/ |
| Customer rewards app | http://localhost:3000 |
| Staff station | http://localhost:3000/cashier |

Run `npm run dev:all` from the repository root using Node 24. See the [runbook](docs/launch/RUNBOOK.md) for setup, environment variables, individual scripts, and deployment instructions.

## What was delivered

- Responsive homepage with real reference-site food photography, featured categories, a rewards introduction, hours, and directions.
- Searchable HTML menu, category navigation, and recovery from empty search results. Unconfirmed prices are omitted.
- DoorDash and Uber Eats links for the Closter store. **Square is excluded.** Grubhub is retained in source data but disabled because regional restrictions prevented verification.
- Rewards information page that opens the existing app, plus return links from customer, login, and staff views.
- Explicit preview behavior: no suggestion that sample stamps are real or live SMS is available.
- Privacy and program-terms drafts, structured business data, page metadata, a legacy privacy redirect, and launch-controlled sitemap/indexing. Rewards routes remain noindex.
- A single command to run both apps, browser regression tests, local screenshots, and staff/release/pilot documentation.

## POC outcomes

| POC | Result | Remaining real-world work |
| --- | --- | --- |
| 1. Content and brand baseline | Implemented: store data, asset inventory, sources, copy | Owner confirmation of final content and image rights |
| 2. Public website prototype | Implemented and browser-tested | Owner visual review before publication |
| 3. Menu, order, visit | Implemented and browser-tested; two external listings verified | Current product availability, Grubhub if desired, actual phone directions and provider checkout availability |
| 4. Website/rewards integration | Implemented; complete website → rewards → QR → website journey tested | Final deployment origins |
| 5. Live rewards transaction | Existing logic validated with unit, embedded-database, and mocked authenticated browser tests | Shop Supabase/SMS setup, real SMS, physical cameras, separate PostgreSQL concurrency checks |
| 6. Domain/release rehearsal | Both builds pass; origin configuration, indexing behavior, and release/rollback runbook prepared | Hosting accounts, DNS access, real HTTPS domains, final URL inventory, actual deployment rehearsal/cutover |
| 7. Shop pilot | Staff guide and pilot worksheet prepared | Staff training, invited customers, actual repeat visits, pilot results |

The user authorized continuing through all POCs; there are no artificial per-POC approval pauses. The outstanding steps require external access or people/devices that were not supplied. No real customer records, orders, SMS messages, domain records, or hosting deployments were created or changed.

## Verification performed

The October 10 workspace refactor separates `apps/rewards`, `apps/website`, and `packages/ui`, with feature modules and individual READMEs. Environment templates, a non-overwriting setup script, ignored local environment files, and browser-key validation are in place. The Git index contains no real environment or private-key files. See [architecture](docs/ARCHITECTURE.md), [environment setup](docs/ENVIRONMENT.md), and [GitHub setup](docs/GITHUB.md).

The GitHub Actions workflow now validates both workspaces and uses a generated temporary database password. Its YAML and shell syntax were checked locally; the updated workflow has not run on GitHub. These changes have not been committed or pushed.

All commands used Node 24.21.0. Browser tests used downloaded Chromium and WebKit binaries.

| Check | Result |
| --- | --- |
| Root ESLint | Passed, no warnings |
| Rewards TypeScript | Passed |
| Website TypeScript | Passed |
| Rewards production build | Passed |
| Website production build | Passed |
| Unit and environment tests | 30 passed |
| Embedded database scenarios | 26 passed using PGlite; transactions serialized by the engine |
| Public website/integration browser checks | 20 passed across 1440px desktop, 768px tablet, 360px mobile Chrome, and iPhone WebKit profiles |
| Existing rewards preview checks | 12 passed |
| Authenticated rewards flow checks | 13 passed; 1 synthetic-camera check intentionally skipped on WebKit |
| Visual inspection | Desktop and mobile homepage screenshots inspected; capture found no browser runtime errors |

All 20 website checks passed together after the workspace refactor. An older auth test's heading assertion was updated to match the existing “Enter your code” screen. No application authentication behavior was weakened to make tests pass.

The authenticated suite uses mocked Supabase HTTP responses, and PGlite is an embedded test database. These results do not prove real SMS delivery, live hosted authorization setup, physical camera permissions, or production database concurrency.

## Review artifacts

- [Desktop screenshot](docs/preview/desktop.png) / [full homepage](docs/preview/desktop-full.png)
- [Mobile screenshot](docs/preview/mobile.png) / [full homepage](docs/preview/mobile-full.png)
- [Original POC plan with updated progress](CLOSTER_WEBSITE_POC_PLAN.md)
- [Store content](apps/website/content/store.json) and [menu content](apps/website/content/menu.json)
- [Reference photo sources and reuse status](apps/website/public/photos/SOURCES.md)
- [Run and release guide](docs/launch/RUNBOOK.md)
- [Staff counter guide](docs/launch/STAFF_GUIDE.md)
- [Pilot worksheet](docs/launch/PILOT.md)
- [Physical-device and live-service checklist](LAUNCH_CHECKLIST.md)

## To activate for the shop

1. Confirm menu availability, image reuse, program eligibility/reward value, and final privacy/terms.
2. Configure shop-owned Supabase/SMS and staff access in staging; complete the live-service checklist.
3. Configure two host projects and the final public/app origins; verify HTTPS and cross-site behavior.
4. Switch domain routing only after the prepared deployment is verified and the rollback record exists.
5. Run the shop pilot and record results before broad live rewards enrollment.

The public website may launch with the rewards preview if its own content/domain requirements are satisfied. Enabling actual rewards enrollment is a separate readiness decision.
