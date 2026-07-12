---
id: sprint-2026-W28
status: closed
start: 2026-07-06
end: 2026-07-12
goal: "Add a Projects area to the portfolio and present the first project (LEGO spinning tops)"
---

## Sprint scope

| US | Title | Epic | Pri | Points | Status | Story file |
|---|---|---|---|---|---|---|
| US-2.7 | Projects showcase — /projects + first project | EPIC-2 | P1 | 5 | ✅ done | [link](stories/US-2.7-projects-showcase.md) |
| US-2.8 | Project dates + timeline | EPIC-2 | P2 | 2 | ✅ done | [link](stories/US-2.8-project-dates-timeline.md) |
| US-2.9 | Materials → finished visual | EPIC-2 | P2 | 2 | ✅ done | [link](stories/US-2.9-materials-to-finished.md) |

## Sprint goal recap

Landed 2026-07-11 as v0.5.0. Built a dedicated `/projects` list + `/projects/[slug]`
detail on the portfolio (added to the top nav), and presented the child's self-authored
LEGO "Tyre Flywheel Spinner" science project — his own words + 6 prototype photos + the
spinning-time data table — bilingual, in the Editorial Warm style.

## Retrospective

- **Went well**: the empty-but-scaffolded project system (getProjects + markdown) meant the
  build was mostly content + two routes; faithful presentation of the child's own writing.
- **Watch**: `prose` classes silently do nothing without `@tailwindcss/typography` —
  needed a scoped CSS block. Consider installing the plugin if more markdown pages appear.
