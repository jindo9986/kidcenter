-- A child may create their own pending task instances (kid-mode Today generates
-- today's instances client-side). Parents still own all other writes (ti_admin).
create policy ti_child_generate on task_instances for insert
  with check (member_id = (select id from current_member()) and status = 'pending');

-- Auto-complete an activity that does NOT require approval: the owning child can
-- award themselves the points through this security-definer RPC (children cannot
-- write the ledger directly). Idempotent; rejects activities that need approval.
create or replace function auto_complete_task(p_instance uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  ti  task_instances;
  act activities;
  me  members;
begin
  select * into me from members where auth_user_id = auth.uid() limit 1;
  if me.id is null then raise exception 'no member for caller'; end if;

  select * into ti from task_instances where id = p_instance;
  if ti.id is null then raise exception 'instance not found'; end if;

  select * into act from activities where id = ti.activity_id;

  -- only the owning child, or a parent in the same family
  if not (ti.member_id = me.id
          or (me.role = 'parent' and act.family_id = me.family_id)) then
    raise exception 'forbidden';
  end if;
  if act.requires_approval then raise exception 'activity requires approval'; end if;
  if ti.status = 'approved' then return; end if; -- idempotent

  update task_instances
    set status = 'approved', decided_by = me.id, decided_at = now(),
        points_awarded = act.points
    where id = p_instance;

  insert into point_transactions(family_id, member_id, delta, source, reason, ref_id, created_by)
    values (act.family_id, ti.member_id, act.points, 'task', 'Auto-completed', p_instance, me.id);
end; $$;

grant execute on function auto_complete_task(uuid) to authenticated;
