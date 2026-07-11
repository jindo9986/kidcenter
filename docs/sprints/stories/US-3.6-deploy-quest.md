---
id: US-3.6
title: "Deploy Family Quest at /quest + Editorial Warm"
epic: EPIC-3
status: done
priority: P1
points: 2
sprint: sprint-2026-W23
version_shipped: 0.2.0
prd_ref: [FR-14]
arch_ref: [AD-4, AD-7]
depends_on: [US-1.4]
assignee: jindo9986
commit: 59a4655, 570da0b
created: 2026-06-04
updated: 2026-06-04
---

## Goal

Ship Family Quest publicly (behind login) under `/quest`, styled with the shared design
system so it matches the rest of KidCenter.

## Background

CI builds the family app at `/quest` into the Pages artifact (basePath + Supabase
secrets); the app adopts the portfolio's Editorial Warm system (self-hosted fonts +
tokens). Materializes AD-7 + AD-4.

## Acceptance criteria

- [x] **AC-1** — The family app builds + deploys at `/quest` in the shared Pages artifact.
- [x] **AC-2** — It renders in the Editorial Warm design system.

## Tasks

- [x] CI build at `/quest` (basePath, Supabase secrets)
- [x] Adopt Editorial Warm (fonts + tokens)

## Changelog entry

See [CHANGELOG 0.2.0](../../CHANGELOG.md).

## Cross-references

- Epic: [EPIC-3](../epics/EPIC-3.md) · depends on [US-1.4](US-1.4-static-export-pages-deploy.md)
