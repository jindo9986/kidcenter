# SETUP — Development environment

## Prerequisites

- **Node** ≥ 20
- **pnpm** 10.x (repo pins `packageManager: pnpm@10.33.0`)
- A **Supabase** project (only for `family` and `study` — the two DB-backed apps)

## Clone & install

```bash
git clone https://github.com/jindo9986/kidcenter.git
cd kidcenter
pnpm install        # installs all workspaces + links @kidcenter/ui
```

## Run an app

Each app runs on its own port:

| App | Command | Port | Notes |
|---|---|---|---|
| Portfolio | `pnpm dev:portfolio` | 3001 | No backend; public site |
| Family Quest | `pnpm dev:family` | 3002 | Needs Supabase env (below) |
| Study | `pnpm dev:study` | 3003 | Needs Supabase env; parent-only |
| Learning | `pnpm dev:learning` | 3000 | Scaffold only |

`pnpm dev` runs everything via Turborepo.

## Environment variables

Only the DB-backed apps need env. Copy the example and fill from your Supabase
project (Project Settings → API):

```bash
cp apps/family/.env.local.example apps/family/.env.local
cp apps/study/.env.local.example  apps/study/.env.local
```

| Variable | Apps | Purpose | Secret? |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | family, study | Supabase project URL | No (public, RLS protects data) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | family, study | Supabase anon key | No |
| `SUPABASE_SERVICE_ROLE_KEY` | study (seeding only) | Bypasses RLS for `scripts/seed.mjs` | **Yes — never commit** |
| `NEXT_PUBLIC_BASE_PATH` | family, study (prod build) | Subpath (`/quest`, `/study`) | No |

`family` and `study` **share one Supabase project** (study reuses family's auth +
allowlist + RLS helpers). See ARCHITECTURE.md.

## Supabase (family + study)

1. Apply migrations in the SQL editor in order:
   `apps/family/supabase/migrations/0001…0005` then `apps/study/supabase/migrations/0006`.
2. Add your Google email to `allowlist_emails` with role `parent`.
3. Under Authentication → URL Configuration → **Redirect URLs**, add each app's
   dev + prod URL (e.g. `http://localhost:3002/**`, `http://localhost:3003/**`,
   `https://www.huudaodinh.site/quest/**`, `https://www.huudaodinh.site/study/**`).
   Missing entries make Google login redirect to the Site URL — see LESSONS §2.
4. Seed Study data locally (never enters the repo):
   `cd apps/study && node scripts/seed.mjs`.

## Build & test

```bash
pnpm --filter @kidcenter/<app> build   # static export → apps/<app>/out
pnpm --filter @kidcenter/<app> test    # vitest (portfolio, family, study)
cd apps/<app> && pnpm lint             # eslint
```

## Deploy

Push to `main` → GitHub Actions (`.github/workflows/deploy.yml`) builds portfolio
(root), family (`/quest`), study (`/study`) into one Pages artifact. See DEPLOY.md.
