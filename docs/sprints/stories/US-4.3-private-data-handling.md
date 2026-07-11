---
id: US-4.3
title: "Private data handling (gitignore, seed script, PDF backup)"
epic: EPIC-4
status: done
priority: P0
points: 2
sprint: sprint-2026-W26
version_shipped: 0.4.0
prd_ref: [FR-18]
arch_ref: [AD-11]
depends_on: [US-4.1]
assignee: jindo9986
commit: 4b9853b
created: 2026-06-23
updated: 2026-06-23
---

## Goal

Guarantee that the child's sensitive school data never enters the public repo, while
keeping it easy to seed the DB and back up the source documents locally.

## Background

`content/*.json`, `.env*`, and the report-card PDF backup folder are git-ignored;
`scripts/seed.mjs` loads the local JSON into `study_docs` with the service-role key; the
design spec was sanitised to describe data *shape* only. Materializes AD-11. See LESSONS §1.

## Acceptance criteria

- [x] **AC-1** — Sensitive data (`content/*.json`, `.env*`, PDFs) is git-ignored and absent from the repo.
- [x] **AC-2** — `scripts/seed.mjs` upserts the four docs into `study_docs` from local JSON.
- [x] **AC-3** — Docs/specs contain no real scores, comments, or keys.

## Tasks

- [x] gitignore content JSON, env, and the report-card PDF backup folder
- [x] Seed script (service-role) + `.env.local.example` + supabase README
- [x] Sanitise the design spec (shape-only)

## Changelog entry

See [CHANGELOG 0.4.0](../../CHANGELOG.md).

## Cross-references

- Epic: [EPIC-4](../epics/EPIC-4.md) · Decision: [D11](../../CONTEXT.md) · Lesson: [§1](../../LESSONS.md)
