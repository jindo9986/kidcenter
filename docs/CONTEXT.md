# CONTEXT — Decision log

> Append-only (RULE-7). Backfilled 2026-06-23 from git history + session notes; the
> decisions are real, the entry numbering was assigned retroactively.

---

## Phase 1 — Foundation & Portfolio (2026-06-03, shipped v0.1.0)

### D1. Monorepo of independent apps

**Context**: Multiple unrelated kid apps were planned; each has its own lifecycle.

**Decision**: One pnpm + Turborepo monorepo. Apps are fully independent; cross-app
coupling is allowed **only** through `packages/*` (the `@kidcenter/ui` package).

**Rationale**: shared tooling and design without coupling app logic; each app ships and
deploys on its own cadence.

**Impact**: `apps/*` + `packages/ui`; `transpilePackages` to consume the UI package.

**Date**: 2026-06-03 · **Version**: v0.1.0

### D2. Editorial Warm as the shared design language

**Decision**: A single design system (Fraunces + Be Vietnam Pro, indigo + medal-gold,
cream) documented in `apps/portfolio/DESIGN.md`, expressed as Tailwind v4 `@theme`
tokens in `@kidcenter/ui`.

**Rationale**: every app should feel considered and consistent without re-deciding
type/colour each time. DESIGN.md is the source of truth; deviations need approval.

**Impact**: family and study later adopt the same tokens + self-hosted fonts.

**Date**: 2026-06-03 · **Version**: v0.1.0

### D3. Bilingual via dual-render + CSS toggle (not i18n routing)

**Context**: Portfolio must read in both Vietnamese and English; the site is a static export.

**Decision**: Render both languages wrapped in `data-lang` spans; a `<LangToggle>` flips
`html[data-locale]` and CSS hides the inactive language. No locale routes.

**Rationale**: works with `output: export`, no duplicate routes, instant toggle, one URL
to share. Alternatives (next-intl / per-locale routes) rejected as overkill for a
one-page-per-section personal site.

**Date**: 2026-06-03 · **Version**: v0.1.0

### D4. Content-driven portfolio (JSON + zod)

**Decision**: Portfolio content lives in `content/*.json`, read through zod-validated
loaders. No CMS.

**Rationale**: fast to edit, type-safe, diffable; the child's real data changes often
during authoring.

**Date**: 2026-06-03 · **Version**: v0.1.0

### D5. Deploy portfolio at the root of a custom domain

**Decision**: GitHub Pages serves the portfolio at the **root** of
`www.huudaodinh.site` (CNAME, no basePath); later sub-apps mount at a basePath.

**Rationale**: the portfolio is the public face and deserves the bare domain; sub-apps
(`/quest`, `/study`) are internal and fine under a path.

**Date**: 2026-06-03 · **Version**: v0.1.0

### D12. Self-host fonts (no `next/font/google`)

**Context**: The build environment blocks network access at build time.

**Decision**: Self-host Fraunces + Be Vietnam Pro as woff2 in each app's
`src/app/fonts/`, loaded via a `fonts.css` `@font-face`; never use `next/font/google`.

**Rationale**: `next/font/google` fetches fonts during `next build` — with no network the
build fails or silently ships wrong fonts. Self-hosting is deterministic and offline-safe.

**Impact**: fonts are copied into portfolio, family, and study; `assetPrefix` prefixes
them. See LESSONS §7.

**Date**: 2026-06-03 · **Version**: v0.1.0

---

## Phase 2 — Family Quest (2026-06-04, shipped v0.2.0)

### D6. Supabase + Google-only auth + email allowlist

**Context**: Family Quest needs multi-device state, auth, and access control for a family.

**Decision**: Supabase (Postgres + Auth + RLS). Login is **Google-only**; access is
gated by an `allowlist_emails` table; a trigger provisions a `members` row on first
allowlisted sign-in. Manual member management + PINs were built then **dropped**.

**Rationale**: Google login removes password handling; the allowlist keeps it strictly
family-only; the trigger makes onboarding zero-touch. PINs added friction with no real
security benefit for a family app.

**Impact**: `members`, `allowlist_emails`, RLS helpers `my_family_id()` / `is_parent()`
/ `current_member()`.

**Date**: 2026-06-04 · **Version**: v0.2.0

### D7. Balances are derived from the ledger, never stored

**Decision**: `member_balances` is a Postgres **view** summing `point_transactions`.

**Rationale**: a single source of truth (the append-only ledger) can't drift from a
cached balance; every point change is auditable.

**Date**: 2026-06-04 · **Version**: v0.2.0

### D13. Kid mode is parent-drivable on a shared device (no PIN)

**Context**: Kids often use a shared family device; the earlier PIN + manual-member model
caused a duplicate-child bug and added friction.

**Decision**: A parent can pick a real child member and drive their kid view
(Today/Schedule/Points/Store/Leaderboard) via the `/kid` route + a "🧒 Chế độ trẻ" button
— no PIN. Kids may also self-login with their own Gmail. RLS lets parents act for their
family's children (migration `0004_kid_mode`).

**Rationale**: matches real usage (shared device), removes PIN friction, and — with
Google-only membership (D6) — eliminates the duplicate-child bug.

**Impact**: `/kid` route; `display_name` from Google; no manual member management. See
LESSONS §10, AD-14.

**Date**: 2026-06-04 · **Version**: v0.2.0

---

## Phase 3 — Portfolio research reframe (2026-06-13, shipped v0.3.0)

### D8. Research/science framing over communication framing

**Context**: The portfolio's message wandered toward "science communication".

**Decision**: Reframe the whole site around a **research/observation** direction, and
consolidate to 3 pages: Intro / Profile / Assessment.

**Rationale**: research framing is truer to the child's evidence (curiosity, investigation)
and reads as more credible to program reviewers than a communication angle.

**Impact**: Intro/Profile/Assessment copy + source docs realigned; shared top nav.

**Date**: 2026-06-13 · **Version**: v0.3.0

---

## Phase 4 — Study Dashboard (2026-06-23, shipped v0.4.0)

### D9. Study is a separate app, moved from local-JSON to Supabase + parent-only auth

**Context**: Study aggregates sensitive school records. First built local-only reading
JSON at build time; the user then wanted it viewable/deployable with access control.

**Decision**: Keep it a separate app but move data into the **shared** Supabase project
(`study_docs` JSONB), gate the whole app behind Google login, and restrict `study_docs`
to **parents only** via RLS. Reuse family's auth + allowlist code (copied, backend shared).

**Rationale**: a static export bakes its data into the bundle, so a local-JSON build
could never be public. Fetching from Supabase at runtime behind auth lets it deploy
safely. Reusing family's auth avoids rebuilding it.

**Impact**: migration 0006; `content/*.json` becomes a local seed source only; `/study`
added to the deploy.

**Date**: 2026-06-23 · **Version**: v0.4.0

### D10. Charts state true proportions (radar 0–100%)

**Context**: A [70,100] radial domain was used to "show shape" among near-perfect
scores, but it made a near-top score look mid-range.

**Decision**: Use the true **0–100%** domain; reference rings at 5/10 and 10/10. Show
precise Cambridge Progression scores (with a source chip), not rounded grades.

**Rationale**: a chart must not distort — a parent reading it should see 8.5 as 8.5.
Precision + honesty over a prettier-but-misleading shape. See LESSONS §3.

**Date**: 2026-06-23 · **Version**: v0.4.0

### D11. Sensitive data never enters the public repo

**Context**: The repo is public; family and study hold real school data (grades,
teacher comments, report-card PDFs).

**Decision**: git-ignore `content/*.json`, `.env*`, and the report-card PDF backup;
DB-backed apps ship a static shell and fetch data at runtime behind auth + RLS. The
spec describes data *shape* only.

**Rationale**: open code, closed data. Even un-deployed, committing to a public repo
leaks — so the boundary is git, not deployment. See LESSONS §1.

**Date**: 2026-06-23 · **Version**: v0.4.0
