---
id: US-3.7
title: "Critical-path E2E (approval + redemption) + mobile design-review pass"
epic: EPIC-3
status: backlog
priority: P2
points: 3
sprint:
version_shipped:
prd_ref: [FR-12, FR-13]
depends_on: [US-3.4, US-3.5]
created: 2026-06-23
updated: 2026-06-23
---

## Goal

Lock in the two revenue-critical flows of Family Quest with end-to-end tests so a
regression can't silently break the loop, and confirm the UI matches the design tokens on
mobile.

## Background

Family Quest shipped (v0.2.0) without automated E2E coverage — the "M8" work from the
original plan. The two flows that must not break are: (1) task **approval** (child submits
→ parent approves → points awarded via the ledger) and (2) reward **redemption** (child
requests → parent approves → balance debited). A design-review pass against
`@kidcenter/ui` tokens (mobile-first) is also outstanding.

## Acceptance criteria

- [ ] **AC-1** — Given a submitted task, When a parent approves it, Then points are awarded and the child's balance reflects it (E2E).
- [ ] **AC-2** — Given enough points, When a child requests a reward and a parent approves, Then the balance is debited and the redemption is fulfilled (E2E).
- [ ] **AC-3** — Given a rejected task, When the child resubmits, Then it re-enters the approval queue (E2E).
- [ ] **AC-4** — A design-review pass confirms parent + kid screens match `@kidcenter/ui` tokens on mobile.

## Tasks

- [ ] Set up webapp-testing (Playwright) against a seeded Supabase test family
- [ ] E2E: approval flow, redemption flow, reject→resubmit
- [ ] Mobile design-review pass; log findings

## Cross-references

- Epic: [EPIC-3](../epics/EPIC-3.md) · depends on [US-3.4](US-3.4-parent-admin.md), [US-3.5](US-3.5-kid-mode.md)
