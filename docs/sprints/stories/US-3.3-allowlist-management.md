---
id: US-3.3
title: "Email allowlist management"
epic: EPIC-3
status: done
priority: P1
points: 2
sprint: sprint-2026-W23
version_shipped: 0.2.0
prd_ref: [FR-11]
arch_ref: [AD-9]
depends_on: [US-3.2]
assignee: jindo9986
commit: 354bdd4, bb2f95b
created: 2026-06-04
updated: 2026-06-04
---

## Goal

Let parents control exactly who can access the family app by managing the email
allowlist in the UI, and simplify membership to Google-only.

## Background

An allowlist management screen (add/remove family emails with a role) backed by an RLS
policy (migration 0005) so parents can edit their own family's allowlist from the client.
Manual member management + PINs were dropped — members are Google-only (D6).

## Acceptance criteria

- [x] **AC-1** — Parents can add/remove allowlisted emails (with role) from the UI.
- [x] **AC-2** — Only parents can mutate their own family's allowlist (RLS).
- [x] **AC-3** — Membership is Google-only; no manual member/PIN management remains.

## Tasks

- [x] Allowlist management screen + data layer
- [x] Drop manual member management + PIN

## Changelog entry

See [CHANGELOG 0.2.0](../../CHANGELOG.md).

## Cross-references

- Epic: [EPIC-3](../epics/EPIC-3.md) · Decision: [D6](../../CONTEXT.md) · depends on [US-3.2](US-3.2-supabase-auth-rls.md)
