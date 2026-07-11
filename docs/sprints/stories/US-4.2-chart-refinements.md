---
id: US-4.2
title: "Chart refinements — continuous trends, all-subject true-scale radar, precise + unit scores"
epic: EPIC-4
status: done
priority: P1
points: 5
sprint: sprint-2026-W26
version_shipped: 0.4.0
prd_ref: [FR-17]
arch_ref: [AD-12]
depends_on: [US-4.1]
assignee: jindo9986
commit: 198b9ab, f926d5b, 2bdd356, 95f42bb
created: 2026-06-23
updated: 2026-06-23
---

## Goal

Make Study's charts precise and honest so the assessment they support is trustworthy.

## Background

Iterated the charts: trend lines connect G1→G4 continuously (normalised %); the radar
covers every summarised subject; the radar switched from a [70,100] domain to the true
0–100% domain (a near-top score no longer reads as mid-range); scores use precise Cambridge Progression
values with a source chip; a combined chart was tried then dropped in favour of per-unit
dots on each subject chart. Materializes AD-12. See LESSONS §3–4.

## Acceptance criteria

- [x] **AC-1** — Trend lines are continuous across grades on a normalised % axis.
- [x] **AC-2** — The radar shows all summarised subjects on a true 0–100% domain with exact values labelled.
- [x] **AC-3** — Per-subject charts show that year's individual unit scores.

## Tasks

- [x] Continuous trend lines; all-subject radar
- [x] True 0–100% radar domain (fix 8.5≈5 distortion)
- [x] Precise scores + source chip; drop combined chart, add per-unit dots

## Changelog entry

See [CHANGELOG 0.4.0](../../CHANGELOG.md).

## Cross-references

- Epic: [EPIC-4](../epics/EPIC-4.md) · Decision: [D10](../../CONTEXT.md) · Lessons: [§3](../../LESSONS.md), [§4](../../LESSONS.md)
