---
id: US-2.6
title: "3-page IA (Intro / Profile / Assessment) with research framing"
epic: EPIC-2
status: done
priority: P1
points: 3
sprint: sprint-2026-W24
version_shipped: 0.3.0
prd_ref: [FR-9]
arch_ref: [AD-5]
assignee: jindo9986
commit: 127204f, d3f5aea, 743fdf2, 398645c
created: 2026-06-13
updated: 2026-06-13
---

## Goal

Consolidate the site into three coherent pages — Intro, Profile, Assessment — unified by
a research/science framing and a shared top nav.

## Background

Added a bilingual self-introduction (`/intro`); used the field-trip (harvest) photo as
the profile avatar; aligned Profile + Intro to the research direction (dropping the
science-communication framing); de-duplicated intro copy; softened the VI hero greeting.

## Acceptance criteria

- [x] **AC-1** — The site is exactly Intro / Profile / Assessment with a shared top nav.
- [x] **AC-2** — Messaging is consistently research-framed across all three pages.
- [x] **AC-3** — Intro reads cleanly in VI + EN (no duplicated opener; softer greeting).

## Tasks

- [x] Build `/intro` (bilingual) + harvest-photo avatar
- [x] Align Profile/Intro to research framing; shared nav
- [x] De-dup intro opener; VI greeting "Chào" → "Xin chào"

## Changelog entry

See [CHANGELOG 0.3.0](../../CHANGELOG.md).

## Cross-references

- Epic: [EPIC-2](../epics/EPIC-2.md) · Decision: [D8](../../CONTEXT.md)
