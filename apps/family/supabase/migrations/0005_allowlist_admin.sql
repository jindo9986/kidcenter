-- allowlist_emails had RLS enabled (0002) but no policy, so it was unreadable/
-- unwritable from the client and could only be edited via the SQL editor.
-- Let parents fully manage their own family's allowlist (read/insert/update/delete).
create policy al_admin on allowlist_emails for all
  using (family_id = my_family_id() and is_parent())
  with check (family_id = my_family_id() and is_parent());
