# Family Quest — Design Spec (Phase 1)

**Date:** 2026-06-04
**Status:** Approved (pending written-spec review)
**App:** `apps/family` (`@kidcenter/family`) — working name "Family Quest"

An internal, family-only web app to help Đào Đình Hữu (Tin) and his siblings
manage tasks and time, gamified with a points system. This spec covers **Phase 1**
only: dynamic task/time management + scoring + rewards. Phase 2 (study-data
analysis & adaptive strategies) is deferred and will reuse this foundation.

---

## 1. Goals & non-goals

**Goals**
- A configurable (CMS-style) system where parents define activity types and
  activities; children complete them and earn/lose points.
- Time management: a recurring daily routine plus assigned one-off/recurring tasks.
- A points ledger (auditable), a reward store, and a leaderboard with badges.
- Family-only access via Google (Gmail) login; safe for a public URL because all
  data is protected by auth + row-level security.
- Designed for **multiple children**, even though the family starts with one main
  player (Tin).

**Non-goals (Phase 1)**
- Study-data analysis / adaptive strategy engine (Phase 2).
- Real-money conversion of points.
- Native mobile app, push notifications, complex badge engine.

---

## 2. Architecture

- **Frontend:** New Next.js (App Router) app `apps/family` in the existing
  monorepo, reusing `@kidcenter/ui` and the shared design tokens. **Static export**
  (`output: "export"`).
- **Backend:** **Supabase** — Postgres database, Auth (Google OAuth), Realtime
  (live sync of points/tasks across the parents' and child's devices). All data
  access is client-side via `@supabase/supabase-js`, protected by **Row-Level
  Security (RLS)**. The Supabase **anon key is public-safe**; the service-role key
  is never shipped to the client.
- **Deployment:** Built as a **subpath of the existing GitHub Pages deploy** →
  served at **`https://www.huudaodinh.site/quest`**, login-gated. Concretely, the
  family app builds with `basePath`/`assetPrefix` = `/quest` and its static `out/`
  is placed at `apps/portfolio/out/quest/` before the Pages artifact is uploaded
  (the deploy workflow is extended to build both apps and assemble one artifact).
  Rationale: avoid managing a second repo for now. It can be split into its own
  repo / URL later with no app-code changes (only build/deploy config).
- **Config:** `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  provided as build-time env (GitHub Actions secrets). A family-email allowlist is
  enforced in the database (see §4), not only in the client.

---

## 3. Roles & authentication

- **Parent** — signs in with Gmail. Only emails on the family allowlist can sign
  in / be provisioned as a parent. Full admin: CMS (activity types, activities,
  rewards), approve tasks, award/deduct points, manage members.
- **Child** — a profile created by a parent; does **not** require a Gmail account.
  On a shared device, a parent picks "kid mode" and selects the child (optionally
  protected by a per-child **PIN**). A child who has a Gmail can optionally be
  **linked** to a Google account to self-sign-in on their own device.
- **Visibility (RLS):** a parent can read/write everything in their family; a child
  can read their own tasks/points and the family leaderboard, and can submit task
  completions and reward-redemption requests — but cannot write point transactions
  or approve anything. Only parents write to the points ledger and approve.

---

## 4. Data model (Postgres)

All tables carry `family_id` and are scoped by RLS to the signed-in user's family.

- **families**(id, name, created_at)
- **members**(id, family_id, role `parent|child`, display_name, avatar_url,
  auth_user_id `nullable` (set when a Google account is linked), pin_hash
  `nullable`, birth_year `nullable`, active, created_at)
- **allowlist_emails**(id, family_id, email, role) — emails permitted to sign in;
  on first sign-in a matching `members` row is created/linked.
- **activity_types**(id, family_id, name, icon, color, sort) — CMS, parent-defined
  (e.g. Daily routine, Housework, Study, Behaviour, or custom).
- **activities**(id, family_id, type_id, title, description, points `int` (may be
  negative), recurrence `once|daily|weekly|custom`, schedule `jsonb` (days of week
  / time-of-day window for routines), assignee_member_id `nullable` (null = all
  children), requires_approval `bool`, active, created_at)
- **task_instances**(id, activity_id, member_id, due_date, status
  `pending|submitted|approved|rejected|missed`, submitted_at, decided_by,
  decided_at, points_awarded `int nullable`) — generated per schedule.
- **point_transactions**(id, family_id, member_id, delta `int`, reason, source
  `task|penalty|reward|manual|bonus`, ref_id `nullable`, created_by, created_at) —
  **the source of truth for balances**. A member's balance = `SUM(delta)`.
- **rewards**(id, family_id, title, description, cost_points `int`, icon,
  stock `nullable`, active, created_at) — the reward store.
- **reward_redemptions**(id, reward_id, member_id, cost_points, status
  `requested|approved|fulfilled|rejected`, created_at, decided_by, decided_at)
- **badges** / milestones — deferred (Phase 1 derives simple weekly/monthly
  standings from the ledger; rich badges come later).

Derived: a `member_balances` SQL view (member_id → SUM of deltas), and
week/month rollups for the leaderboard.

**Key invariants**
- Balance is always recomputed from `point_transactions`; nothing stores a mutable
  balance field.
- A reward redemption that is approved writes a single negative `point_transaction`
  (source `reward`) and must not drive the balance below zero (checked server-side
  via RLS policy / Postgres function).
- Approving a task writes exactly one `point_transaction` (source `task`,
  `delta = activity.points`).

---

## 5. Core flows

1. **Parent setup (CMS):** create activity types → create activities (points,
   recurrence, schedule, assignee, requires_approval) → create rewards.
2. **Daily generation:** task instances are generated from active activities'
   schedules (client-side on load + idempotent upsert keyed by
   activity+member+due_date; a Supabase scheduled function can be added later).
3. **Child — Today:** sees today's routine + assigned tasks → marks one done
   (`submitted`). Auto-approve activities skip the approval step.
4. **Parent — Approve:** approves (`approved` → +points ledger entry) or rejects/
   marks missed. Parents can also add **manual** +/- transactions for good
   behaviour or rule violations.
5. **Child — Reward store:** picks an affordable reward → creates a redemption
   (`requested`) → parent approves → one negative ledger entry + `fulfilled`.
6. **Leaderboard & badges:** weekly/monthly standings derived from the ledger.

---

## 6. Screens

- **Auth:** Google sign-in; "kid mode" selector (pick child + optional PIN).
- **Parent**
  - Dashboard — each child's balance, items awaiting approval.
  - Activities (CMS) — manage types & activities.
  - Approvals — pending task submissions & redemption requests.
  - Points & history — ledger per child, add manual +/-.
  - Rewards (CMS) — manage the store, approve redemptions.
  - Members — add/edit children, PIN, link Google.
- **Child**
  - Today — routine + assigned tasks, mark done.
  - My points — balance & history.
  - Reward store — redeem.
  - Leaderboard — family standings.

---

## 7. Testing

- **Unit:** balance from ledger; affordability check on redemption; task-instance
  generation per recurrence rule; allowlist enforcement.
- **RLS / policy:** parent vs child read/write permissions (a child cannot insert
  point transactions, cannot read another family, etc.).
- **E2E (webapp-testing):** the approval flow and the redemption flow end-to-end.

---

## 8. Prerequisites (owner to provide; guided step-by-step)

- Create a **Supabase** project (free tier).
- Enable the **Google** auth provider (create an OAuth client in Google Cloud,
  add the `/quest` redirect URL).
- Provide `NEXT_PUBLIC_SUPABASE_URL` + **anon key** (public-safe). The service-role
  key is kept secret and never shipped to the client.
- Provide the **parent Gmail address(es)** for the allowlist.

---

## 9. Out of scope / later

- Phase 2: study-data analysis & adaptive strategies (separate spec, same backend).
- Rich badge engine, push notifications, native app.
- Splitting the app into its own repo / dedicated URL (config-only change later).
