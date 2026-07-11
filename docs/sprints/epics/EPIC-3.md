---
id: EPIC-3
title: "Family Quest — tasks, points & rewards for the family"
status: done
prd_ref:
  - FR-10
  - FR-11
  - FR-12
  - FR-13
  - FR-14
arch_ref:
  - AD-8
  - AD-9
  - AD-14
created: 2026-06-04
updated: 2026-06-23
---

## Goal

A chores/points/rewards app the whole family uses: parents assign and approve tasks and
run a rewards store; kids see today's tasks, submit them, watch their points, and redeem
rewards — all gated to the family by a Google-login allowlist.

## Overview

### Business context

The first backend-backed app. Introduces the Supabase substrate (Postgres + Auth + RLS)
that EPIC-4 later reuses. Domain logic is pure and TDD-tested; the ledger is the single
source of truth for balances. Deployed at `/quest`.

### Out of scope

- Study/academic analytics — EPIC-4.
- Manual member management + PINs — built then dropped (D6); members are Google-only.

## FR Coverage

| FR | Story | Status |
|----|-------|--------|
| FR-10 | [US-3.1](../stories/US-3.1-domain-logic.md) | ✅ done (v0.2.0) |
| FR-11 | [US-3.2](../stories/US-3.2-supabase-auth-rls.md) | ✅ done (v0.2.0) |
| FR-12 | [US-3.4](../stories/US-3.4-parent-admin.md) | ✅ done (v0.2.0) |
| FR-13 | [US-3.5](../stories/US-3.5-kid-mode.md) | ✅ done (v0.2.0) |
| FR-14 | [US-3.6](../stories/US-3.6-deploy-quest.md) | ✅ done (v0.2.0) |

## Stories

| US | Title | Pri | Points | Status |
|---|---|---|---|---|
| US-3.1 | Task/points domain logic (TDD) | P0 | 3 | ✅ done |
| US-3.2 | Supabase schema + RLS + Google auth | P0 | 5 | ✅ done |
| US-3.3 | Email allowlist management | P1 | 2 | ✅ done |
| US-3.4 | Parent admin (CMS, approvals, points, rewards) | P1 | 8 | ✅ done |
| US-3.5 | Child / kid mode | P1 | 5 | ✅ done |
| US-3.6 | Deploy at /quest + Editorial Warm | P1 | 2 | ✅ done |
| US-3.7 | Critical-path E2E (approval + redemption) | P2 | 3 | 📋 backlog |

## Remaining work (M8, optional)

- **US-3.7** — critical-path E2E tests (approval + redemption flows) and a design-review
  pass against `@kidcenter/ui` tokens (mobile-first). Not yet done.

## Cross-cutting invariants

- Every table is RLS-protected; access requires a provisioned `members` row (AD-9).
- Balances are always derived from `point_transactions`, never stored (D7).
- Members are Google-only; access is the `allowlist_emails` table (D6).
