---
id: US-1.1
title: "Scaffold the pnpm + Turborepo monorepo"
epic: EPIC-1
status: done
priority: P0
points: 3
sprint: sprint-2026-W23
version_shipped: 0.1.0
prd_ref: [FR-1]
arch_ref: [AD-1, AD-2]
assignee: jindo9986
commit: 5902c02
created: 2026-06-03
updated: 2026-06-03
---

## Goal

Stand up the repository so multiple independent kid apps can live together with shared
tooling, and every later app has a place to slot in.

## Background

First commit of the project. Establishes pnpm workspaces + Turborepo with the initial
`learning` + `portfolio` apps. Materializes AD-1 (independent apps, coupling only in
`packages/*`) and AD-2 (static export target).

## Acceptance criteria

- [x] **AC-1** — Given the repo, When `pnpm install` runs, Then all workspaces install and link.
- [x] **AC-2** — `apps/learning` and `apps/portfolio` exist as independent Next.js apps.
- [x] **AC-3** — Turborepo orchestrates `dev` / `build` / `lint` across apps.

## Tasks

- [x] pnpm workspace + Turborepo config
- [x] Scaffold `apps/learning` and `apps/portfolio`
- [x] Root scripts (`dev:*` per app)

## Changelog entry

See [CHANGELOG 0.1.0](../../CHANGELOG.md) — monorepo scaffold.

## Cross-references

- Epic: [EPIC-1](../epics/EPIC-1.md) · Decision: [D1](../../CONTEXT.md)
