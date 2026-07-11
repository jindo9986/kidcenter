---
id: US-3.1
title: "Task/points domain logic (TDD)"
epic: EPIC-3
status: done
priority: P0
points: 3
sprint: sprint-2026-W23
version_shipped: 0.2.0
prd_ref: [FR-10]
assignee: jindo9986
commit: 0436fab
created: 2026-06-04
updated: 2026-06-04
---

## Goal

Encode the family-quest rules (tasks, approvals, points, balances) as pure, tested
functions before any UI or database, so the core is correct and portable.

## Background

Pure domain layer built test-first. Balances are computed from the transaction ledger.
Precedes the Supabase schema (US-3.2), which persists these rules.

## Acceptance criteria

- [x] **AC-1** — Core rules (task lifecycle, point math, balance derivation) are pure functions.
- [x] **AC-2** — The domain has unit tests (vitest) covering the happy + edge paths.

## Tasks

- [x] Domain types + rules
- [x] Vitest unit tests

## Changelog entry

See [CHANGELOG 0.2.0](../../CHANGELOG.md).

## Cross-references

- Epic: [EPIC-3](../epics/EPIC-3.md) · Decision: [D7](../../CONTEXT.md)
