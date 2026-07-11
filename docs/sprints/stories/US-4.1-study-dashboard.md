---
id: US-4.1
title: "Internal G1–4 study dashboard, DB-backed + parent-only auth"
epic: EPIC-4
status: done
priority: P0
points: 8
sprint: sprint-2026-W26
version_shipped: 0.4.0
prd_ref: [FR-15, FR-16]
arch_ref: [AD-10, AD-11]
depends_on: [US-3.2]
assignee: jindo9986
commit: 3c78768
created: 2026-06-23
updated: 2026-06-23
---

## Goal

Give the parent one internal view of four years of report cards — trends, a capability
map, teacher-feedback synthesis, an internal assessment, and an improvement roadmap — to
use with the child, without exposing any of it publicly.

## Background

`apps/study`: Editorial-Warm dashboard with dependency-free SVG charts. Data moved from a
local-JSON build to the shared Supabase project (`study_docs` JSONB, migration 0006) with
parent-only RLS; the app is gated behind Google login reusing family's auth + allowlist,
and loads data at runtime so it can deploy safely. Materializes AD-10 + AD-11. See the
design spec: [`docs/superpowers/specs/2026-06-23-study-dashboard-design.md`](../../superpowers/specs/2026-06-23-study-dashboard-design.md).

## Acceptance criteria

- [x] **AC-1** — The dashboard shows trends, a capability map, teacher-comment synthesis, an assessment, and a roadmap.
- [x] **AC-2** — Data loads from `study_docs` at runtime; RLS restricts it to parents; non-parents see a login/denied screen.
- [x] **AC-3** — No school data is baked into the static bundle.

## Tasks

- [x] Scaffold `apps/study` + Editorial Warm + SVG charts
- [x] Migration 0006 `study_docs` + parent-only RLS; copy auth/allowlist from family
- [x] Client auth gate + runtime fetch; wire `/study` into deploy

## Changelog entry

See [CHANGELOG 0.4.0](../../CHANGELOG.md).

## Cross-references

- Epic: [EPIC-4](../epics/EPIC-4.md) · Decision: [D9](../../CONTEXT.md) · depends on [US-3.2](US-3.2-supabase-auth-rls.md)
