---
id: US-2.8
title: "Project dates + timeline (evidence-based)"
epic: EPIC-2
status: done
priority: P2
points: 2
sprint: sprint-2026-W28
version_shipped: 0.6.0
prd_ref: [FR-21]
depends_on: [US-2.7]
assignee: jindo9986
commit: PENDING
created: 2026-07-11
updated: 2026-07-11
---

## Goal

Record when each project actually happened, so the projects area can later show a
timeline of the child's project work over the years.

## Background

The LEGO project had only a coarse `date` ("2026-06"). To build a cross-project timeline
we need dated milestones — and they must be **real**, not invented. Two sources of hard
evidence exist: the **EXIF capture dates of the source photos** and the **write-up's file
timestamp**. The child's PDF itself only says "the idea started a few months ago", so the
true build start is unknown and is recorded as a caveat rather than guessed.

## Acceptance criteria

- [x] **AC-1** — `projectSchema` carries `dateStart`, `dateEnd`, `dateLabel`, and a `timeline` of dated milestones.
- [x] **AC-2** — The detail page shows a date chip in the hero and a Timeline section; the list card shows the date.
- [x] **AC-3** — Every date is evidence-based (photo EXIF / file timestamp); a provenance note states where the dates come from and that the build began earlier.

## Tasks

- [x] Extract EXIF capture dates from the source photos + the PDF's file date
- [x] Extend `projectSchema` (dates + milestones); populate `project.json`
- [x] Hero date chip, Timeline section, list-card date

## Implementation notes

Evidence for the LEGO project: prototype photos **2026-06-24**, ripcord-launcher photos
**2026-06-25**, the child presenting the collection **2026-06-26**, write-up PDF created
**2026-07-10**, published **2026-07-11**. The schema is generic, so future projects can
carry their own milestones and a `/projects` timeline view can be built on top.

## Changelog entry

See [CHANGELOG 0.6.0](../../CHANGELOG.md).

## Cross-references

- Epic: [EPIC-2](../epics/EPIC-2.md) · depends on [US-2.7](US-2.7-projects-showcase.md)
