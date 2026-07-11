---
id: EPIC-2
title: "Portfolio — bilingual capability site for the child"
status: done
prd_ref:
  - FR-4
  - FR-5
  - FR-6
  - FR-7
  - FR-8
  - FR-9
  - FR-20
arch_ref:
  - AD-5
  - AD-6
created: 2026-06-03
updated: 2026-07-11
---

## Goal

A credible, bilingual (VI/EN) public site that presents one child's real academic
record, awards, and an evidence-backed assessment — good enough to send to schools and
programs, and exportable to a clean PDF.

## Overview

### Business context

The portfolio is KidCenter's public face, deployed at the root of the custom domain. It
evolved across three passes: a content-driven capability profile (v0.1.0), a storytelling
home with photo essays (v0.2.0), and a focused 3-page research-framed IA (v0.3.0). It is
content-driven (JSON + zod) and has no backend.

### Out of scope

- Any private/school-internal analytics — owned by EPIC-4 (Study).
- Backend/auth — the portfolio is fully static and public.

## FR Coverage

| FR | Story | Status |
|----|-------|--------|
| FR-4 | [US-2.1](../stories/US-2.1-bilingual-content-engine.md) | ✅ done (v0.1.0) |
| FR-5 | [US-2.2](../stories/US-2.2-portfolio-page.md) | ✅ done (v0.1.0) |
| FR-6 | [US-2.3](../stories/US-2.3-storytelling-home.md) | ✅ done (v0.2.0) |
| FR-7 | [US-2.4](../stories/US-2.4-pdf-meta-og.md) | ✅ done (v0.1.0) |
| FR-8 | [US-2.5](../stories/US-2.5-assessment-page.md) | ✅ done (v0.3.0) |
| FR-9 | [US-2.6](../stories/US-2.6-three-page-research-ia.md) | ✅ done (v0.3.0) |
| FR-20 | [US-2.7](../stories/US-2.7-projects-showcase.md) | ✅ done (v0.5.0) |

## Stories

| US | Title | Pri | Points | Status |
|---|---|---|---|---|
| US-2.1 | Bilingual content engine | P0 | 3 | ✅ done |
| US-2.2 | Portfolio page: record, awards, radar | P1 | 5 | ✅ done |
| US-2.3 | Storytelling home with photo essays | P1 | 5 | ✅ done |
| US-2.4 | PDF export + meta/OG/favicons | P2 | 3 | ✅ done |
| US-2.5 | Independent AI Assessment page | P1 | 5 | ✅ done |
| US-2.6 | 3-page IA (Intro/Profile/Assessment) | P1 | 3 | ✅ done |
| US-2.7 | Projects showcase (/projects + first project) | P1 | 5 | ✅ done |

## Cross-cutting invariants

- Every user-facing string renders in both VI and EN via the `Localized` pattern (AD-5).
- Content is JSON validated by zod loaders; no hard-coded copy in components (AD-6).
