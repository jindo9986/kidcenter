---
id: US-2.10
title: "NGRT reading benchmark — honest public summary + full internal report"
epic: EPIC-2
status: done
priority: P1
points: 3
sprint: sprint-2026-W28
version_shipped: 0.8.0
prd_ref: [FR-23]
depends_on: [US-2.2, US-4.1]
assignee: jindo9986
commit: PENDING
created: 2026-07-20
updated: 2026-07-20
---

## Goal

Record the child's external English reading benchmark (NGRT) where it is genuinely
useful — as an actionable signal in the private study dashboard — and, on the public
portfolio, as an honestly-reported external data point rather than a cherry-picked win.

## Background

The NGRT report (GL Education, 30/06/2026, age 10:04) is **not** a strong headline
result: overall SAS 100 / PR 50 (exactly average against UK native-speaker norms) with
Passage Comprehension stanine **7** (above average) but Sentence Completion stanine **2**
(below average). GL's own profile labels the child a "Dependent Reader" and recommends
intervention.

The parent asked to publish it as evidence of language ability. That framing was pushed
back on: publishing only the strong component would misrepresent the data (the same
distortion rejected in [LESSONS §3](../../LESSONS.md)), and publishing GL's clinical
label on a public application portfolio could harm the child. The parent then chose the
"full/honest" option for both surfaces.

The genuinely useful signal is the **gap** between the two components: comprehension is
ahead, word-level vocabulary/decoding is behind — which sharpens the study roadmap.

## Acceptance criteria

- [x] **AC-1** — The public portfolio reports **both** components (PC stanine 7 above average AND SC stanine 2 below average), the overall SAS/PR/stanine/reading age, and the PC breakdown — nothing cherry-picked.
- [x] **AC-2** — The public page states the norm context (standardised on UK native speakers; Tin sits it as an EAL learner) and does **not** publish GL's clinical profile label or its SEND/intervention recommendations.
- [x] **AC-3** — The private study dashboard carries the **full** report, including GL's profile label, its recommended next steps, and a "how to read this" note for the parent.
- [x] **AC-4** — The study roadmap gains a word-level vocabulary/decoding focus area citing the NGRT gap; the source PDF is backed up git-ignored.

## Tasks

- [x] `reading-benchmark.json` + schema + loader + `ReadingBenchmark` component + `/profile` section & nav entry
- [x] Full NGRT block in study `academics.json` + dashboard section (profile label, GL next steps, parent reading)
- [x] New roadmap focus area "Vốn từ & nhận diện từ (tiếng Anh)" grounded in the NGRT gap
- [x] Back up the NGRT PDF into the git-ignored `reports-pdf/`; build + lint + privacy audit

## Implementation notes

- **Split by surface, not by spin:** the public page shows the *scores* in full; the
  private dashboard adds the clinical framing. Nothing shown publicly contradicts the
  private record — the public version is a strict subset.
- Privacy audit confirmed: study content + the PDF are git-ignored, and no clinical
  terms ("Dependent Reader", intervention, phonics, SEND) appear in portfolio content.

## Changelog entry

See [CHANGELOG 0.8.0](../../CHANGELOG.md).

## Cross-references

- Epic: [EPIC-2](../epics/EPIC-2.md) · Lesson: [§3 charts state true proportions](../../LESSONS.md) · Decision: [D11 private data](../../CONTEXT.md)
