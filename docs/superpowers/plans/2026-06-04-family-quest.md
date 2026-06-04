# Family Quest — Implementation Plan (Phase 1)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an internal, family-only web app (`apps/family`, served at `www.huudaodinh.site/quest`) where parents configure activities/tasks and children earn/spend points, backed by Supabase (Postgres + Google auth + RLS).

**Architecture:** Next.js App Router **static export** in the existing pnpm/Turbo monorepo, reusing `@kidcenter/ui`. All persistence is Supabase, accessed client-side via `@supabase/supabase-js` and protected by Row-Level Security. Pure domain logic (points ledger math, recurrence, affordability, allowlist, PIN) lives in a dependency-free `src/domain/` layer that is unit-tested with vitest **without** needing live Supabase. Supabase wiring, auth, UI, and deploy build on top.

**Tech Stack:** Next.js 16, React 19, TypeScript (strict), Tailwind v4 (`@kidcenter/ui`), `@supabase/supabase-js` v2, vitest, Web Crypto (PIN hashing), GitHub Actions (existing Pages deploy extended).

**Execution note (credentials):** Milestones 0–2 and most of 3's logic need **no** Supabase project. Live auth (M4), RLS verification (M3), and deploy (M8) require the owner's Supabase project (`NEXT_PUBLIC_SUPABASE_URL`, anon key) and a Google OAuth client. Build those tasks last; they are clearly marked **[needs creds]**.

---

## File structure (created in this plan)

```
apps/family/
  package.json
  next.config.ts                # output: export, basePath/assetPrefix /quest (prod)
  tsconfig.json
  vitest.config.ts
  postcss.config.mjs
  .env.local.example            # NEXT_PUBLIC_SUPABASE_URL / ANON_KEY
  src/
    app/
      layout.tsx                # html shell + AuthProvider
      globals.css               # imports @kidcenter/ui styles
      page.tsx                  # entry: routes to login / parent / kid
      providers.tsx             # AuthProvider (client)
    domain/                     # PURE, no Supabase, fully unit-tested
      points.ts                 # computeBalance, canAfford
      recurrence.ts             # dueOn, generateInstances
      allowlist.ts              # normalizeEmail, isAllowed
      pin.ts                    # hashPin, verifyPin (Web Crypto)
      types.ts                  # domain enums/types (Role, Recurrence, Status…)
    lib/
      supabase.ts               # browser client (singleton)
      session.ts                # current member/role helpers
    data/                       # thin typed wrappers over supabase queries
      members.ts  activities.ts  tasks.ts  points.ts  rewards.ts
    components/                 # UI building blocks (reuse @kidcenter/ui)
      ...
    features/
      auth/ parent/ child/      # screen groups
  supabase/
    migrations/
      0001_schema.sql
      0002_rls.sql
      0003_provision_trigger.sql
    seed.sql                    # optional demo family
    README.md                   # setup steps (Supabase + Google OAuth)
```

Monorepo touch points: `pnpm-workspace.yaml` already globs `apps/*`; add a root script `dev:family`; extend `.github/workflows/deploy.yml` to build family into `apps/portfolio/out/quest`.

---

## Milestone 0 — Scaffold the app

### Task 0.1: Create the `apps/family` package

**Files:**
- Create: `apps/family/package.json`
- Create: `apps/family/tsconfig.json`
- Create: `apps/family/next.config.ts`
- Create: `apps/family/postcss.config.mjs`
- Create: `apps/family/vitest.config.ts`
- Modify: root `package.json` (add `dev:family` script)

- [ ] **Step 1: Write `apps/family/package.json`**

```json
{
  "name": "@kidcenter/family",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3002",
    "build": "next build",
    "start": "next start --port 3002",
    "lint": "eslint",
    "test": "vitest run"
  },
  "dependencies": {
    "@kidcenter/ui": "workspace:*",
    "@supabase/supabase-js": "^2.45.0",
    "next": "16.2.7",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.7",
    "tailwindcss": "^4",
    "typescript": "^5",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 2: Write `apps/family/next.config.ts`** (mirror portfolio's static-export config; subpath `/quest` in prod via env)

```ts
import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  transpilePackages: ["@kidcenter/ui"],
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
```

- [ ] **Step 3: Write `apps/family/tsconfig.json`** (copy `apps/portfolio/tsconfig.json` verbatim — same compilerOptions, `@/*` → `./src/*`).

- [ ] **Step 4: Write `apps/family/postcss.config.mjs`**

```js
export default { plugins: { "@tailwindcss/postcss": {} } };
```

- [ ] **Step 5: Write `apps/family/vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: { environment: "node", include: ["src/**/*.test.ts"] },
});
```

- [ ] **Step 6: Add root script.** In root `package.json` `scripts`, add: `"dev:family": "turbo run dev --filter=@kidcenter/family"`.

- [ ] **Step 7: Install & verify** — Run: `pnpm install`. Expected: resolves, `@kidcenter/family` linked.

- [ ] **Step 8: Commit** — `git add apps/family package.json pnpm-lock.yaml && git commit -m "chore(family): scaffold apps/family package"`

### Task 0.2: Minimal app shell that builds

**Files:**
- Create: `apps/family/src/app/globals.css`
- Create: `apps/family/src/app/layout.tsx`
- Create: `apps/family/src/app/page.tsx`

- [ ] **Step 1: `globals.css`** (mirror portfolio: import shared tokens + Tailwind source)

```css
@import "tailwindcss";
@import "@kidcenter/ui/styles";
@source "../../../../packages/ui/src";
```

- [ ] **Step 2: `layout.tsx`**

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Family Quest", robots: { index: false } };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full bg-cream text-ink">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: `page.tsx`** (placeholder home)

```tsx
export default function Home() {
  return <main className="mx-auto max-w-md p-8 text-center">Family Quest</main>;
}
```

- [ ] **Step 4: Build** — Run: `pnpm --filter @kidcenter/family build`. Expected: static export succeeds, `apps/family/out/` produced.

- [ ] **Step 5: Commit** — `git commit -am "feat(family): minimal building app shell"`

---

## Milestone 1 — Pure domain logic (TDD, no Supabase)

### Task 1.1: Domain types

**Files:**
- Create: `apps/family/src/domain/types.ts`

- [ ] **Step 1: Write types** (no test; consumed by later tests)

```ts
export type Role = "parent" | "child";
export type Recurrence = "once" | "daily" | "weekly" | "custom";
export type TaskStatus = "pending" | "submitted" | "approved" | "rejected" | "missed";
export type TxnSource = "task" | "penalty" | "reward" | "manual" | "bonus";

export interface PointTxn { delta: number; }
export interface ActivitySchedule { days?: number[]; } // 0=Sun..6=Sat for weekly/custom
export interface ActivityLite {
  id: string;
  points: number;
  recurrence: Recurrence;
  schedule: ActivitySchedule | null;
  assigneeMemberId: string | null;
  active: boolean;
  startDate?: string; // ISO yyyy-mm-dd, for "once"
}
```

- [ ] **Step 2: Commit** — `git commit -am "feat(family): domain types"`

### Task 1.2: Points ledger math

**Files:**
- Create: `apps/family/src/domain/points.test.ts`
- Create: `apps/family/src/domain/points.ts`

- [ ] **Step 1: Failing test**

```ts
import { describe, it, expect } from "vitest";
import { computeBalance, canAfford } from "./points";

describe("computeBalance", () => {
  it("sums deltas (incl. negatives) and treats empty as 0", () => {
    expect(computeBalance([])).toBe(0);
    expect(computeBalance([{ delta: 10 }, { delta: 5 }, { delta: -4 }])).toBe(11);
  });
});

describe("canAfford", () => {
  it("is true only when balance covers cost and never allows negative", () => {
    expect(canAfford(100, 100)).toBe(true);
    expect(canAfford(99, 100)).toBe(false);
    expect(canAfford(100, 0)).toBe(true);
  });
});
```

- [ ] **Step 2: Run, expect FAIL** — Run: `pnpm --filter @kidcenter/family test`. Expected: fails (module not found).

- [ ] **Step 3: Implement**

```ts
import type { PointTxn } from "./types";

export function computeBalance(txns: PointTxn[]): number {
  return txns.reduce((sum, t) => sum + t.delta, 0);
}

export function canAfford(balance: number, cost: number): boolean {
  return cost >= 0 && balance - cost >= 0;
}
```

- [ ] **Step 4: Run, expect PASS** — Run: `pnpm --filter @kidcenter/family test`. Expected: PASS.

- [ ] **Step 5: Commit** — `git commit -am "feat(family): points balance + affordability"`

### Task 1.3: Recurrence / task-instance generation

**Files:**
- Create: `apps/family/src/domain/recurrence.test.ts`
- Create: `apps/family/src/domain/recurrence.ts`

- [ ] **Step 1: Failing test**

```ts
import { describe, it, expect } from "vitest";
import { dueOn, generateInstances } from "./recurrence";
import type { ActivityLite } from "./types";

const base: ActivityLite = {
  id: "a1", points: 5, recurrence: "daily", schedule: null,
  assigneeMemberId: null, active: true,
};

describe("dueOn", () => {
  it("daily is always due", () => {
    expect(dueOn(base, "2026-06-04")).toBe(true);
  });
  it("weekly is due only on scheduled weekday (2026-06-04 is Thursday=4)", () => {
    const w = { ...base, recurrence: "weekly" as const, schedule: { days: [4] } };
    expect(dueOn(w, "2026-06-04")).toBe(true);
    expect(dueOn(w, "2026-06-05")).toBe(false);
  });
  it("once is due only on its startDate", () => {
    const o = { ...base, recurrence: "once" as const, startDate: "2026-06-04" };
    expect(dueOn(o, "2026-06-04")).toBe(true);
    expect(dueOn(o, "2026-06-05")).toBe(false);
  });
  it("inactive is never due", () => {
    expect(dueOn({ ...base, active: false }, "2026-06-04")).toBe(false);
  });
});

describe("generateInstances", () => {
  it("creates one instance per child for an unassigned daily activity", () => {
    const out = generateInstances([base], ["c1", "c2"], "2026-06-04");
    expect(out).toEqual([
      { activityId: "a1", memberId: "c1", dueDate: "2026-06-04" },
      { activityId: "a1", memberId: "c2", dueDate: "2026-06-04" },
    ]);
  });
  it("creates one instance for an assigned activity only", () => {
    const a = { ...base, assigneeMemberId: "c2" };
    const out = generateInstances([a], ["c1", "c2"], "2026-06-04");
    expect(out).toEqual([{ activityId: "a1", memberId: "c2", dueDate: "2026-06-04" }]);
  });
});
```

- [ ] **Step 2: Run, expect FAIL.**

- [ ] **Step 3: Implement**

```ts
import type { ActivityLite } from "./types";

export interface PlannedInstance {
  activityId: string;
  memberId: string;
  dueDate: string; // ISO yyyy-mm-dd
}

function weekday(iso: string): number {
  // Parse as UTC noon to avoid timezone drift.
  return new Date(`${iso}T12:00:00Z`).getUTCDay();
}

export function dueOn(a: ActivityLite, date: string): boolean {
  if (!a.active) return false;
  switch (a.recurrence) {
    case "daily":
      return true;
    case "once":
      return a.startDate === date;
    case "weekly":
    case "custom":
      return (a.schedule?.days ?? []).includes(weekday(date));
  }
}

export function generateInstances(
  activities: ActivityLite[],
  childMemberIds: string[],
  date: string,
): PlannedInstance[] {
  const out: PlannedInstance[] = [];
  for (const a of activities) {
    if (!dueOn(a, date)) continue;
    const targets = a.assigneeMemberId ? [a.assigneeMemberId] : childMemberIds;
    for (const memberId of targets) {
      out.push({ activityId: a.id, memberId, dueDate: date });
    }
  }
  return out;
}
```

- [ ] **Step 4: Run, expect PASS.**
- [ ] **Step 5: Commit** — `git commit -am "feat(family): recurrence + task-instance generation"`

### Task 1.4: Allowlist

**Files:**
- Create: `apps/family/src/domain/allowlist.test.ts`
- Create: `apps/family/src/domain/allowlist.ts`

- [ ] **Step 1: Failing test**

```ts
import { describe, it, expect } from "vitest";
import { normalizeEmail, isAllowed } from "./allowlist";

describe("allowlist", () => {
  it("normalizes case and whitespace", () => {
    expect(normalizeEmail("  Mom@Gmail.com ")).toBe("mom@gmail.com");
  });
  it("matches against a normalized allowlist", () => {
    const list = ["mom@gmail.com", "dad@gmail.com"];
    expect(isAllowed("MOM@gmail.com", list)).toBe(true);
    expect(isAllowed("stranger@gmail.com", list)).toBe(false);
  });
});
```

- [ ] **Step 2: Run, expect FAIL.**
- [ ] **Step 3: Implement**

```ts
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isAllowed(email: string, allowlist: string[]): boolean {
  const e = normalizeEmail(email);
  return allowlist.map(normalizeEmail).includes(e);
}
```

- [ ] **Step 4: Run, expect PASS.**
- [ ] **Step 5: Commit** — `git commit -am "feat(family): email allowlist helper"`

### Task 1.5: PIN hashing (Web Crypto)

**Files:**
- Create: `apps/family/src/domain/pin.test.ts`
- Create: `apps/family/src/domain/pin.ts`

- [ ] **Step 1: Failing test** (Web Crypto is available in Node 20 vitest env via `globalThis.crypto`)

```ts
import { describe, it, expect } from "vitest";
import { hashPin, verifyPin } from "./pin";

describe("pin", () => {
  it("verifies a correct pin and rejects a wrong one", async () => {
    const h = await hashPin("1234", "salt-c1");
    expect(await verifyPin("1234", "salt-c1", h)).toBe(true);
    expect(await verifyPin("0000", "salt-c1", h)).toBe(false);
  });
});
```

- [ ] **Step 2: Run, expect FAIL.**
- [ ] **Step 3: Implement** (note: lightweight obfuscation, not strong security — per spec)

```ts
async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function hashPin(pin: string, salt: string): Promise<string> {
  return sha256Hex(`${salt}:${pin}`);
}

export async function verifyPin(pin: string, salt: string, hash: string): Promise<boolean> {
  return (await hashPin(pin, salt)) === hash;
}
```

- [ ] **Step 4: Run, expect PASS.**
- [ ] **Step 5: Commit** — `git commit -am "feat(family): PIN hashing for kid mode"`

---

## Milestone 2 — Supabase schema, RLS, provisioning (SQL)

These are SQL migration files. They are reviewed/applied in the Supabase SQL editor during setup (M4). Writing them here locks the data contract the data layer depends on.

### Task 2.1: Schema migration

**Files:**
- Create: `apps/family/supabase/migrations/0001_schema.sql`

- [ ] **Step 1: Write schema** (tables from spec §4; balances are derived, never stored)

```sql
create extension if not exists "pgcrypto";

create table families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table members (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  role text not null check (role in ('parent','child')),
  display_name text not null,
  avatar_url text,
  auth_user_id uuid unique references auth.users(id) on delete set null,
  pin_hash text,
  pin_salt text,
  birth_year int,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create index on members(family_id);

create table allowlist_emails (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  email text not null,
  role text not null default 'parent' check (role in ('parent','child')),
  unique (email)
);

create table activity_types (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  name text not null,
  icon text,
  color text,
  sort int not null default 0
);

create table activities (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  type_id uuid references activity_types(id) on delete set null,
  title text not null,
  description text,
  points int not null default 0,
  recurrence text not null default 'daily' check (recurrence in ('once','daily','weekly','custom')),
  schedule jsonb,
  start_date date,
  assignee_member_id uuid references members(id) on delete cascade,
  requires_approval boolean not null default true,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create index on activities(family_id);

create table task_instances (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references activities(id) on delete cascade,
  member_id uuid not null references members(id) on delete cascade,
  due_date date not null,
  status text not null default 'pending'
    check (status in ('pending','submitted','approved','rejected','missed')),
  submitted_at timestamptz,
  decided_by uuid references members(id),
  decided_at timestamptz,
  points_awarded int,
  unique (activity_id, member_id, due_date)
);
create index on task_instances(member_id, due_date);

create table point_transactions (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  member_id uuid not null references members(id) on delete cascade,
  delta int not null,
  reason text,
  source text not null check (source in ('task','penalty','reward','manual','bonus')),
  ref_id uuid,
  created_by uuid references members(id),
  created_at timestamptz not null default now()
);
create index on point_transactions(member_id);

create table rewards (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  title text not null,
  description text,
  cost_points int not null check (cost_points >= 0),
  icon text,
  stock int,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table reward_redemptions (
  id uuid primary key default gen_random_uuid(),
  reward_id uuid not null references rewards(id) on delete cascade,
  member_id uuid not null references members(id) on delete cascade,
  cost_points int not null,
  status text not null default 'requested'
    check (status in ('requested','approved','fulfilled','rejected')),
  created_at timestamptz not null default now(),
  decided_by uuid references members(id),
  decided_at timestamptz
);

create view member_balances as
  select member_id, coalesce(sum(delta), 0)::int as balance
  from point_transactions group by member_id;
```

- [ ] **Step 2: Commit** — `git add apps/family/supabase && git commit -m "feat(family): supabase schema migration"`

### Task 2.2: Helper functions + RLS

**Files:**
- Create: `apps/family/supabase/migrations/0002_rls.sql`

- [ ] **Step 1: Write helpers + policies** (a `current_member` security-definer helper drives every policy)

```sql
-- Returns the member row for the signed-in auth user (security definer to bypass RLS).
create or replace function current_member()
returns members language sql stable security definer set search_path = public as $$
  select * from members where auth_user_id = auth.uid() limit 1;
$$;

create or replace function my_family_id() returns uuid
language sql stable security definer set search_path = public as $$
  select family_id from members where auth_user_id = auth.uid() limit 1;
$$;

create or replace function is_parent() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from members
    where auth_user_id = auth.uid() and role = 'parent');
$$;

alter table families            enable row level security;
alter table members             enable row level security;
alter table allowlist_emails     enable row level security;
alter table activity_types       enable row level security;
alter table activities           enable row level security;
alter table task_instances       enable row level security;
alter table point_transactions   enable row level security;
alter table rewards              enable row level security;
alter table reward_redemptions   enable row level security;

-- Everyone in a family can read family-scoped rows.
create policy fam_read on families for select using (id = my_family_id());
create policy mem_read on members for select using (family_id = my_family_id());
create policy at_read  on activity_types for select using (family_id = my_family_id());
create policy act_read on activities for select using (family_id = my_family_id());
create policy ti_read  on task_instances for select
  using (member_id in (select id from members where family_id = my_family_id()));
create policy pt_read  on point_transactions for select using (family_id = my_family_id());
create policy rw_read  on rewards for select using (family_id = my_family_id());
create policy rr_read  on reward_redemptions for select
  using (member_id in (select id from members where family_id = my_family_id()));

-- Parents write all CMS/admin tables.
create policy mem_admin on members for all
  using (family_id = my_family_id() and is_parent())
  with check (family_id = my_family_id() and is_parent());
create policy at_admin on activity_types for all
  using (family_id = my_family_id() and is_parent())
  with check (family_id = my_family_id() and is_parent());
create policy act_admin on activities for all
  using (family_id = my_family_id() and is_parent())
  with check (family_id = my_family_id() and is_parent());
create policy rw_admin on rewards for all
  using (family_id = my_family_id() and is_parent())
  with check (family_id = my_family_id() and is_parent());

-- Only parents write the points ledger.
create policy pt_write on point_transactions for insert
  with check (family_id = my_family_id() and is_parent());

-- Task instances: parents do anything; a child may submit their own.
create policy ti_admin on task_instances for all
  using (is_parent() and member_id in (select id from members where family_id = my_family_id()))
  with check (is_parent() and member_id in (select id from members where family_id = my_family_id()));
create policy ti_child_submit on task_instances for update
  using (member_id = (select id from current_member()))
  with check (member_id = (select id from current_member()) and status = 'submitted');

-- Redemptions: a child requests their own; parents decide.
create policy rr_child_request on reward_redemptions for insert
  with check (member_id = (select id from current_member()) and status = 'requested');
create policy rr_admin on reward_redemptions for all
  using (is_parent() and member_id in (select id from members where family_id = my_family_id()))
  with check (is_parent() and member_id in (select id from members where family_id = my_family_id()));
```

- [ ] **Step 2: Commit** — `git commit -am "feat(family): RLS policies + helpers"`

### Task 2.3: Provision trigger (allowlist → member on first sign-in)

**Files:**
- Create: `apps/family/supabase/migrations/0003_provision_trigger.sql`
- Create: `apps/family/supabase/README.md`

- [ ] **Step 1: Write trigger** (on new auth user, if email is allowlisted, create/link a member)

```sql
create or replace function handle_new_auth_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  al allowlist_emails;
begin
  select * into al from allowlist_emails where email = lower(new.email) limit 1;
  if al.id is null then
    return new; -- not allowlisted: no member created; app blocks at sign-in
  end if;
  -- link to an existing unlinked member with this email-role, else create one
  update members set auth_user_id = new.id
    where family_id = al.family_id and role = al.role and auth_user_id is null
          and display_name = lower(new.email)
    returning id into al.id;
  if not found then
    insert into members(family_id, role, display_name, auth_user_id)
      values (al.family_id, al.role, coalesce(new.raw_user_meta_data->>'name', new.email), new.id);
  end if;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_auth_user();
```

- [ ] **Step 2: Write `supabase/README.md`** — concise setup runbook:
  1. Create Supabase project; copy Project URL + anon key.
  2. SQL editor → run `0001`, `0002`, `0003` in order.
  3. Insert the family + allowlist rows:
     ```sql
     insert into families(name) values ('Đào family');
     insert into allowlist_emails(family_id, email, role)
       select id, 'PARENT_EMAIL@gmail.com', 'parent' from families;
     ```
  4. Auth → Providers → enable Google; create a Google Cloud OAuth client
     (Authorized redirect URI: `https://<project>.supabase.co/auth/v1/callback`),
     paste client id/secret. Add Site URL `https://www.huudaodinh.site/quest` and
     redirect allow-list entry for the same.
  5. Put URL + anon key into GitHub Actions secrets
     `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

- [ ] **Step 3: Commit** — `git commit -am "feat(family): auth provisioning trigger + setup runbook"`

---

## Milestone 3 — Supabase client + typed data layer

### Task 3.1: Browser client + generated-ish types

**Files:**
- Create: `apps/family/src/lib/supabase.ts`
- Create: `apps/family/.env.local.example`
- Create: `apps/family/src/data/db-types.ts`

- [ ] **Step 1: `.env.local.example`**

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

- [ ] **Step 2: `src/lib/supabase.ts`** (singleton browser client; reads public env)

```ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, anon, {
  auth: { persistSession: true, detectSessionInUrl: true, flowType: "pkce" },
});
```

- [ ] **Step 3: `src/data/db-types.ts`** — hand-written row types mirroring the schema (Member, Activity, ActivityType, TaskInstance, PointTransaction, Reward, RewardRedemption, MemberBalance). Each `interface` uses snake_case columns exactly as in SQL. (Full content authored from Task 2.1 column list.)

- [ ] **Step 4: Commit** — `git commit -am "feat(family): supabase client + row types"`

### Task 3.2: Data-access wrappers

**Files:**
- Create: `apps/family/src/data/members.ts`
- Create: `apps/family/src/data/activities.ts`
- Create: `apps/family/src/data/tasks.ts`
- Create: `apps/family/src/data/points.ts`
- Create: `apps/family/src/data/rewards.ts`

Each file exports small async functions wrapping `supabase.from(...)`. Example contract for `tasks.ts` (others follow the same shape — list/insert/update for their table):

```ts
import { supabase } from "@/lib/supabase";
import type { PlannedInstance } from "@/domain/recurrence";

export async function upsertInstances(rows: PlannedInstance[]) {
  if (rows.length === 0) return;
  const payload = rows.map((r) => ({
    activity_id: r.activityId, member_id: r.memberId, due_date: r.dueDate,
  }));
  // unique(activity_id,member_id,due_date) makes this idempotent
  const { error } = await supabase.from("task_instances")
    .upsert(payload, { onConflict: "activity_id,member_id,due_date", ignoreDuplicates: true });
  if (error) throw error;
}

export async function listToday(memberId: string, date: string) {
  const { data, error } = await supabase.from("task_instances")
    .select("*, activities(*)").eq("member_id", memberId).eq("due_date", date);
  if (error) throw error;
  return data ?? [];
}

export async function submitTask(id: string) {
  const { error } = await supabase.from("task_instances")
    .update({ status: "submitted", submitted_at: new Date().toISOString() }).eq("id", id);
  if (error) throw error;
}
```

- [ ] **Step 1–5:** author each file's list/insert/update functions; one commit per file: `git commit -am "feat(family): data layer for <table>"`. (No unit tests here — these are thin Supabase wrappers verified live in M4/M7.)

### Task 3.3: Approve-task + redeem helpers (ledger writes)

**Files:**
- Modify: `apps/family/src/data/points.ts`

- [ ] **Step 1: Implement `approveTask` and `redeemReward`** — each performs the status update **and** the single ledger insert, surfacing errors:

```ts
import { supabase } from "@/lib/supabase";

export async function approveTask(opts: {
  instanceId: string; familyId: string; memberId: string; points: number; deciderId: string;
}) {
  const { error: u } = await supabase.from("task_instances").update({
    status: "approved", decided_by: opts.deciderId,
    decided_at: new Date().toISOString(), points_awarded: opts.points,
  }).eq("id", opts.instanceId);
  if (u) throw u;
  const { error: t } = await supabase.from("point_transactions").insert({
    family_id: opts.familyId, member_id: opts.memberId, delta: opts.points,
    source: "task", reason: "Task approved", ref_id: opts.instanceId, created_by: opts.deciderId,
  });
  if (t) throw t;
}

export async function approveRedemption(opts: {
  redemptionId: string; familyId: string; memberId: string; cost: number; deciderId: string;
}) {
  const { error: u } = await supabase.from("reward_redemptions").update({
    status: "fulfilled", decided_by: opts.deciderId, decided_at: new Date().toISOString(),
  }).eq("id", opts.redemptionId);
  if (u) throw u;
  const { error: t } = await supabase.from("point_transactions").insert({
    family_id: opts.familyId, member_id: opts.memberId, delta: -Math.abs(opts.cost),
    source: "reward", reason: "Reward redeemed", ref_id: opts.redemptionId, created_by: opts.deciderId,
  });
  if (t) throw t;
}

export async function addManualTxn(opts: {
  familyId: string; memberId: string; delta: number; reason: string; deciderId: string;
}) {
  const { error } = await supabase.from("point_transactions").insert({
    family_id: opts.familyId, member_id: opts.memberId, delta: opts.delta,
    source: opts.delta >= 0 ? "bonus" : "penalty", reason: opts.reason, created_by: opts.deciderId,
  });
  if (error) throw error;
}

export async function balanceOf(memberId: string): Promise<number> {
  const { data, error } = await supabase.from("member_balances")
    .select("balance").eq("member_id", memberId).maybeSingle();
  if (error) throw error;
  return data?.balance ?? 0;
}
```

- [ ] **Step 2: Commit** — `git commit -am "feat(family): ledger writes (approve task/redeem/manual)"`

---

## Milestone 4 — Auth & session **[needs creds]**

### Task 4.1: Auth provider + role/session

**Files:**
- Create: `apps/family/src/lib/session.ts`
- Create: `apps/family/src/app/providers.tsx`
- Modify: `apps/family/src/app/layout.tsx` (wrap children in `<AuthProvider>`)

- [ ] **Step 1: `session.ts`** — `getCurrentMember()` selects the `members` row for the signed-in user (or null), plus `signInWithGoogle()` and `signOut()`:

```ts
import { supabase } from "@/lib/supabase";
import type { Member } from "@/data/db-types";

export async function signInWithGoogle() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${location.origin}${base}/` },
  });
}
export async function signOut() { await supabase.auth.signOut(); }

export async function getCurrentMember(): Promise<Member | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("members").select("*")
    .eq("auth_user_id", user.id).maybeSingle();
  return data ?? null;
}
```

- [ ] **Step 2: `providers.tsx`** — client `AuthProvider` exposing `{ member, loading, refresh }` via context; subscribes to `supabase.auth.onAuthStateChange`.

- [ ] **Step 3: Wrap layout**; build (`pnpm --filter @kidcenter/family build`) to ensure client/server boundaries are valid. Expected: PASS.

- [ ] **Step 4: Commit** — `git commit -am "feat(family): google auth provider + session"`

### Task 4.2: Live smoke test with the owner's project **[needs creds]**

- [ ] **Step 1:** Owner completes `supabase/README.md` steps; put `apps/family/.env.local` with URL + anon key.
- [ ] **Step 2:** `pnpm --filter @kidcenter/family dev` → sign in with an allowlisted Gmail → confirm `getCurrentMember()` returns a parent row. Confirm a non-allowlisted account is blocked (no member → app shows "not authorized").
- [ ] **Step 3:** Commit any fixes — `git commit -am "fix(family): auth wiring per live smoke test"`

---

## Milestone 5 — Parent UI

Shared pieces first, then screens. Each screen is its own route under `src/app/` and uses the data layer + `AuthProvider`. A top-level gate in `page.tsx` routes by role: no member → login; parent → parent home; child link → kid view.

### Task 5.1: App gate + nav + auth screen
- Create `src/features/auth/LoginScreen.tsx` (Google button), `src/components/Gate.tsx` (loading/redirect by role), `src/components/ParentNav.tsx`.
- `page.tsx` renders `<Gate>` → login / parent dashboard / kid selector.
- Build; commit `feat(family): app gate + login + parent nav`.

### Task 5.2: Members management
- Route `src/app/members/page.tsx`: list children, add child (display_name, birth_year, avatar), set/clear PIN (uses `hashPin`), link-Google instructions. Uses `data/members.ts`.
- Commit `feat(family): parent members management`.

### Task 5.3: Activities CMS
- Route `src/app/activities/page.tsx`: manage `activity_types` (name/icon/color) and `activities` (title, type, points ±, recurrence + weekday picker, assignee = all/child, requires_approval, active). Uses `data/activities.ts`.
- Commit `feat(family): activities CMS`.

### Task 5.4: Approvals
- Route `src/app/approvals/page.tsx`: list `task_instances` with status `submitted` and `reward_redemptions` with status `requested`; approve → `approveTask` / `approveRedemption`; reject → status update. Realtime subscription refreshes the list.
- Commit `feat(family): approvals (tasks + redemptions)`.

### Task 5.5: Points & history + Rewards CMS
- Route `src/app/points/page.tsx`: per-child balance (`balanceOf`) + ledger list; add manual +/- (`addManualTxn`).
- Route `src/app/rewards/page.tsx`: CRUD `rewards`.
- Commit `feat(family): points history + rewards CMS`.

### Task 5.6: Parent dashboard
- `src/app/dashboard/page.tsx` (or parent branch of `page.tsx`): each child's balance, count of pending approvals, quick links.
- Commit `feat(family): parent dashboard`.

---

## Milestone 6 — Child UI + kid mode

### Task 6.1: Kid-mode selector + PIN gate
- `src/features/child/KidSelect.tsx`: parent (or shared device) picks a child; if `pin_hash` set, prompt PIN and `verifyPin`. Stores selected child id in `sessionStorage`.
- Commit `feat(family): kid-mode selector + PIN`.

### Task 6.2: Today
- `src/app/today/page.tsx`: on load, fetch active activities → `generateInstances` for today → `upsertInstances` (idempotent) → `listToday`. Render routine + tasks grouped by type; "Done" → `submitTask` (auto-approve activities immediately call `approveTask` via a parent? No — auto-approve still requires a parent ledger write; for `requires_approval=false`, mark approved through a Postgres `security definer` RPC `auto_complete_task(instance_id)` that a child may call). Add migration `0004_auto_complete.sql` with that RPC + grant.
- Commit `feat(family): child Today + auto-complete RPC`.

### Task 6.3: My points, Reward store, Leaderboard
- `src/app/me/page.tsx`: balance + recent ledger for the selected child.
- `src/app/store/page.tsx`: list active rewards; if `canAfford`, "Redeem" → insert `reward_redemptions` (requested).
- `src/app/leaderboard/page.tsx`: family standings from `member_balances` joined to members; weekly view via `created_at` filter.
- Commit `feat(family): child points, store, leaderboard`.

---

## Milestone 7 — Deploy at `/quest` **[needs creds]**

### Task 7.1: Extend the Pages workflow

**Files:**
- Modify: `.github/workflows/deploy.yml`

- [ ] **Step 1:** Add a build step for family with subpath + secrets, and assemble into the portfolio artifact:

```yaml
      - name: Build portfolio (static export)
        run: pnpm --filter @kidcenter/portfolio build
      - name: Build family app at /quest
        env:
          NEXT_PUBLIC_BASE_PATH: /quest
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
        run: pnpm --filter @kidcenter/family build
      - name: Assemble artifact
        run: |
          rm -rf apps/portfolio/out/quest
          cp -r apps/family/out apps/portfolio/out/quest
      - uses: actions/upload-pages-artifact@v3
        with:
          path: apps/portfolio/out
```

- [ ] **Step 2:** Add a `.nojekyll` safety (portfolio already has it) so `/quest/_next` is served.
- [ ] **Step 3:** Push; confirm `https://www.huudaodinh.site/quest/` loads the login screen and a non-logged-in visitor sees only the login gate.
- [ ] **Step 4:** Commit — `git commit -am "ci(family): deploy family app at /quest subpath"`

---

## Milestone 8 — E2E + polish **[needs creds]**

### Task 8.1: Critical-path E2E (webapp-testing / Playwright)
- Flow A: parent creates an activity → kid marks done → parent approves → kid balance increases.
- Flow B: parent creates a reward → kid redeems → parent approves → kid balance decreases, never below zero.
- Commit `test(family): e2e approval + redemption flows`.

### Task 8.2: Design pass
- Run `design-review` against the parent + child screens; align to `@kidcenter/ui` tokens; ensure mobile-first (used on phones). Commit fixes.

---

## Self-review notes
- **Spec coverage:** roles/auth (M2.3,M4), dynamic CMS (M5.3), routine+tasks (M1.3,M6.2), ledger (M1.2,M3.3), rewards store (M5.5,M6.3), leaderboard (M6.3), RLS family-only (M2.2), multi-child (schema + generateInstances), `/quest` deploy (M7). Covered.
- **Auto-complete gap:** `requires_approval=false` needs a child-callable ledger write → addressed by the `auto_complete_task` security-definer RPC in Task 6.2 (migration `0004`).
- **Balance non-negative:** enforced at redemption time in UI (`canAfford`) and should also be guarded server-side; add a check inside the `auto_complete`/redeem RPCs if redemptions move to an RPC later. For Phase 1, parent-approved redemptions + `canAfford` gate are sufficient.
- **Types:** snake_case row types (`db-types.ts`) vs camelCase domain (`types.ts`) are deliberately separate layers; data wrappers translate at the boundary.
```
