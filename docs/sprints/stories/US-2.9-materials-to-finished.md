---
id: US-2.9
title: "Materials → finished visual (cross-fade effect)"
epic: EPIC-2
status: done
priority: P2
points: 2
sprint: sprint-2026-W28
version_shipped: 0.7.0
prd_ref: [FR-22]
depends_on: [US-2.7]
assignee: jindo9986
commit: a129ea7
created: 2026-07-11
updated: 2026-07-11
---

## Goal

Show, at a glance, that the child turned a pile of loose LEGO pieces into working
spinning tops — the raw-materials-to-finished-product arc that a static gallery hides.

## Background

The source photos include two shots of the raw parts laid out (wheels, tyres, gears,
axles, the ripcord launcher). They were previously dropped because they are not in the
child's PDF. They are imagery, not prose, so adding them does not touch the fidelity rule
for the write-up.

## Acceptance criteria

- [x] **AC-1** — A "materials → finished" section shows the raw parts on one side and the finished builds on the other, with an arrow between them.
- [x] **AC-2** — Both panels cross-fade through their photos (parts every 4s; the six prototypes every 2s), CSS-only — no JS, works under static export.
- [x] **AC-3** — `prefers-reduced-motion` disables the animation and shows a single still image.

## Tasks

- [x] Restore + optimise the two parts photos into `public/`
- [x] `materials` block in `projectSchema` + `project.json`
- [x] `.morph-stack` / `.morph-arrow` CSS keyframes + the section on the detail page

## Changelog entry

See [CHANGELOG 0.7.0](../../CHANGELOG.md).

## Cross-references

- Epic: [EPIC-2](../epics/EPIC-2.md) · depends on [US-2.7](US-2.7-projects-showcase.md)
