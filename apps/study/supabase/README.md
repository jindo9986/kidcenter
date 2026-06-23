# Study — Supabase

This app shares the **same Supabase project** as the Family app. It adds one table,
`study_docs`, holding the dashboard data as JSONB documents, readable/writable by
**parents only** (RLS reuses Family's `my_family_id()` / `is_parent()` helpers).

## Apply the migration

`migrations/0006_study_docs.sql` runs **after** Family's `0001`–`0005` on the same
project. Apply it in the Supabase SQL editor (or your migration tool).

## Seed the data (local, once)

The school records are **not** committed (the repo is public). They live in the
git-ignored `content/*.json` and are loaded into `study_docs` by:

```bash
# apps/study/.env.local must have NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
node scripts/seed.mjs
```

A parent member must already exist (provisioned by the Family allowlist + Google
sign-in) so there is a `families` row to attach the docs to.

## Access

Sign in with a Google account whose email is on the family allowlist **with role
`parent`**. Children and non-allowlisted users see nothing (RLS denies the rows).
