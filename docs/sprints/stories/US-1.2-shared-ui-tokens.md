---
id: US-1.2
title: "Shared @kidcenter/ui package + Tailwind v4 tokens"
epic: EPIC-1
status: done
priority: P0
points: 2
sprint: sprint-2026-W23
version_shipped: 0.1.0
prd_ref: [FR-1, FR-2]
arch_ref: [AD-3]
assignee: jindo9986
commit: bc220d9
created: 2026-06-03
updated: 2026-06-03
---

## Goal

Give apps a single source of shared components and design tokens so they don't each
re-implement buttons, cards, or colour/type scales.

## Background

`packages/ui` = `@kidcenter/ui`: `Button`, `Card`, `cn`, and Tailwind v4 `@theme` tokens
in `styles.css`, consumed via `transpilePackages`. Materializes AD-3 (Tailwind v4 tokens,
no config).

## Acceptance criteria

- [x] **AC-1** — Apps import `@kidcenter/ui` components and the shared token stylesheet.
- [x] **AC-2** — Design tokens live in `@theme` blocks; there is no `tailwind.config.js`.

## Tasks

- [x] `Button`, `Card`, `cn`, `index.ts`
- [x] `styles.css` design tokens
- [x] Wire `transpilePackages` in consuming apps

## Changelog entry

See [CHANGELOG 0.1.0](../../CHANGELOG.md).

## Cross-references

- Epic: [EPIC-1](../epics/EPIC-1.md) · Decision: [D2](../../CONTEXT.md)
