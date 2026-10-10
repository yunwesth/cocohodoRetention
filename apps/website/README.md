# Public website — @cocohodo/website

Cocohodo Closter's public website: homepage, menu search, ordering providers, store details, and a link to the rewards app. Development runs at port 3001.

## Run

From the repository root:

```sh
npm ci
npm run env:setup
npm run dev:website
```

Use `npm run dev:all` to open the connected rewards app too. Each application loads its own `.env.local`.

## Configuration

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | This website's origin |
| `NEXT_PUBLIC_REWARDS_URL` | Rewards app origin |
| `NEXT_PUBLIC_REWARDS_LIVE` | Enables live enrollment copy only when content also records owner approval |
| `WEBSITE_PUBLIC_LAUNCH` | Server build flag controlling indexing and sitemap entries |

This app requires **no API keys or database credentials**. All actual secrets belong in server configuration for the service that needs them; never add secrets to website JSON or browser variables. Local configuration files are ignored. Public values are inlined at build time.

## Modules

| Directory | Responsibility |
| --- | --- |
| `app/` | Pages, layout, metadata routes, and stylesheet imports |
| `features/home/` | Hero, featured items, story and visit sections |
| `features/menu/` | Searchable menu browser |
| `features/rewards/` | Marketing introduction and sample stamp card |
| `features/visit/` | Reusable shop details |
| `components/layout/` | Navigation and footer |
| `components/ui/` | Food photo and page introduction primitives |
| `config/` | Explicit public and server configuration |
| `lib/` | Content selectors and metadata helpers |
| `content/` | Store/menu records and featured category data |
| `styles/` | Readable base, layout, homepage, rewards, page and responsive CSS |
| `public/photos/` | Local reference photographs and source inventory |

The shared walnut mark is imported from `@cocohodo/ui/brand-mark`; this app has no source dependency on rewards.

## Edit the website

Update `content/store.json` for contact details, hours and ordering providers, and `content/menu.json` for menu categories/items. `content/home.ts` selects homepage featured categories. Prices are omitted until confirmed. Square stays excluded by business direction; Grubhub is disabled pending verification.

Keep credentials out of all content files. Confirm photo reuse before public deployment; [photo sources](public/photos/SOURCES.md) record provenance.

## Build and test

From the root: `npm run build:website`, `npm run typecheck:website`, and `npm run test:website`. For independent hosting, select `apps/website` as the app root and install the root workspace lockfile. See [deployment instructions](../../docs/launch/RUNBOOK.md).
