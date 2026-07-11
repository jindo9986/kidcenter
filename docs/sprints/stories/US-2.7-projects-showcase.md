---
id: US-2.7
title: "Projects showcase — /projects list + detail, first project (LEGO spinning tops)"
epic: EPIC-2
status: done
priority: P1
points: 5
sprint: sprint-2026-W28
version_shipped: 0.5.0
prd_ref: [FR-20]
arch_ref: [AD-5, AD-6]
depends_on: [US-2.1]
assignee: jindo9986
commit: 7a7f22d, d1139d2, 33bb8cc
created: 2026-07-11
updated: 2026-07-11
---

## Goal

Give the portfolio a dedicated **Projects** area that presents the child's real
project work, starting with his self-authored LEGO "Tyre Flywheel Spinner" science
project — faithfully, bilingual, in the site's Editorial Warm style.

## Background

The portfolio had a scaffolded but empty projects system (`getProjects()` reading
`content/projects/<slug>/{meta.json, vi.md, en.md}`, rendered only as a hidden section
on `/profile`). The user wants project *pages*. The first project is
`docs/sources/LEGO_Tyre_Flywheel_Spinner/` — a PDF write-up by the child (6 spinning-top
prototypes, the physics, a spinning-time data table) + ~17 photos. Content is the child's
own — the task is faithful HTML presentation, bilingual (VI/EN), not a rewrite.

## Acceptance criteria

- [ ] **AC-1** — `/projects` lists project cards (cover + title + tag + summary) linking to a detail page.
- [ ] **AC-2** — `/projects/[slug]` renders the full project (hero + the child's content + prototype photos + spinning-time table), bilingual via the `Localized`/`data-lang` pattern.
- [ ] **AC-3** — "Projects" is in the top nav (Intro · Profile · Projects · Assessment); `/profile` links to it.
- [ ] **AC-4** — Content is faithful to the child's PDF (his words + data), only formatted; images optimised into `public/`.

## Tasks

- [x] Optimise + copy 10 photos into `public/projects/lego-tyre-flywheel-spinner/`
- [x] Structured `projectSchema` + `project.json`; author bilingual content
- [x] `/projects` list + designed `/projects/[slug]` detail (generateStaticParams); nav link; profile teaser
- [x] Build + lint + verify

## Implementation notes

- Structured `projectSchema` (`project.json`) drives a designed detail page (Editorial
  Warm, mirrors Intro/Assessment): graph-paper hero, image+text prototype rows (~1/3-width
  photos), launcher photo + closing narrative, and the spinning-time table.
- **Fidelity rule:** the content follows the child's PDF **verbatim** — no invented
  headings, cards, labels, badges, or summaries; nothing added or omitted. Earlier passes
  that condensed/re-structured the text were reverted.
- **Correct images:** the prototype photos were **extracted directly from the PDF in page
  order** (`pypdf`), guaranteeing each image matches its prototype — no manual guessing.
- `ProjectPreview` powers the grid + `/profile` teaser; replaced `ProjectCard`.
- Photos optimised with `sips` into `public/`; raw sources stay in `docs/sources/`
  (untracked, not committed).

## Changelog entry

See [CHANGELOG 0.5.0](../../CHANGELOG.md).

## Cross-references

- Epic: [EPIC-2](../epics/EPIC-2.md) · reuses [US-2.1](US-2.1-bilingual-content-engine.md) content engine
