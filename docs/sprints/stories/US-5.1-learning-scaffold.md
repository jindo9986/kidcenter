---
id: US-5.1
title: "Learning app — scope & first build (daily activities + schedule)"
epic: EPIC-5
status: backlog
priority: P3
points: 8
sprint:
version_shipped:
prd_ref: [FR-19]
created: 2026-06-03
updated: 2026-06-23
---

## Goal

Turn the `apps/learning` scaffold into a working app for managing the kids' daily learning
activities and a daily schedule.

## Background

`apps/learning` (port 3000) exists only as a scaffold (`layout.tsx`, placeholder
`page.tsx`, `globals.css`, favicon) from the initial monorepo commit. The product intent
(from [BRIEF.md](../../BRIEF.md) / [kidcenter-project memory]) is daily activities +
schedule management. Scope, data model, and whether it needs a backend are open — this
story should start with a brainstorming pass ([D-routing]: superpowers:brainstorming) before
implementation.

## Acceptance criteria

- [ ] **AC-1** — A brainstorming + design pass defines scope, data model, and backend need.
- [ ] **AC-2** — A first usable build ships (activities list + a daily/weekly schedule view).
- [ ] **AC-3** — It reuses `@kidcenter/ui` + Editorial Warm and follows the monorepo conventions.

## Tasks

- [ ] Brainstorm scope + design (superpowers:brainstorming, then frontend-design)
- [ ] Decide data model / backend (static vs Supabase)
- [ ] First build + deploy decision

## Cross-references

- Epic: [EPIC-5](../epics/EPIC-5.md)
