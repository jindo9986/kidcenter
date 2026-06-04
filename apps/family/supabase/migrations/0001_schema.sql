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

-- Balances are always derived from the ledger, never stored.
create view member_balances as
  select member_id, coalesce(sum(delta), 0)::int as balance
  from point_transactions group by member_id;
