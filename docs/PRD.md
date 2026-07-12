# PRD — KidCenter

> Backfilled 2026-06-23. English canonical. Requirements reconstructed from shipped
> behaviour in git history; all are `done` unless noted.

## Overview

KidCenter is a monorepo of independent web apps for the family's children. See
[BRIEF.md](BRIEF.md) for problem/solution and [ARCHITECTURE.md](ARCHITECTURE.md) for
the technical shape. This PRD enumerates the functional requirements and maps them to
epics and user stories.

## Functional Requirements

| ID    | Requirement                                                                            | Epic   | Status             |
| ----- | -------------------------------------------------------------------------------------- | ------ | ------------------ |
| FR-1  | A monorepo hosts multiple independent apps sharing one UI package                      | EPIC-1 | ✅ shipped (v0.1.0) |
| FR-2  | A shared design system is applied consistently across apps                             | EPIC-1 | ✅ shipped (v0.1.0) |
| FR-3  | All apps deploy to GitHub Pages from a single pipeline                                 | EPIC-1 | ✅ shipped (v0.1.0) |
| FR-4  | Portfolio content is bilingual (VI/EN) with a language toggle                          | EPIC-2 | ✅ shipped (v0.1.0) |
| FR-5  | Content-driven pages present academic record, awards, and skills                       | EPIC-2 | ✅ shipped (v0.1.0) |
| FR-6  | A storytelling home weaves narrative + real-life photos                                | EPIC-2 | ✅ shipped (v0.2.0) |
| FR-7  | The portfolio exports to a professional PDF and has rich meta/OG                       | EPIC-2 | ✅ shipped (v0.1.0) |
| FR-8  | An evidence-backed independent assessment page                                         | EPIC-2 | ✅ shipped (v0.3.0) |
| FR-9  | A 3-page IA (Intro / Profile / Assessment) with a research framing                     | EPIC-2 | ✅ shipped (v0.3.0) |
| FR-20 | A Projects area showcasing the child's own project work                                | EPIC-2 | ✅ shipped (v0.5.0) |
| FR-21 | Projects carry evidence-based dates + a timeline of milestones                         | EPIC-2 | ✅ shipped (v0.6.0) |
| FR-10 | A task/points domain with balances derived from a ledger                               | EPIC-3 | ✅ shipped (v0.2.0) |
| FR-11 | Supabase schema + RLS + Google auth + email allowlist                                  | EPIC-3 | ✅ shipped (v0.2.0) |
| FR-12 | Parent admin: activities CMS, approvals, points, rewards                               | EPIC-3 | ✅ shipped (v0.2.0) |
| FR-13 | Child / kid mode: Today, store, leaderboard, schedule                                  | EPIC-3 | ✅ shipped (v0.2.0) |
| FR-14 | Family Quest deploys at `/quest` with the shared design                                | EPIC-3 | ✅ shipped (v0.2.0) |
| FR-15 | Aggregate G1–4 report cards into trends, capability map, synthesis, roadmap            | EPIC-4 | ✅ shipped (v0.4.0) |
| FR-16 | Study is DB-backed and parent-only auth-gated so it can deploy safely                  | EPIC-4 | ✅ shipped (v0.4.0) |
| FR-17 | Study charts are precise and honest (continuous trends, true-scale radar, unit detail) | EPIC-4 | ✅ shipped (v0.4.0) |
| FR-18 | Sensitive school data never enters the public repo                                     | EPIC-4 | ✅ shipped (v0.4.0) |
| FR-19 | A daily activities & schedule app for the kids (learning)                              | EPIC-5 | 📋 backlog |

## Non-Functional Requirements

| ID    | Requirement                                                                   | Status |
| ----- | ----------------------------------------------------------------------------- | ------ |
| NFR-1 | Bilingual without i18n routing (compatible with static export)                | ✅ done |
| NFR-4 | Build has no network — fonts self-hosted, no `next/font/google`                | ✅ done |
| NFR-2 | No sensitive data in the public repo; DB-backed apps ship a static shell only | ✅ done |
| NFR-3 | Charts are dependency-free (inline SVG)                                       | ✅ done |

## Epics & User Stories

### EPIC-1 — Platform Foundation

- US-1.1 — Scaffold the pnpm + Turborepo monorepo
- US-1.2 — Shared `@kidcenter/ui` package + Tailwind v4 tokens
- US-1.3 — Editorial Warm design system (DESIGN.md)
- US-1.4 — Static export + GitHub Pages deploy pipeline

### EPIC-2 — Portfolio site

- US-2.1 — Bilingual content engine (schemas, loaders, toggle)
- US-2.2 — Portfolio page: academic record, awards, skills radar
- US-2.3 — Storytelling home with photo essays
- US-2.4 — PDF export + meta / OG / favicons
- US-2.5 — Independent AI Assessment page
- US-2.6 — 3-page IA (Intro / Profile / Assessment), research framing
- US-2.7 — Projects showcase (/projects + detail; first project: LEGO spinning tops)
- US-2.8 — Project dates + timeline (evidence-based)

### EPIC-3 — Family Quest

- US-3.1 — Task/points domain logic (TDD)
- US-3.2 — Supabase schema + RLS + Google auth + provisioning
- US-3.3 — Email allowlist management
- US-3.4 — Parent admin (CMS, approvals, points, rewards)
- US-3.5 — Child / kid mode (Today, store, leaderboard, schedule)
- US-3.6 — Deploy at `/quest` + Editorial Warm
- US-3.7 — Critical-path E2E (approval + redemption) + mobile design-review *(backlog)*

### EPIC-4 — Study Dashboard

- US-4.1 — Internal G1–4 dashboard, DB-backed + parent-only auth
- US-4.2 — Chart refinements (continuous trends, all-subject true-scale radar, precise + unit scores)
- US-4.3 — Private data handling (gitignore, seed script, PDF backup)

### EPIC-5 — Learning *(backlog)*

- US-5.1 — Learning app — scope & first build (daily activities + schedule)
