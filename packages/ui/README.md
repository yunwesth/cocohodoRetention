# Shared UI — @cocohodo/ui

Small reusable presentation primitives used by both apps. The package currently exports `@cocohodo/ui/brand-mark` from `src/brand-mark.tsx`.

Install through `npm ci` at the repository root. npm links this workspace into both apps. Next.js transpiles its TypeScript source through `transpilePackages`.

Keep this package independent of app routes, environment variables, Supabase clients, business rules and secret values. Add only genuinely shared UI here; app-specific features stay with their owning app. The apps' builds and type checks validate the shared component.
