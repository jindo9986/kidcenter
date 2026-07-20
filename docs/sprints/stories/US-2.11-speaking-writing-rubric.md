---
id: US-2.11
title: "Speaking & Writing — school rubric results, kept separate from the NGRT"
epic: EPIC-2
status: done
priority: P2
points: 2
sprint: sprint-2026-W28
version_shipped: 0.9.0
prd_ref: [FR-23]
depends_on: [US-2.10]
assignee: jindo9986
commit: pending
created: 2026-07-20
updated: 2026-07-20
---

## Goal

Add the Speaking and Writing results that were marked in the same assessment round as
the NGRT, without letting them be mistaken for part of that standardised test.

## Background

Speaking and Writing were **not** part of the NGRT. They were marked by Vinschool The
Harmony against the school's own rubric for its First English Language programme — four
criteria per skill, five points each, twenty in total. Results: **Speaking 16/20**,
**Writing 17/20**, with Writing's *Structure / Organization* criterion at a perfect
**5/5**.

Two scales, two authorities. A school rubric mark is not comparable to a standardised
SAS or stanine, and converting between them would invent a claim the data does not
support. So the portfolio section was widened from "English reading" to "English
proficiency" and split into two visibly distinct blocks, each labelled with its own
source.

Only the totals and the one Structure/Organization sub-score were provided. The other
three criteria per skill are unknown and are left empty rather than guessed.

## Acceptance criteria

- [x] **AC-1** — Speaking 16/20 and Writing 17/20 appear on `/profile` and in the study dashboard, bilingual on the portfolio.
- [x] **AC-2** — The school-rubric block is visually and textually separate from the NGRT block, each naming its source; the copy states the rubric is school-internal and not convertible to the NGRT scale.
- [x] **AC-3** — Writing's Structure / Organization 5/5 is shown as a highlighted sub-score; no other criterion is invented.
- [x] **AC-4** — Progress bars are zero-based, so 16/20 renders at 80% of the track (LESSONS §3).

## Tasks

- [x] Restructure `reading-benchmark.json` → `english-assessment.json` as `{ reading, productive }`; `englishAssessmentSchema` + `getEnglishAssessment`
- [x] `ReadingBenchmark` → `EnglishAssessment` component with the two-source layout
- [x] `/profile` section renamed to "Năng lực tiếng Anh / English proficiency" (`#english`) + nav entry
- [x] `productiveSkills` in study `academics.json` + typed block + dashboard section
- [x] Build + lint both apps; privacy audit (no rubric scores in the public study bundle)

## Implementation notes

- Both surfaces state the same numbers; the study copy adds the link back to the NGRT
  gap (comprehension ahead, word-level vocabulary behind), which the perfect
  Structure/Organization score reinforces rather than contradicts.
- The study app needs a re-seed (`node scripts/seed.mjs`) for the new block to appear.

## Changelog entry

See [CHANGELOG 0.9.0](../../CHANGELOG.md).

## Cross-references

- Epic: [EPIC-2](../epics/EPIC-2.md) · Story: [US-2.10](US-2.10-reading-benchmark.md) · Lesson: [§3 charts state true proportions](../../LESSONS.md)
