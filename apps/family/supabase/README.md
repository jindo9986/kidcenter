# Family Quest — Supabase setup

One-time setup for the backend. The **anon key is public-safe**; the service-role
key is never used in the app and must stay secret.

## 1. Create the project
1. Create a free Supabase project. Copy the **Project URL** and **anon public key**
   (Project Settings → API).

## 2. Run the migrations (SQL editor, in order)
Run each file's contents in the Supabase SQL editor:
1. `migrations/0001_schema.sql` — tables, indexes, `member_balances` view.
2. `migrations/0002_rls.sql` — helper functions + row-level security policies.
3. `migrations/0003_provision_trigger.sql` — auto-link/create a member on first
   allowlisted sign-in.

## 3. Seed the family + allowlist
```sql
insert into families(name) values ('Đào family');
insert into allowlist_emails(family_id, email, role)
  select id, 'PARENT_EMAIL@gmail.com', 'parent' from families;
-- add more parent/child emails as needed
```

## 4. Enable Google auth
1. Authentication → Providers → enable **Google**.
2. In Google Cloud, create an OAuth client.
   - Authorized redirect URI: `https://<project>.supabase.co/auth/v1/callback`
3. Paste the client id/secret into Supabase.
4. Authentication → URL config: set **Site URL** `https://www.huudaodinh.site/quest`
   and add the same to the redirect allow-list.

## 5. Wire env into the app
- Local dev: copy `apps/family/.env.local.example` → `.env.local`, fill in
  `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Production: add the same two values as GitHub Actions secrets
  (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

## Notes
- A non-allowlisted Google account can authenticate but gets **no member row**, so
  the app shows "not authorized" and exposes no family data (RLS denies all reads).
- Balances are always derived from `point_transactions`; nothing stores a balance.
