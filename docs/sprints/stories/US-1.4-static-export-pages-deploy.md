---
id: US-1.4
title: "Static export + GitHub Pages deploy pipeline"
epic: EPIC-1
status: done
priority: P0
points: 3
sprint: sprint-2026-W23
version_shipped: 0.1.0
prd_ref: [FR-3]
arch_ref: [AD-2, AD-7]
assignee: jindo9986
commit: 07f434f, 6bfdff7
created: 2026-06-03
updated: 2026-06-23
---

## Goal

Ship every app to the web from one pipeline, with the portfolio at the root of the
custom domain and sub-apps mounted under a path.

## Background

`.github/workflows/deploy.yml` builds each app's static export into one Pages artifact:
portfolio at the root (custom domain `www.huudaodinh.site`, CNAME, no basePath), family
at `/quest`, study at `/study` (via `NEXT_PUBLIC_BASE_PATH`). Materializes AD-2 + AD-7.
Extended over time as family (v0.2.0) and study (v0.4.0) shipped.

## Acceptance criteria

- [x] **AC-1** — Push to `main` builds + deploys all apps into one Pages artifact.
- [x] **AC-2** — Portfolio serves at the domain root (CNAME, no basePath).
- [x] **AC-3** — Sub-apps serve under their basePath (`/quest`, `/study`).

## Tasks

- [x] Static export config per app (`output: export`)
- [x] Deploy workflow + CNAME
- [x] basePath wiring for sub-apps; Supabase secrets injected

## Changelog entry

See [CHANGELOG 0.1.0](../../CHANGELOG.md); extended in 0.2.0 and 0.4.0.

## Cross-references

- Epic: [EPIC-1](../epics/EPIC-1.md) · Decision: [D5](../../CONTEXT.md) · [DEPLOY.md](../../../DEPLOY.md)
