# docs/ — KidCenter documentation hub

Canonical documentation for the KidCenter monorepo, maintained to the **koni-docs**
standard. Backfilled 2026-06-23 from git history.

## Map

| Doc | What it holds |
|---|---|
| [BRIEF.md](BRIEF.md) | Product brief — problem, solution, personas, scope |
| [PRD.md](PRD.md) | Functional requirements + Epics & User Stories index |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Stack, components, data, security, deploy, ADs |
| [CHANGELOG.md](CHANGELOG.md) | Release history (backfilled) |
| [CONTEXT.md](CONTEXT.md) | Decision log (append-only) |
| [LESSONS.md](LESSONS.md) | Recurring traps + patterns |
| [SETUP.md](SETUP.md) | Dev environment |
| [../DEPLOY.md](../DEPLOY.md) | Production runbook |
| [sprints/](sprints/) | Epics, stories, sprints, STATUS kanban |

Root-level: [`../CLAUDE.md`](../CLAUDE.md) (agent context + Active Context),
[`../apps/portfolio/DESIGN.md`](../apps/portfolio/DESIGN.md) (design system),
[`../VERSION`](../VERSION).

## Pre-commit checklist (koni-docs §3c)

```
[ ] VERSION bumped per semver rule
[ ] CHANGELOG.md entry added, commit SHA filled (RULE-1, RULE-2)
[ ] PRD.md story status updated if scope changed
[ ] BRIEF.md updated if product vision/scope changed
[ ] CONTEXT.md new entry if a decision was made (RULE-7 append-only)
[ ] SETUP + DEPLOY + .env.example updated if a new env var (RULE-11)
[ ] LESSONS.md entry if a trap/pattern was found
[ ] Story file: status → done, version_shipped set, Tasks all [x]
[ ] CLAUDE.md Active Context block updated
```

> **Note on this backfill.** The commit history predates koni-docs adoption, so the
> `docs/` set was reconstructed retroactively on 2026-06-23. Stories group related
> commits rather than mapping 1:1; `commit` fields cite the representative landing
> SHA(s); versions were assigned as milestone releases (see CHANGELOG). Going forward,
> the checklist above applies per commit.
