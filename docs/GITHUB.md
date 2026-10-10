# GitHub setup

The local Git repository has `origin` set to `https://github.com/yunwesth/cocohodoRetention.git`.

## Continuous integration

[The validation workflow](../.github/workflows/ci.yml) runs on pushes and pull requests using Node 24 and the root npm workspace lockfile. It checks lint, TypeScript, unit/environment tests, database behavior against a disposable PostgreSQL 17 instance, both production builds, and the three browser suites.

The job has read-only repository permissions and cancels superseded runs for the same ref. On failure it uploads only `test-results/` for diagnosis.

No production API keys are needed for CI. Supabase responses in authenticated browser tests are mocked. The workflow generates a temporary database password at runtime, masks it, and writes its connection URL to an ignored root `.env.local`. It removes the disposable database container when finished.

## What is committed

- Application and shared-package source, workspace manifests, and the root lockfile.
- `.env.example` files with blank credential values and public localhost defaults.
- Documentation and the validation workflow.

Real environment files, private-key files, generated builds, dependencies and test artifacts are ignored. `npm test` checks the ignore rules at the root and within app/package directories. The current index was checked and contains no real environment/private-key files.

## Publishing these changes

The workspace refactor and CI updates are local until committed and pushed. Preparing this configuration does not run the updated workflow on GitHub. After pushing, inspect the **Validate COCOHODO** workflow in the repository's Actions tab before merging or deploying.

Deployment is not automated by this workflow. Configure shop credentials through the deployment host's environment settings and follow the [release runbook](launch/RUNBOOK.md). If a future deployment job requires GitHub-held credentials, use repository/environment secrets, not workflow literals or committed env files.
