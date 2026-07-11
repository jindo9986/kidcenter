---
id: US-3.5
title: "Child / kid mode (Today, store, leaderboard, schedule)"
epic: EPIC-3
status: done
priority: P1
points: 5
sprint: sprint-2026-W23
version_shipped: 0.2.0
prd_ref: [FR-13]
arch_ref: [AD-14]
depends_on: [US-3.2]
assignee: jindo9986
commit: 80ace05, 8ae1d74, 2c5d00c, c868409
created: 2026-06-04
updated: 2026-06-04
---

## Goal

Give kids a simple, motivating view: today's tasks to submit, their points, a rewards
store, a leaderboard, and a weekly/monthly schedule — usable on a kid's own device or on
a shared family device driven by a parent.

## Background

Child UI + kid mode at `/kid` (selector, Today, points, store, leaderboard) plus a
weekly/monthly schedule view. A parent can pick a real child member and drive their kid
view without a PIN (migration `0004_kid_mode`; RLS lets parents act for their family's
children). `display_name` comes from Google; combined with Google-only membership (D6)
this removed a duplicate-child bug. Rejected tasks can be redone/resubmitted. See
[D13](../../CONTEXT.md), [LESSONS §10](../../LESSONS.md).

## Acceptance criteria

- [x] **AC-1** — A child sees today's tasks and can submit them for approval.
- [x] **AC-2** — Points, a rewards store, and a leaderboard are visible in kid mode.
- [x] **AC-3** — A rejected task can be redone/resubmitted; a weekly/monthly schedule shows.

## Tasks

- [x] Child UI + kid mode (Today, points, store, leaderboard)
- [x] Weekly/monthly schedule; restore parent kid-mode (no PIN)
- [x] Allow redo/resubmit of rejected tasks

## Changelog entry

See [CHANGELOG 0.2.0](../../CHANGELOG.md).

## Cross-references

- Epic: [EPIC-3](../epics/EPIC-3.md) · depends on [US-3.2](US-3.2-supabase-auth-rls.md)
