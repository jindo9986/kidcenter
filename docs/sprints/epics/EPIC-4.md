---
id: EPIC-4
title: "Study Dashboard — internal G1–4 academic analytics"
status: done
prd_ref:
  - FR-15
  - FR-16
  - FR-17
  - FR-18
arch_ref:
  - AD-10
  - AD-11
  - AD-12
created: 2026-06-23
updated: 2026-06-23
---

## Goal

Turn four years of report cards into one internal picture — score trends, a current
capability map, a synthesis of teacher feedback, and an improvement roadmap — that a
parent uses **with** the child to plan learning. Parent-only; sensitive data stays out
of the public repo.

## Overview

### Business context

Study reuses EPIC-3's Supabase project (auth + allowlist + RLS helpers) and adds one
`study_docs` JSONB table restricted to parents. It ships a static shell and loads data
at runtime behind Google login, so it can deploy at `/study` without exposing school
records. Charts are hand-built SVG and were tuned for honesty and precision.

### Out of scope

- The public portfolio — EPIC-2.
- A data-entry CMS for Study — data is edited in `content/*.json` and re-seeded.

## FR Coverage

| FR | Story | Status |
|----|-------|--------|
| FR-15 | [US-4.1](../stories/US-4.1-study-dashboard.md) | ✅ done (v0.4.0) |
| FR-16 | [US-4.1](../stories/US-4.1-study-dashboard.md) | ✅ done (v0.4.0) |
| FR-17 | [US-4.2](../stories/US-4.2-chart-refinements.md) | ✅ done (v0.4.0) |
| FR-18 | [US-4.3](../stories/US-4.3-private-data-handling.md) | ✅ done (v0.4.0) |

## Stories

| US | Title | Pri | Points | Status |
|---|---|---|---|---|
| US-4.1 | Internal G1–4 dashboard, DB-backed + parent-only auth | P0 | 8 | ✅ done |
| US-4.2 | Chart refinements (trends, radar, precise + unit scores) | P1 | 5 | ✅ done |
| US-4.3 | Private data handling (gitignore, seed, PDF backup) | P0 | 2 | ✅ done |

## Cross-cutting invariants

- `study_docs` is parent-only (RLS); children/non-allowlisted see nothing (AD-10).
- No school data in the bundle or the repo — static shell + Supabase-at-runtime (AD-11).
- Charts state true proportions; exact values shown next to marks (AD-12).
