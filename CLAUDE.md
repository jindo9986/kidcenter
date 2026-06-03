# CLAUDE.md — KidCenter

Monorepo of independent web apps for the kids. Read this before working.

## Communication

- **Chat tiếng Việt** with the user.
- **Documents/artifacts tiếng Anh** (PRD, architecture, stories, code comments).

## Structure

- `apps/learning` — Next.js app, port 3000. Learning activities & daily schedule.
- `apps/portfolio` — Next.js app, port 3001. Kid portfolio for program applications.
- `packages/ui` — `@kidcenter/ui` shared components (Button, Card) + Tailwind v4
  design tokens in `src/styles.css`. Consumed via `transpilePackages`.
- Apps are **independent** — keep cross-app coupling in `packages/*` only.

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

## Workflow suggestion

New feature → `superpowers:brainstorm` or `bmad-create-prd` to scope →
`bmad-create-architecture` → implement with TDD → `qa` / `webapp-testing` →
`design-review` → `ship`.
