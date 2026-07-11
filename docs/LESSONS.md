# LESSONS — recurring traps & patterns

> Backfilled 2026-06-23. Numbered sequentially; never reuse a number.

## 1. A public repo means git — not deployment — is the privacy boundary

**What happened (v0.4.0)**: Study was built "local-only, not deployed" to keep school
records private. But `jindo9986/kidcenter` is a **public** repo — committing the data
JSON (or the design spec that quoted scores/comments) would have exposed it regardless
of deployment. Caught before pushing; the spec was sanitised and history rewritten.

**Why**: on a public repo, anything committed is world-readable immediately. "We won't
deploy it" protects nothing.

**How to avoid**:
- git-ignore all sensitive data (`content/*.json`, `.env*`, PDFs) **before** creating it.
- DB-backed apps: ship a static shell, fetch data at runtime behind auth + RLS — never bake data into the bundle.
- Specs/docs describe data *shape*, never real values.
- Before committing, grep the staged diff for real values (scores, quotes, keys).

See [CONTEXT D11](CONTEXT.md).

## 2. Supabase OAuth redirects to the Site URL unless the exact app URL is allowlisted

**What happened (v0.4.0)**: Google login on Study (`localhost:3003`) redirected back to
the production Site URL instead of the app. Not a code bug.

**Why**: Supabase only honours a post-auth `redirectTo` that matches an entry in
Authentication → URL Configuration → **Redirect URLs**. `localhost:3003` wasn't listed,
so it fell back to the Site URL. Each app runs on its own port (`/quest` 3002, `/study`
3003) and each prod path is distinct.

**How to avoid**: for every app + environment, add both dev and prod URLs
(`http://localhost:<port>/**`, `https://<domain>/<path>/**`) to the Redirect URLs list.

See [SETUP.md](SETUP.md) Supabase step 3.

## 3. A zoomed radial/axis domain lies about proportion

**What happened (v0.4.0)**: To make near-perfect scores show "shape", the radar mapped
[70,100]% onto the full radius — so a near-perfect score sat at ~50% radius and read as mid-range.

**Why**: a non-zero-based domain exaggerates differences. On a radar the distortion is
severe because area, not just length, reads as magnitude.

**How to avoid**:
- Default charts to a true zero-based domain (0–100%). If you must zoom, label the
  baseline unmistakably and prefer bars over radar/area.
- Show the exact value next to the mark so the number is always legible.

See [CONTEXT D10](CONTEXT.md).

## 4. Cross-scale trends need normalisation — and near-max early scores can mislead

**What happened (v0.4.0)**: Grade 1 uses a 0–6 Cambridge scale; Grades 2–4 use 0–10.
Plotting raw scores across years is meaningless; even after normalising to %, a near-max
G1 score (6/6 = 100%) can make later years look like a "drop".

**Why**: different denominators + a compressed early ceiling.

**How to avoid**: normalise every score to % of that year's scale (unit-tested
`normalizePct`), and annotate the scale change so a dip isn't misread as regression.

## 5. Browser-rotated photos carry EXIF orientation the static host ignores

**What happened (v0.2.0)**: A home-story photo displayed rotated. Fix required stripping
the stray EXIF orientation **and** renaming the file to bust a stale CDN cache of the
rotated image.

**How to avoid**: strip EXIF on import for any user photo; when replacing an image that
was already served, change the filename (or add a version suffix) to defeat caching.

## 6. Keep helpers pure across the static-export / data boundary

**What happened**: Reusing the same rendering components for a build-time (JSON) preview
and a runtime (Supabase) data path only stayed clean because the components take data as
props and the fetch/auth lives at the edge.

**How to avoid**: components render from props; data loading + auth stay in a thin edge
layer (`lib/*-data.ts`, the auth gate). This let Study swap JSON-in-bundle for
Supabase-at-runtime without touching the charts.

## 7. The build has no network — `next/font/google` fails; self-host fonts

**What happened (v0.1.0)**: Using `next/font/google` broke the build because the build
environment blocks network access, so Google Fonts can't be fetched at build time.

**Why**: `next/font/google` downloads font files during `next build`. No network → build
error (or a silent fallback that ships the wrong fonts).

**How to avoid**: self-host fonts as woff2 in `src/app/fonts/` and load them via a
`fonts.css` `@font-face`. Every app (portfolio, family, study) copies the same fonts.
Never introduce `next/font/google`.

See [CONTEXT D12](CONTEXT.md).

## 8. On a custom-domain root deploy, a stray basePath 404s every asset

**What happened**: An earlier subpath deploy used `NEXT_PUBLIC_BASE_PATH=/kidcenter`
(for `jindo9986.github.io/kidcenter`). After moving to the custom domain at the **root**,
leaving that basePath set made every asset request go to `/kidcenter/_next/...` → 404,
breaking all CSS/JS.

**Why**: `basePath`/`assetPrefix` prefix every bundled asset URL. The prefix must equal
the path the app is actually served from — root ("") for portfolio, `/quest` for family,
`/study` for study.

**How to avoid**:
- Portfolio (root/custom domain): **no** basePath. Sub-apps: basePath = their subpath.
- Keep `public/.nojekyll` so `_next/` is served; keep `public/CNAME` for the domain.
- Raw `public/` media must go through `asset()` so it gets the same prefix.

See [CONTEXT D5](CONTEXT.md).

## 9. Supabase "Unable to exchange external code" = wrong Google client secret

**What happened (Family Quest)**: Google login failed with *"Unable to exchange external
code"*. Not an app bug.

**Why**: the Google OAuth **client secret** configured in the Supabase Auth provider was
wrong/stale, so Supabase couldn't complete the code exchange.

**How to avoid**: re-paste the Google client id + secret in Supabase → Authentication →
Providers → Google. Pair with LESSONS §2 (Redirect URLs) — these are the two Google-OAuth
config traps.

## 10. Google-only membership removed a duplicate-child bug

**What happened (v0.2.0)**: Manual member creation + PINs let a child exist twice (a
manual row and a Google-provisioned row), causing a duplicate-child bug.

**Why**: two sources of truth for "who is a member" (manual rows vs. the auth trigger).

**How to avoid**: one source of truth — every member (parent + child) signs in with their
own Gmail; the `handle_new_auth_user` trigger provisions their row on first allowlisted
sign-in; `display_name` comes from Google. No manual member rows, no PINs. Adding a member
= add their Gmail to the allowlist with a role.

See [CONTEXT D6](CONTEXT.md).
