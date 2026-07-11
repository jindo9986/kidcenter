# DEPLOY — KidCenter production runbook

Backfilled 2026-06-23. Hosting: **GitHub Pages**, one artifact, custom domain
`www.huudaodinh.site`.

## Pipeline

Push to `main` → `.github/workflows/deploy.yml` runs:

1. `pnpm install --frozen-lockfile`
2. Build **portfolio** (static export, **no** basePath — served at the domain root).
3. Build **family** with `NEXT_PUBLIC_BASE_PATH=/quest` + Supabase secrets → copy `out` into `portfolio/out/quest`.
4. Build **study** with `NEXT_PUBLIC_BASE_PATH=/study` + Supabase secrets → copy `out` into `portfolio/out/study`.
5. Upload `apps/portfolio/out` as the Pages artifact → deploy.

Result: portfolio at `/`, Family Quest at `/quest`, Study at `/study`.

## Required GitHub Actions secrets

| Secret | Used by | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | family, study builds | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | family, study builds | Supabase anon key (public, RLS-protected) |

The service-role key is **never** in CI — it's only used locally for `apps/study/scripts/seed.mjs`.

## Custom domain

`apps/portfolio/public/CNAME` = `www.huudaodinh.site`. Portfolio builds with **no
basePath** so it serves at the root; sub-apps carry their basePath. The old
`jindo9986.github.io/kidcenter` URL redirects here.

- ⚠️ **Do NOT** set `NEXT_PUBLIC_BASE_PATH=/kidcenter` for the portfolio — that was for
  the old github.io subpath and 404s every asset at `/kidcenter/_next/...` on the custom
  domain (LESSONS §8).
- `apps/portfolio/public/.nojekyll` must exist so underscore-prefixed `_next/` assets are
  served. Raw `public/` media is prefixed via `src/lib/asset.ts` `asset()`.

## Supabase configuration (one-time / when adding an app)

Project ref `mwscdqjqzoxwdkpmvuhj` (shared by family + study); Google OAuth.

- Apply migrations in order: family `0001–0005` (schema, RLS, provision trigger, kid_mode,
  allowlist_admin), then study `0006` (study_docs).
- If Google login fails with *"Unable to exchange external code"*, re-paste the Google
  client id/secret in Auth → Providers → Google (LESSONS §9).
- Add each surface to Authentication → URL Configuration → **Redirect URLs**:
  `https://www.huudaodinh.site/quest/**`, `https://www.huudaodinh.site/study/**`
  (+ localhost dev URLs). Missing entries break Google login (LESSONS §2).
- Seed Study data locally (never in CI): `cd apps/study && node scripts/seed.mjs`.

## Verify a release

1. Actions run is green.
2. `https://www.huudaodinh.site/` (portfolio), `/quest` (login → Family Quest),
   `/study` (login as a parent → dashboard) all load.
3. For DB-backed apps, data appears only after Google login (nothing sensitive in the bundle).

## Known issues

- The workflow pins **Node-20** actions (GitHub deprecation warning, non-blocking). Bump
  the action versions before Sep 2026.
