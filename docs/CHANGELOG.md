# CHANGELOG

All notable changes to KidCenter. Backfilled 2026-06-23 from git history as four
milestone releases; each entry lists the representative landing commit for that
window. Reverse-chronological.

## [Unreleased]

(empty — track here while in dev but not yet shipped)

---

## [0.6.0] — 2026-07-11 — Project dates + timeline — v0.6.0

Projects now carry real, evidence-based dates so a timeline of the child's project work
can be built over time.

### Added
- `projectSchema` gains `dateStart` / `dateEnd` / `dateLabel` and a `timeline` of dated milestones (+ a provenance note).
- Detail page: a date chip in the hero and a **Timeline** section; the `/projects` card shows the date.
- LEGO project milestones, all evidence-based: prototype photos 2026-06-24, ripcord-launcher photos 06-25, presenting the collection 06-26, write-up PDF 07-10, published 07-11. Dates come from photo EXIF + the write-up's file timestamp; the note records that the child says building started "a few months" earlier, so no start date is invented.

**Commit**: PENDING

---

## [0.5.0] — 2026-07-11 — Portfolio Projects area + first project — v0.5.0

Added a dedicated Projects area to the portfolio and presented the child's self-authored
LEGO "Tyre Flywheel Spinner" science project (his own words + 6 prototype photos + a
spinning-time data table), bilingual.

### Added
- `/projects` list page + `/projects/[slug]` detail page (static export via generateStaticParams); "Projects" in the top nav.
- First project: `content/projects/lego-tyre-flywheel-spinner/project.json` — structured bilingual content that follows the child's write-up **verbatim** (intro, 6 prototypes, closing narrative, spinning-time table). Prototype photos are the **exact images extracted from the child's PDF, in order**, so each matches its prototype.
- A designed detail page (Editorial Warm, mirrors Intro/Assessment): graph-paper hero, physics concept cards, numbered prototype rows (photo + parts chip + full text), the launcher photo + closing narrative, a spinning-time bar chart, and a brand closing band. The visual style is presentation only — every word is the child's, verbatim.
- `ProjectPreview` card for the grid + `/profile` teaser.

### Changed
- `projectSchema` replaces the old markdown project model; `/profile` projects section links to the detail page via `ProjectPreview`.

### Removed
- `ProjectCard` and the markdown project body (superseded by structured content + the designed detail page).

**Commit**: 7a7f22d, d1139d2, 33bb8cc, 3a9ae8d, 69d22eb

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
