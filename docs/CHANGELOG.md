# CHANGELOG

All notable changes to KidCenter. Backfilled 2026-06-23 from git history as four
milestone releases; each entry lists the representative landing commit for that
window. Reverse-chronological.

## [Unreleased]

(empty — track here while in dev but not yet shipped)

---

## [0.4.0] — 2026-06-23 — Study Dashboard (internal G1–4 academic analytics) — v0.4.0

New `apps/study`: an internal, parent-only dashboard aggregating four years of report
cards into score trends, a capability map, teacher-feedback synthesis, an internal
assessment, and an improvement roadmap. DB-backed behind Google auth so it deploys
safely without exposing school data.

### Added
- `apps/study` scaffold, Editorial Warm styling, dependency-free SVG charts (LineTrend small-multiples + radar).
- Supabase `study_docs` table (migration 0006, JSONB) with parent-only RLS; Google auth gate reusing family's allowlist.
- Local `scripts/seed.mjs` seeding from git-ignored `content/*.json`.
- Combined view then per-unit dots; precise Cambridge Progression scores on the radar + summary table.
- `/study` build wired into the Pages deploy; report-card PDF backup folder (git-ignored).

### Changed
- Trend lines connect G1→G4 continuously (normalised %); radar covers every summarised subject.

### Fixed
- Radar used a [70,100] radial domain that made a near-top score read as mid-range — switched to the true 0–100% domain.

**Commit**: 4b9853b

---

## [0.3.0] — 2026-06-13 — Portfolio: 3-page research-framed IA — v0.3.0

Reworked the portfolio into a focused 3-page site (Intro / Profile / Assessment) with
a consistent research/science framing, bilingual throughout.

### Added
- Independent AI Assessment page (`/assessment`) rebuilt as an evidence-backed story (STEAM Venn, reading/award photos), bilingual.
- Bilingual self-introduction page (`/intro`); field-trip (harvest) photo as the profile avatar.
- Shared top nav across the 3 pages.

### Changed
- Shifted messaging from science-communication to a research direction across Intro, Profile, and Assessment.
- Intro copy de-duplicated; VI hero greeting softened ("Chào" → "Xin chào").

**Commit**: 398645c

---

## [0.2.0] — 2026-06-04 — Portfolio storytelling home + Family Quest app — v0.2.0

Turned the portfolio into a storytelling home and shipped the Family Quest chores/points app.

### Added
- Portfolio storytelling version promoted to the home page (v1 → `/profile`); real-life photo essays; capability star-ratings + Science×Art×Language Venn; bilingual home story.
- `apps/family` (Family Quest): TDD domain logic; Supabase schema + RLS + provisioning trigger; Google auth; parent admin (dashboard, members, activities CMS, approvals, points, rewards); child + kid mode (Today, store, leaderboard, weekly/monthly schedule); email allowlist management; deploy at `/quest`; Editorial Warm styling.

### Changed
- Family members are Google-only (dropped manual member management + PIN).

### Fixed
- Allow redo/resubmit of rejected tasks; stray EXIF orientation on a home photo (strip + cache-bust rename).

**Commit**: c868409

---

## [0.1.0] — 2026-06-03 — Monorepo + Portfolio v1 (capability site) — v0.1.0

First release: the monorepo scaffold and a bilingual, content-driven capability
portfolio deployed to a custom domain.

### Added
- pnpm + Turborepo monorepo with `learning` + `portfolio` apps and shared `@kidcenter/ui`.
- Portfolio: zod-validated content loaders, bilingual `Localized` renderer + language toggle, section UI, academic record across grades 1–4, awards, academic score matrix + skills radar, teacher-comment synthesis, Overall Assessment + Growth Journey.
- Editorial Warm design system (DESIGN.md) applied to code; 44px touch targets; sticky section nav / left ToC.
- Professional PDF profile; real OG/meta + link-preview image; favicon/app icons from the child's photo.
- Static export + GitHub Pages deploy; serve at root for custom domain `www.huudaodinh.site` (CNAME, no basePath).

**Commit**: bb0d610
