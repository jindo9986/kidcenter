---
id: EPIC-1
title: "Platform Foundation — monorepo, shared UI, design system, deploy"
status: done
prd_ref:
  - FR-1
  - FR-2
  - FR-3
arch_ref:
  - AD-1
  - AD-2
  - AD-3
  - AD-4
  - AD-7
created: 2026-06-03
updated: 2026-06-23
---

## Goal

Give every KidCenter app a shared skeleton — one monorepo, one UI package, one design
system, one deploy pipeline — so each app can focus on its own product and still feel
consistent and ship the same way.

## Overview

### Business context

Before this epic there was no repo. This epic establishes the substrate the three
product epics build on: pnpm + Turborepo workspaces, the `@kidcenter/ui` package
(Tailwind v4 tokens + Button/Card/`cn`), the Editorial Warm design system, and a single
GitHub Pages pipeline. It owns *how apps are built and shipped*, not any app feature.

### Out of scope

- Any app's product features — owned by EPIC-2/3/4.
- Backend/auth — introduced by EPIC-3 (Supabase), reused by EPIC-4.

## FR Coverage

| FR | Story | Status |
|----|-------|--------|
| FR-1 | [US-1.1](../stories/US-1.1-monorepo-scaffold.md) | ✅ done (v0.1.0) |
| FR-2 | [US-1.3](../stories/US-1.3-editorial-warm-design-system.md) | ✅ done (v0.1.0) |
| FR-3 | [US-1.4](../stories/US-1.4-static-export-pages-deploy.md) | ✅ done (v0.1.0) |

## Stories

| US | Title | Pri | Points | Status |
|---|---|---|---|---|
| US-1.1 | Monorepo scaffold (pnpm + Turborepo) | P0 | 3 | ✅ done |
| US-1.2 | Shared `@kidcenter/ui` + Tailwind v4 tokens | P0 | 2 | ✅ done |
| US-1.3 | Editorial Warm design system (DESIGN.md) | P1 | 3 | ✅ done |
| US-1.4 | Static export + GitHub Pages deploy | P0 | 3 | ✅ done |

## Cross-cutting invariants

- Apps are independent; cross-app code lives only in `packages/*` (AD-1).
- Every app is a static export (`output: export`) hostable on GitHub Pages (AD-2).
- Design tokens come from `@kidcenter/ui/styles`; DESIGN.md is the source of truth (AD-4).
