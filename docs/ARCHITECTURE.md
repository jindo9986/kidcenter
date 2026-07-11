# ARCHITECTURE — KidCenter

> Backfilled 2026-06-23 from the codebase + git history.

## Overview

A **pnpm + Turborepo monorepo** of independent Next.js apps that share a UI package
and a design system, nothing else. Each app is a **static export** (`output: "export"`)
so it can be hosted on GitHub Pages. Two apps (`family`, `study`) load data at runtime
from a shared **Supabase** backend behind Google auth + row-level security; the other
apps ship no backend. Cross-app coupling is allowed **only** through `packages/*`.

## Tech stack

| Layer | Choice |
|---|---|
| Language | TypeScript (strict) |
| Framework | Next.js 16 (App Router), React 19 |
| Styling | Tailwind CSS v4 — `@theme` tokens, **no** `tailwind.config.js` |
| Shared UI | `@kidcenter/ui` (Button, Card, `cn`, design tokens in `styles.css`) |
| Content (portfolio) | JSON files + `zod`-validated loaders + `marked` |
| Backend (family, study) | Supabase (Postgres + Auth + RLS), `@supabase/supabase-js` |
| Charts (portfolio, study) | Hand-built inline SVG (no chart library) |
| Tests | Vitest |
| Package mgr / orchestration | pnpm workspaces + Turborepo |
| Hosting | GitHub Pages (single artifact, custom domain) |

## Components

```
apps/
├── portfolio   (:3001) — public bilingual capability site; PDF export; root deploy
├── family      (:3002) — Family Quest: tasks/points/rewards; Supabase; /quest
├── study       (:3003) — internal G1–4 dashboard; Supabase; parent-only; /study
└── learning    (:3000) — scaffold only
packages/
└── ui — @kidcenter/ui: shared components + Tailwind v4 tokens (consumed via transpilePackages)
```

## Route map

| App | Routes |
|---|---|
| portfolio | `/` (intro / home), `/profile`, `/assessment` |
| family | `/` (parent dashboard), `/activities`, `/approvals`, `/points`, `/rewards`, `/access` (allowlist), `/settings`, `/kid` (kid mode) |
| study | `/` (single auth-gated dashboard) |
| learning | `/` (scaffold placeholder) |

## Data

- **Portfolio** — no database. Content is 13 JSON files in `apps/portfolio/content/`
  (`profile`, `academic`, `achievements`, `skills-radar`, `teacher-comments`,
  `teacher-insights`, `character`, `story`, `journey`, `overall`, `gallery`,
  `signature`, + `projects/`), read at build time through `zod`-validated loaders in
  `src/lib/*` (`content.ts`, `story.ts`, `schemas.ts`, `locale.ts`, `markdown.ts`,
  `date.ts`, `asset.ts`).
- **Family Quest** — Postgres schema (migrations `0001–0005`): `families`, `members`
  (role `parent`|`child`), `allowlist_emails`, `activity_types`, `activities`,
  `task_instances`, `point_transactions`, `rewards`, `reward_redemptions`. Balances are
  a **view derived from the ledger** (`point_transactions`), never stored.
- **Study** — one table `study_docs(family_id, doc_key ∈ {academics,comments,
  assessment,roadmap}, data jsonb)` (migration `0006`) in the **same Supabase project**
  as family. Document-store (JSONB) because the data is read-mostly and document-shaped.
  Seeded locally from git-ignored `content/*.json` via `scripts/seed.mjs`.

## Security & privacy

- **Auth** — Google OAuth (Supabase). A `handle_new_auth_user` trigger provisions a
  `members` row only if the email is on `allowlist_emails`.
- **RLS** — every table is row-level-secured. Helpers `my_family_id()`, `is_parent()`,
  `current_member()`. Family: family-scoped reads, parent writes, child self-submit.
  Study: `study_docs` is **parent-only** read/write.
- **The repo is public.** Sensitive school data (portfolio content is intentionally
  public; family + study data is not) never enters git: `content/*.json`, `.env*`, and
  the report-card PDFs are git-ignored. DB-backed apps ship a **static shell only** and
  fetch data at runtime behind auth — nothing sensitive is baked into the bundle.

## Build & asset constraints

- **No `next/font/google`** — the build environment blocks network at build time, so
  fonts are **self-hosted** woff2 in each app's `src/app/fonts/`, loaded via `fonts.css`
  (AD-13). Reaching for Google Fonts breaks the build (LESSONS §7).
- **Asset prefixing** — bundled assets (`_next/*`, fonts) are prefixed by
  `assetPrefix`/`basePath`; raw `public/` media is prefixed at runtime by
  `apps/portfolio/src/lib/asset.ts` `asset()`. Both must match the deploy basePath, or
  assets 404 (LESSONS §8).
- **`public/.nojekyll`** disables Jekyll so underscore-prefixed `_next/` assets are served.
- **`public/CNAME`** = `www.huudaodinh.site` preserves the custom domain across deploys.

## Deployment

Single GitHub Actions workflow builds all three apps into one Pages artifact:
portfolio at the **root** (custom domain `www.huudaodinh.site`, no basePath, `CNAME`;
the old `jindo9986.github.io/kidcenter` URL redirects here), family at `/quest`, study at
`/study` (both with `NEXT_PUBLIC_BASE_PATH`). Supabase URL/anon key injected as Actions
secrets. `family` + `study` share one Supabase project (ref `mwscdqjqzoxwdkpmvuhj`).
See DEPLOY.md. Known chore: the workflow pins Node-20 actions (GitHub deprecation
warning, non-blocking — bump before Sep 2026).

## Architecture decisions

| ID | Title | Materialized by |
|----|-------|-----------------|
| AD-1 | pnpm workspaces + Turborepo; apps independent, coupling only in `packages/*` | US-1.1 |
| AD-2 | Next.js static export (`output: export`) for GitHub Pages hosting | US-1.1, US-1.4 |
| AD-3 | Tailwind v4 `@theme` tokens (no config), shared via `@kidcenter/ui/styles` | US-1.2 |
| AD-4 | Editorial Warm design system (Fraunces + Be Vietnam Pro, self-hosted woff2) | US-1.3 |
| AD-5 | Bilingual dual-render + CSS locale toggle — no i18n routing | US-2.1 |
| AD-6 | Content-driven portfolio: JSON + zod-validated loaders | US-2.1 |
| AD-7 | One Pages artifact: portfolio at root (custom domain), sub-apps at basePath | US-1.4 |
| AD-8 | Supabase (Postgres + Auth + RLS) as backend; public anon key, RLS-protected | US-3.2 |
| AD-9 | Google-only auth + email allowlist + provisioning trigger; balances derived from ledger | US-3.2, US-3.3 |
| AD-10 | Study reuses family's Supabase project; `study_docs` JSONB; parent-only RLS | US-4.1 |
| AD-11 | Sensitive data never committed — git-ignored + Supabase-at-runtime; static shell only | US-4.1, US-4.3 |
| AD-12 | Charts state true proportions — radar uses 0–100% domain, not a zoomed sub-range | US-4.2 |
| AD-13 | Self-hosted fonts (no `next/font/google`) — build has no network | US-1.3 |
| AD-14 | Kid mode is drivable by a parent on a shared device (no PIN); members are Google-only | US-3.5 |
