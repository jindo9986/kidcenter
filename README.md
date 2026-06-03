# KidCenter 🧒

Monorepo of independent web apps for my kids. Each app lives in `apps/*` and can
be developed and deployed on its own; shared UI lives in `packages/ui`.

## Apps

| App | Path | Port | Mục đích |
| --- | --- | --- | --- |
| **learning** | `apps/learning` | 3000 | Quản lý hoạt động học tập & lịch sinh hoạt hằng ngày cho bé |
| **portfolio** | `apps/portfolio` | 3001 | Hồ sơ năng lực của bé để apply các chương trình học |

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Turborepo** + **pnpm workspaces**
- Shared design tokens & components in `@kidcenter/ui`

## Getting started

```bash
pnpm install          # cài deps cho toàn bộ workspace
pnpm dev              # chạy tất cả app song song (turbo)
pnpm dev:learning     # chỉ chạy app learning  (http://localhost:3000)
pnpm dev:portfolio    # chỉ chạy app portfolio (http://localhost:3001)
pnpm build            # build tất cả app
pnpm lint             # lint tất cả workspace
```

## Repo layout

```
kidcenter/
├─ apps/
│  ├─ learning/        # Next.js app — học tập & sinh hoạt
│  └─ portfolio/       # Next.js app — portfolio bé
├─ packages/
│  └─ ui/              # @kidcenter/ui — Button, Card, design tokens
├─ _bmad/              # BMAD Method agents (planning → dev → QA)
├─ _bmad-output/       # Planning & implementation artifacts (PRD, stories…)
├─ docs/               # Long-term project knowledge
├─ turbo.json
└─ pnpm-workspace.yaml
```

## Development toolkit (Claude Code skills)

This repo is wired up with three skill sets:

- **bmad-method** (`_bmad/`, `bmad-*` skills) — Agile AI workflow: analyst → PM →
  architect → dev → QA. Run the `bmad-help` skill to get oriented.
- **gstack** — headless-browser QA, design review, ship/deploy skills (`browse`,
  `qa`, `design-review`, `ship`).
- **anthropics/skills** — `frontend-design`, `webapp-testing`, `document-skills`
  (pdf/docx/pptx/xlsx), `claude-api`.

See [CLAUDE.md](CLAUDE.md) for how they fit together.
