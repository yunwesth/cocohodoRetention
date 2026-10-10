# Environment files and credential handling

## Where values belong

Run `npm run env:setup` from the repository root. It copies the three `.env.example` templates to `.env.local` with owner-only file permissions, preserving any existing file.

| Ignored file | Values |
| --- | --- |
| `apps/rewards/.env.local` | Supabase URL, publishable/anon key, website return origin |
| `apps/website/.env.local` | Website/rewards origins and launch flags; no credentials needed |
| `.env.local` | Optional `TEST_DATABASE_URL` for an empty disposable test database |

Next.js loads environment files relative to each app directory. `dev:all` starts each process there and does not inject fallback values over its file. The test database script loads only root `.env.local`; existing shell/CI environment values take precedence.

## Public versus secret

All `NEXT_PUBLIC_` values are compiled into browser JavaScript. The Supabase publishable/anon key is intentionally public. User authentication, database RLS, and staff RPC checks control access. Service-role keys, SMS tokens, database passwords and private keys must never use the public prefix.

This app does not require a Supabase service-role key. Its SMS integration is configured through Supabase, where the provider credentials stay. If future server code needs a new secret, add a blank variable to the appropriate template, supply its value only in ignored local files or the hosting platform's environment store, and read it only from server code.

Changing public environment values requires restarting development or rebuilding a production deployment. Local examples use localhost; configure actual HTTPS origins before hosting.

## Version control

`.gitignore` ignores `.env*`, `*.env`, and `*.env.*` at every directory depth, except `.env.example`. It also excludes private-key files and local credential directories. Examples contain only blank credential fields and non-secret defaults.

`npm test` runs Git-ignore assertions against a temporary Git repository, including both app paths and future nested packages. It also checks the templates and rejects privileged Supabase keys in browser configuration.

A Git repository is now present with origin `https://github.com/yunwesth/cocohodoRetention.git`. The current index contains no real environment/private-key files; all three local environment files were verified ignored against this repository. Ignore rules do not remove a file that was already committed elsewhere. If credentials were previously committed, revoke/rotate them through the provider and remove them from tracking/history using your repository's process.

## Audit result for this refactor

No live credentials were found by scanning the supplied source for common token formats, private keys, JWT literals, credential assignments and credential-bearing connection URLs. No live credentials existed in local env files at setup time; app key fields remain blank. The old documentation/CI examples used disposable PostgreSQL credentials; documentation now refers to env configuration and CI generates a random password into an ignored file. Mock tests intentionally retain synthetic values such as `test-public-key` and `test-password`; these grant no access to a real service.

A source scan is not proof that a secret can never be introduced. Review future template and configuration changes, and never log env values or include environment files in support screenshots.
