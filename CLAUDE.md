# CLAUDE.md — KidCenter

Monorepo of independent web apps for the kids. Read this before working.

## Communication

- **Chat tiếng Việt** with the user.
- **Documents/artifacts tiếng Anh** (PRD, architecture, stories, code comments).

## Structure

- `apps/learning` — Next.js app, port 3000. Learning activities & daily schedule (scaffold).
- `apps/portfolio` — Next.js app, port 3001. Kid portfolio; deployed at the domain root.
- `apps/family` — Next.js app, port 3002. Family Quest (tasks/points/rewards); Supabase; `/quest`.
- `apps/study` — Next.js app, port 3003. Internal G1–4 academic dashboard; Supabase; parent-only; `/study`.
- `packages/ui` — `@kidcenter/ui` shared components (Button, Card) + Tailwind v4
  design tokens in `src/styles.css`. Consumed via `transpilePackages`.
- Apps are **independent** — keep cross-app coupling in `packages/*` only.
- `family` + `study` share one Supabase project; sensitive data is git-ignored and
  loaded at runtime behind auth (repo is public). See `docs/ARCHITECTURE.md`.

## Stack conventions

- Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4.
- Tailwind v4: no `tailwind.config.js`; tokens live in `@theme` blocks. The shared
  tokens come from `@kidcenter/ui/styles`, imported in each app's `globals.css`,
  with `@source "../../../../packages/ui/src"` so utilities resolve.
- Package manager: **pnpm** (workspaces). Build orchestration: **Turborepo**.
- Run a single app: `pnpm dev:learning` / `pnpm dev:portfolio`.

## Toolkits available

1. **bmad-method** — `_bmad/`, skills prefixed `bmad-*`. Use for planning &
   structured delivery: `bmad-create-prd`, `bmad-create-architecture`,
   `bmad-create-epics-and-stories`, `bmad-dev-story`, `bmad-code-review`.
   Artifacts go to `_bmad-output/`. Start with the `bmad-help` skill.
2. **gstack** — browser QA & shipping: `browse`, `qa`, `design-review`, `ship`.
3. **anthropics/skills** — `frontend-design` (UI), `webapp-testing` (Playwright),
   `document-skills` (pdf/docx/pptx/xlsx — useful for exporting portfolio PDFs),
   `claude-api`.

## Design System
The portfolio app has a design source of truth at `apps/portfolio/DESIGN.md`
(direction: Editorial Warm — Fraunces + Be Vietnam Pro, indigo + medal-gold).
Always read it before making visual/UI changes to the portfolio. Do not deviate
without explicit user approval. In QA/review, flag UI that doesn't match it.

## Koni-Docs Integration

Canonical docs live in `docs/` and follow the **koni-docs** standard (BRIEF, PRD,
ARCHITECTURE, CHANGELOG, CONTEXT, LESSONS, sprints/). Read `docs/README.md` for the map
and the pre-commit checklist. Every code-shipping commit updates docs in the same commit.

```
koni-docs:
  plugins: []
  docs_path: docs/
  active_sprint: sprint-2026-W28
  version_file: VERSION
```

CLI: `npx @koniverse/koni-docs status` (regen STATUS.md), `sync` (propagate story
status), `validate` (ID-graph integrity).

## Active Context <!-- koni-docs:auto-update -->
- Sprint: sprint-2026-W28 (closed)
- Active Stories: — (all shipped)
- Last Version: v0.11.0
- Recent Decisions: D11 (private data never in the public repo)
- Recent Lessons: §11 (the artifact's CNAME is the Pages domain setting)
<!-- /koni-docs:auto-update -->

## Workflow suggestion

New feature → `superpowers:brainstorm` or `bmad-create-prd` to scope →
`bmad-create-architecture` → implement with TDD → `qa` / `webapp-testing` →
`design-review` → `ship`.
