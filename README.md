# Cocohodo Closter

Two Next.js applications in an npm workspace: the public shop website and the customer/staff rewards app.

## Start locally

Requires Node.js 24 (`.nvmrc`) and npm. Run from the repository root:

```sh
nvm use
npm ci
npm run env:setup
npm run dev:all
```

`env:setup` creates ignored `.env.local` files from safe templates without overwriting existing values. Both apps work as previews with blank service credentials.

| App | URL | README |
| --- | --- | --- |
| Public website | http://localhost:3001 | [Website setup](apps/website/README.md) |
| Rewards | http://localhost:3000 | [Rewards setup](apps/rewards/README.md) |
| Staff station | http://localhost:3000/cashier | Same rewards app |

## Repository layout

```text
apps/
  website/            Public pages, menu content, website features and styles
  rewards/            Phone sign-in, membership, QR, cashier and rewards features
packages/
  ui/                 Shared brand artwork; no app configuration or credentials
supabase/migrations/  Rewards schema, permissions and transaction functions
tests/                Unit, environment, browser and integration checks
scripts/              Development, environment setup and database test tools
docs/                 Architecture, operations, staff and launch guides
```

Each app owns its routes, features, configuration, environment files and build output. Apps share the `@cocohodo/ui` package rather than importing each other's source. Install dependencies from the root; the single `package-lock.json` covers all workspaces.

## Environment files and keys

| File (ignored) | Purpose |
| --- | --- |
| `apps/rewards/.env.local` | Supabase URL/publishable key and public website return URL |
| `apps/website/.env.local` | Public website/rewards URLs and preview/launch flags |
| `.env.local` | Optional disposable database connection for repository test tools |

Only `.env.example` templates belong in source control. Their credential fields are blank. The `.gitignore` covers environment files at every depth, generated builds, dependencies, and local private-key files.

**`NEXT_PUBLIC_` values are visible to browsers.** The Supabase publishable/anon key is designed for this use; database authorization protects customer data. Never put service-role keys, SMS credentials, database passwords, or other secrets in a `NEXT_PUBLIC_` variable. The rewards build rejects known privileged Supabase key formats. Supabase's SMS integration keeps its provider credentials in Supabase settings, not this frontend.

No real service keys are supplied with the MVP. Fill in your own configuration in the ignored files; do not paste credentials into source or README examples. Hosted deployments should use the host's environment settings. See [environment handling](docs/ENVIRONMENT.md).

## Commands

Run these from the repository root:

| Command | Action |
| --- | --- |
| `npm run dev:all` | Start both apps, each loading its own environment |
| `npm run dev` / `npm run dev:website` | Start one app |
| `npm run build` / `npm run build:website` | Build rewards / website |
| `npm run start` / `npm run start:website` | Serve the corresponding production build |
| `npm run lint` | Lint all workspace source |
| `npm run typecheck` | Type-check both apps and repository tests/tools |
| `npm test` | Unit tests plus credential and Git-ignore checks |
| `npm run test:db` | PGlite, or a disposable PostgreSQL database configured in root `.env.local` |
| `npm run test:e2e` | Rewards preview browser tests |
| `npm run test:website` | Public site and website/rewards integration tests |
| `npm run test:flows` | Authenticated flows with mocked Supabase responses |

Install test browsers with `npx playwright install chromium webkit`. Run browser suites sequentially. CI generates a temporary PostgreSQL password and writes its connection URL only into an ignored environment file.

## Project status

The public site has a searchable menu, visit information, ordering links and rewards integration. Square is excluded. Live rewards need shop-owned Supabase/SMS setup and physical-device checks; the preview does not save stamps or send texts.

- [Architecture and module ownership](docs/ARCHITECTURE.md)
- [GitHub and CI setup](docs/GITHUB.md)
- [MVP status](MVP_STATUS.md)
- [Launch and deployment runbook](docs/launch/RUNBOOK.md)
- [Rewards implementation reference](docs/REWARDS_REFERENCE.md)
- [Staff guide](docs/launch/STAFF_GUIDE.md) and [pilot worksheet](docs/launch/PILOT.md)
