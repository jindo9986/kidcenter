-- Study dashboard data. Applies to the SAME Supabase project as the Family app,
-- AFTER apps/family/supabase/migrations/0005 (it reuses families(), my_family_id(),
-- is_parent() defined there). No data lives in this migration — the actual school
-- records are seeded locally via scripts/seed.mjs so they never enter the repo.

create table if not exists study_docs (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  doc_key text not null check (doc_key in ('academics', 'comments', 'assessment', 'roadmap')),
  data jsonb not null,
  updated_at timestamptz not null default now(),
  unique (family_id, doc_key)
);

alter table study_docs enable row level security;

-- Sensitive: only parents in the family may read or write. Children and anyone not
-- on the allowlist (no provisioned member row) see nothing.
create policy study_docs_parent on study_docs for all
  using (family_id = my_family_id() and is_parent())
  with check (family_id = my_family_id() and is_parent());
