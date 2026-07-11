---
id: US-2.2
title: "Portfolio page: academic record, awards, skills radar"
epic: EPIC-2
status: done
priority: P1
points: 5
sprint: sprint-2026-W23
version_shipped: 0.1.0
prd_ref: [FR-5]
arch_ref: [AD-6]
assignee: jindo9986
commit: cc6e161, 1c4c3b1, ab45158, 69c5184
created: 2026-06-03
updated: 2026-06-03
---

## Goal

Present the child's real record credibly on one page: academic results across grades
1–4, awards, a skills radar, and a synthesis of teacher comments.

## Background

Assembles the portfolio from content: section UI, academic record + score matrix, skills
radar (SVG), award ordering, teacher-comment synthesis, Overall Assessment + Growth
Journey. Iterated for scannability and a humble-yet-confident tone.

## Acceptance criteria

- [x] **AC-1** — Academic record renders for grades 1–4 from content (all Cambridge, correct school years).
- [x] **AC-2** — A skills radar renders without clipped axis labels.
- [x] **AC-3** — Teacher comments are synthesised into a visual strengths summary.

## Tasks

- [x] Section components + page assembly
- [x] Academic score matrix + skills radar (padded viewBox)
- [x] Teacher-comment synthesis + Overall Assessment + Growth Journey

## Changelog entry

See [CHANGELOG 0.1.0](../../CHANGELOG.md).

## Cross-references

- Epic: [EPIC-2](../epics/EPIC-2.md)
