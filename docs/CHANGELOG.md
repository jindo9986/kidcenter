# CHANGELOG

All notable changes to KidCenter. Backfilled 2026-06-23 from git history as four
milestone releases; each entry lists the representative landing commit for that
window. Reverse-chronological.

## [Unreleased]

(empty — track here while in dev but not yet shipped)

---

## [0.9.1] — 2026-10-14 — Latest awards + apex domain as canonical — v0.9.1

Three new 2026 awards, plus the domain fix that stops the apex from breaking on every
deploy.

### Added
- Portfolio `/profile` → "Thành tích" gains three awards (21 → 24): **Bronze Medal — HKIMO Math Olympiad (2026)** and **Honourable Mention — HKISO Science Olympiad (2026)** under *Giải Quốc tế*, and **1st Place — Dream School painting contest (2026-2027)** under *Cấp Trường & Thành phố*. All bilingual, rendered by the existing `Achievements` grouping — no new components.

### Fixed
- The "HC Olympic · QG & QT" headline stat counted every national/international entry regardless of medal. An honourable mention carries `medal: "none"`, so it would have read **14** under a label that says *huy chương*. Now filters `medal !== "none"` → a true **13**. See LESSONS §3.
- `apps/portfolio/public/CNAME` said `www.huudaodinh.site` while the Pages custom domain was set to the apex. Because the CNAME inside the deploy artifact wins, every deploy reset the domain to `www` and left the apex 301ing away. The artifact CNAME is now `huudaodinh.site`. See LESSONS §11.

### Changed
- `metadataBase` → `https://huudaodinh.site`, so `og:url` / `og:image` match the canonical host instead of pointing at `www`.

### Notes
- The apex is canonical; `www` 301s to it (GitHub Pages does this automatically from the CNAME). A browser holding the *previous* permanent `apex → www` redirect can still see a loop until its site data is cleared — server-side the chain is clean.

**Commit**: _pending_

---

## [0.9.0] — 2026-07-20 — Speaking & Writing (school rubric) — v0.9.0

Added the Speaking and Writing results marked in the same round as the NGRT, kept
deliberately separate from it.

### Added
- Portfolio `/profile` → the section is now "English proficiency" (`#english`) with two clearly-labelled blocks: the **NGRT** (external standardised test, GL Education) and **Speaking & Writing** marked against Vinschool The Harmony's own First English Language rubric — Speaking **16/20**, Writing **17/20** with *Structure / Organization* a perfect **5/5**. Bars are zero-based, so 16/20 reads as 80%.
- Study dashboard → the same results as their own section, plus the link back to the NGRT gap (comprehension ahead, word-level vocabulary behind).

### Changed
- `reading-benchmark.json` → `english-assessment.json`, restructured as `{ reading, productive }`; `ReadingBenchmark` → `EnglishAssessment`.

### Notes
- Only the totals and the one Structure/Organization sub-score were supplied; the remaining criteria are left empty rather than invented. A school rubric mark is never converted to or compared against the NGRT's SAS/stanine scale.

**Commit**: 797bddc

---

## [0.8.0] — 2026-07-20 — NGRT reading benchmark (honest public + full internal) — v0.8.0

Added the child's external English reading benchmark to both surfaces, reported honestly
rather than cherry-picked.

### Added
- Portfolio `/profile` → "External benchmark: English reading": overall SAS 100 / PR 50 / stanine 5 / reading age 10:05, **both** components (Passage Comprehension stanine 7 above average AND Sentence Completion stanine 2 below average), the comprehension breakdown by question type, an honest takeaway, and the norm context (standardised on UK native speakers; sat as an EAL learner). GL's clinical profile label and intervention recommendations are deliberately **not** published.
- Study dashboard → full NGRT report incl. GL's profile label, GL's recommended next steps, and a "how to read this" note for the parent.
- Study roadmap → new focus area "Vốn từ & nhận diện từ (tiếng Anh)", grounded in the NGRT gap between comprehension and word-level reading.

**Commit**: b7cab6d

---

## [0.7.3] — 2026-07-11 — Cache-bust the rotated parts photo — v0.7.3

### Fixed
- The parts photo was rotated to landscape but kept the same filename, so browsers and the Pages CDN kept serving the cached portrait version — the exact trap recorded in LESSONS §5. Renamed `parts.jpg` → `parts-flatlay.jpg` so the URL changes and every client fetches the landscape image.

**Commit**: e6821dc

---

## [0.7.2] — 2026-07-11 — Materials section: no cropping + new copy — v0.7.2

### Fixed
- The materials photos were `object-cover` inside a 4:3 box, which zoomed in and clipped the corners of the landscape parts photo. Both photos now use `object-contain` inside an equal-height framed box, so nothing is cropped.

### Changed
- The Materials section now leads with its own heading + description: the project began with components made for an entirely different purpose (LEGO wheels, tyres, gears and axles built for vehicle models) that were re-engineered into spinning tops through iterative design. Bilingual; the section eyebrow was dropped as redundant.

**Commit**: 9daf05b

---

## [0.7.1] — 2026-07-11 — Simplify the materials visual — v0.7.1

### Changed
- The "materials → finished" visual is now a single landscape photo of the loose parts next to the photo of the child with all the finished tops on the table (the parts photo was rotated to landscape). Dropped the per-prototype cross-fade cycle; only the arrow keeps its subtle nudge.

### Removed
- The `.morph-stack` cross-fade CSS and the second parts photo (no longer used).

**Commit**: 89d6522

---

## [0.7.0] — 2026-07-11 — Materials → finished visual — v0.7.0

Show the raw LEGO parts turning into the finished spinning tops.

### Added
- `materials` block in `projectSchema` + the two raw-parts photos.
- A "materials → finished" section on the project page: raw parts on one side, the six finished prototypes cross-fading on the other, with an animated arrow between them. CSS-only (no JS), and `prefers-reduced-motion` falls back to a single still image.

**Commit**: a129ea7

---

## [0.6.0] — 2026-07-11 — Project dates + timeline — v0.6.0

Projects now carry real, evidence-based dates so a timeline of the child's project work
can be built over time.

### Added
- `projectSchema` gains `dateStart` / `dateEnd` / `dateLabel` and a `timeline` of dated milestones (+ a provenance note).
- Detail page: a date chip in the hero and a **Timeline** section; the `/projects` card shows the date.
- LEGO project milestones, all evidence-based: prototype photos 2026-06-24, ripcord-launcher photos 06-25, presenting the collection 06-26, write-up PDF 07-10, published 07-11. Dates come from photo EXIF + the write-up's file timestamp; the note records that the child says building started "a few months" earlier, so no start date is invented.

**Commit**: ecef1df

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
