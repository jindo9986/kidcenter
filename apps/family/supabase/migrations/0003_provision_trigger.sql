-- On a new auth user, if the email is allowlisted, link or create a member row.
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
