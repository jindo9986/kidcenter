---
id: US-2.1
title: "Bilingual content engine (schemas, loaders, toggle)"
epic: EPIC-2
status: done
priority: P0
points: 3
sprint: sprint-2026-W23
version_shipped: 0.1.0
prd_ref: [FR-4, FR-5]
arch_ref: [AD-5, AD-6]
assignee: jindo9986
commit: bc220d9, 50a727f, 15d2a70, b317a13
created: 2026-06-03
updated: 2026-06-03
---

## Goal

Let the portfolio present every string in Vietnamese and English from validated content
files, with an instant language toggle and no locale routing.

## Background

zod schemas + file-based content loaders + a `Localized` renderer (dual `data-lang`
spans) + a `<LangToggle>` that flips `html[data-locale]`; CSS hides the inactive
language. Materializes AD-5 (dual-render, no i18n routing) + AD-6 (content-driven).

## Acceptance criteria

- [x] **AC-1** — Content loads from JSON through zod-validated loaders; invalid content fails the build.
- [x] **AC-2** — Every localized string renders both VI and EN; the toggle switches instantly and persists.
- [x] **AC-3** — No per-locale routes (works under `output: export`).

## Tasks

- [x] zod schemas + locale constants + markdown renderer
- [x] File-based content loaders with validation
- [x] `Localized` renderer + `LangToggle` + locale/print CSS

## Changelog entry

See [CHANGELOG 0.1.0](../../CHANGELOG.md).

## Cross-references

- Epic: [EPIC-2](../epics/EPIC-2.md) · Decisions: [D3](../../CONTEXT.md), [D4](../../CONTEXT.md)
