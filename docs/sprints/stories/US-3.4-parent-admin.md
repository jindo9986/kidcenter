---
id: US-3.4
title: "Parent admin (activities CMS, approvals, points, rewards)"
epic: EPIC-3
status: done
priority: P1
points: 8
sprint: sprint-2026-W23
version_shipped: 0.2.0
prd_ref: [FR-12]
depends_on: [US-3.2]
assignee: jindo9986
commit: 4f61fe0, ee4e4f9, 8018fb1
created: 2026-06-04
updated: 2026-06-04
---

## Goal

Give parents everything they need to run the family economy: a dashboard, a members view,
an activities CMS, a task-approval queue, a points ledger, and a rewards store — usable
on a phone.

## Background

Parent UI across routes `/` (dashboard), `/activities` (CMS, create/edit + fix mobile
overflow), `/approvals`, `/points`, `/rewards`, `/access` (allowlist), `/settings`.
Reworked mobile-first with bottom tabs + a Settings hub.

## Acceptance criteria

- [x] **AC-1** — Parents create/edit activities, approve/reject submissions, and manage rewards.
- [x] **AC-2** — Points changes go through the ledger; history is visible with time.
- [x] **AC-3** — The admin is mobile-first (bottom tabs + Settings) without overflow.

## Tasks

- [x] Dashboard, members, activities CMS, approvals, points, rewards
- [x] Mobile-first bottom tabs + Settings hub
- [x] Edit activities + fix mobile overflow

## Changelog entry

See [CHANGELOG 0.2.0](../../CHANGELOG.md).

## Cross-references

- Epic: [EPIC-3](../epics/EPIC-3.md) · depends on [US-3.2](US-3.2-supabase-auth-rls.md)
