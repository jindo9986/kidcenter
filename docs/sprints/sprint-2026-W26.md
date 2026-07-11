---
id: sprint-2026-W26
status: closed
start: 2026-06-22T00:00:00.000Z
end: 2026-06-28T00:00:00.000Z
goal: >-
  Ship the internal, parent-only Study dashboard on Supabase without leaking
  school data
---
## Sprint scope

| US     | Title                                   | Epic   | Pri | Points | Status | Story file                                      |
| ------ | --------------------------------------- | ------ | --- | ------ | ------ | ----------------------------------------------- |
| US-4.1 | Study dashboard (DB + parent-only auth) | EPIC-4 | P0  | 8      | ✅ done | [link](stories/US-4.1-study-dashboard.md)       |
| US-4.2 | Chart refinements                       | EPIC-4 | P1  | 5      | ✅ done | [link](stories/US-4.2-chart-refinements.md)     |
| US-4.3 | Private data handling                   | EPIC-4 | P0  | 2      | ✅ done | [link](stories/US-4.3-private-data-handling.md) |

## Sprint goal recap

Landed 2026-06-23 as v0.4.0. Built `apps/study`, moved it from local-JSON to the shared
Supabase project behind parent-only RLS + Google auth so it could deploy at `/study`,
refined the charts for honesty/precision, and locked down the sensitive data
([D9](../CONTEXT.md), [D10](../CONTEXT.md), [D11](../CONTEXT.md)).

## Retrospective

- **Went well**: reusing family's auth/allowlist made the DB+auth pivot cheap; catching the
  public-repo privacy risk before pushing.
- **Watch**: chart-domain distortion (8.5≈5) shipped once before being fixed — default to
  true-scale axes ([§3](../LESSONS.md)).
