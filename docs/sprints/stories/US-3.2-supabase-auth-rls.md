---
id: US-3.2
title: "Supabase schema + RLS + Google auth + provisioning"
epic: EPIC-3
status: done
priority: P0
points: 5
sprint: sprint-2026-W23
version_shipped: 0.2.0
prd_ref: [FR-11]
arch_ref: [AD-8, AD-9]
assignee: jindo9986
commit: 43d3014, 09650ad, 5db9ec3
created: 2026-06-04
updated: 2026-06-04
---

## Goal

Persist the domain in Supabase with strict access control: Google login, a family
allowlist, and row-level security so data is family-scoped and role-aware.

## Background

Migrations `0001–0003`: schema (`families`, `members`, `allowlist_emails`, activities,
tasks, points ledger, rewards), RLS policies + helpers (`my_family_id()`, `is_parent()`,
`current_member()`), and a `handle_new_auth_user` trigger that provisions a member only
for allowlisted emails. Browser Supabase client + typed data layer + Google auth session
helpers. Materializes AD-8 + AD-9.

## Acceptance criteria

- [x] **AC-1** — Every table has RLS; a signed-in user only sees their family's rows.
- [x] **AC-2** — Google sign-in provisions a `members` row iff the email is allowlisted.
- [x] **AC-3** — Parents can write CMS/ledger tables; children have restricted policies.

## Tasks

- [x] Schema + RLS + provisioning trigger (migrations 0001–0003) + setup runbook
- [x] Supabase browser client + typed data layer
- [x] Google auth provider + session helpers

## Changelog entry

See [CHANGELOG 0.2.0](../../CHANGELOG.md).

## Cross-references

- Epic: [EPIC-3](../epics/EPIC-3.md) · Decision: [D6](../../CONTEXT.md) · reused by [US-4.1](US-4.1-study-dashboard.md)
