---
id: EPIC-5
title: "Learning — daily activities & schedule for the kids"
status: backlog
prd_ref:
  - FR-19
created: 2026-06-03
updated: 2026-06-23
---

## Goal

Give the kids (and parent) a place to manage daily learning activities and a daily
schedule — the original fourth app in the KidCenter plan.

## Overview

### Business context

`apps/learning` (port 3000) was scaffolded with the monorepo (layout + placeholder page)
but never built out. It is **not deployed**. This epic tracks the intended app so the
scaffold isn't mistaken for a shipped product.

### Out of scope

- Anything already owned by portfolio / family / study.

## FR Coverage

| FR | Story | Status |
|----|-------|--------|
| FR-19 | [US-5.1](../stories/US-5.1-learning-scaffold.md) | 📋 backlog |

## Stories

| US | Title | Pri | Points | Status |
|---|---|---|---|---|
| US-5.1 | Learning app — scope & first build | P3 | 8 | 📋 backlog |

## Cross-cutting invariants

- Independent app; shares only `@kidcenter/ui` + Editorial Warm (AD-1, AD-4).
