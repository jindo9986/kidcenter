# KidCenter — Product Brief

> Backfilled 2026-06-23 from git history (105 commits, 2026-06-03 → 2026-06-23).
> English is canonical (RULE-13).

## Executive summary

KidCenter is a personal **monorepo of small, independent web apps built for the
family's children**. Each app solves one concrete need for a kid and ships on its
own cadence, sharing only a design system and (where useful) a backend. Three apps
are live: a **capability portfolio** for program/school applications, a **chores &
points app** ("Family Quest"), and an **internal academic-progress dashboard**
("Study"). A fourth (`learning`) is scaffolded for future activity/scheduling work.

## Problem

Off-the-shelf tools don't fit a parent who wants to (a) present a child's real
achievements credibly to schools/programs, (b) motivate daily habits with a
transparent points economy the child understands, and (c) turn four years of
scattered report cards into one honest picture to plan learning **with** the child.
Generic SaaS is over-featured, not bilingual (VI/EN), and gives no control over how
sensitive school data is stored.

## Solution

A pnpm/Turborepo monorepo where each app is a focused Next.js static-export site:

- **Portfolio** — a bilingual, content-driven site presenting one child's academic
  record, awards, and an evidence-backed assessment; exportable to PDF; deployed at a
  custom domain.
- **Family Quest** — a Supabase-backed task/points/rewards app with Google login, an
  email allowlist, parent admin, and a kid mode.
- **Study** — an internal, auth-gated dashboard that aggregates Grade 1→4 report
  cards into trends, a capability map, teacher-feedback synthesis, and an improvement
  roadmap. Parent-only; sensitive data lives in the DB behind RLS, never in the repo.

## Differentiator

- **Bilingual by construction** (VI/EN) without i18n routing — dual render + a CSS
  locale toggle.
- **One shared design language** (Editorial Warm) so every app feels considered.
- **Privacy-first with a public repo** — sensitive school data is git-ignored and
  served from Supabase behind auth; the code is open, the data is not.

## Personas

- **Parent (primary)** — sets up and runs every app; the only role for Study.
- **Child** — audience for Portfolio; a first-class user of Family Quest (kid mode);
  a co-participant in Study's roadmap.
- **External reviewer** (school / program admissions) — reads the public Portfolio.

## Success criteria

- Portfolio is live at a custom domain and renders credibly in VI and EN.
- Family Quest runs a full loop: assign task → child submits → parent approves →
  points → reward redemption, gated by an allowlist.
- Study aggregates 4 years of data behind parent-only auth with zero sensitive data
  committed to the public repo.

## Scope

**In:** the three shipped apps + shared UI + design system + GitHub Pages deploy.
**Out (for now):** the `learning` app beyond scaffold; multi-family tenancy; any
public exposure of Study data; a data-entry CMS for Study (edit JSON + re-seed).

## Vision

A small, durable set of family tools that grow with the kids — each independently
shippable, consistent in look, honest with data, and cheap to run.
