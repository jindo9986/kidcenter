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
alter table allowlist_emails    enable row level security;
alter table activity_types      enable row level security;
alter table activities          enable row level security;
alter table task_instances      enable row level security;
alter table point_transactions  enable row level security;
alter table rewards             enable row level security;
alter table reward_redemptions  enable row level security;

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
