# Study Dashboard — Design Spec

**Date:** 2026-06-23
**Status:** Approved — **v2 (DB + Auth) supersedes the local-only architecture below; see the v2 addendum at the end.**
**App:** `apps/study` (`@kidcenter/study`) — working name "Bảng đánh giá nội bộ"

An **internal, private** dashboard that aggregates Đào Đình Hữu (Tin)'s Vinschool
report cards from Grade 1 to Grade 4 into one view, synthesises four years of
teacher feedback, and proposes an improvement roadmap to work through **with the
child**. Not public; runs locally only.

---

## 1. Goals & non-goals

**Goals**
- One scrolling dashboard that makes 4 years of academic data legible at a glance.
- Show **score trends over time** per core subject, a **current capability map**,
  **learner-attribute** consistency, a **synthesis of teacher comments** (recurring
  strengths + growth areas), an **internal assessment**, and an **actionable
  improvement roadmap** the parent and child can follow together.
- Vietnamese-first (audience = parents + the child).
- Follow the project design system (`apps/portfolio/DESIGN.md`, Editorial Warm).

**Non-goals**
- No public deployment. The dashboard is **not** added to the GitHub Pages workflow.
  Sensitive school records stay local.
- No auth, no backend, no data-entry UI (data is curated JSON for a fixed set of
  historical reports; future reports are added by editing JSON).
- No heavy charting library — charts are hand-built SVG.
- No bilingual toggle (internal tool; Vietnamese only).

---

## 2. Architecture

- **App:** new Next.js (App Router) **static export** app `apps/study` in the
  existing pnpm/Turbo monorepo, port **3003**, reusing `@kidcenter/ui`.
- **Design system:** **Editorial Warm**, identical to portfolio/family — self-host
  Fraunces + Be Vietnam Pro (copied into `src/app/fonts`), import `fonts.css`, and
  override the shared `@kidcenter/ui` tokens in `globals.css` (brand `#3730A3`,
  accent/gold `#E8A317`, teal, cream `#FFFDF7`, ink). Cards rounded, soft shadow,
  Fraunces headings, gold tied to highlights. Calibrated against
  `apps/portfolio/DESIGN.md`; deviations need approval.
- **Privacy:** local-only. `pnpm dev:study` runs it; the production `deploy.yml` is
  **not** touched. (If a private build is ever wanted, it stays out of the public
  Pages artifact.)
- **Build (implementation):** the UI is built using the Anthropic **frontend-design**
  skill, kept within the Editorial Warm constraints above.
- **Language:** Vietnamese.

---

## 3. Data model (curated JSON in `apps/study/content/`)

All data is hand-extracted from the eight report PDFs (G1–G4: Cambridge subject
reports + MOET progress reports). Scales differ by grade and are normalised to a
percentage for trends.

- **`academics.json`** — array of years:
  ```
  {
    grade: 1|2|3|4, class: "<class>", year: "<school-year>",
    scale: { max: 6 } | { max: 10 },        // Cambridge scale that year
    subjects: [
      { key: "science", name: "Khoa học",
        progression: { dec: number|null, may: number|null },   // Progression Test
        units: [{ name, score }],                              // optional unit scores
        moet: "<score>/10" | null, level: "T"|"Đ"|... }        // MOET overall
    ],
    attributes: { confident, responsible, reflective, innovative, engaged },  // Cambridge
    vinser?: { hamHoc, chuDong, chinhTruc, sangTao, tonTrong },               // G1–G2
    clise?: { selfAwareness, socialAwareness, selfManagement, relationship, decisions },
    awards?: [ "<award label>", … ]
  }
  ```
  `subjectStrands` (e.g. Vietnamese: Đọc/Viết/Nói-nghe/Ngôn ngữ mastery levels) are
  included on the latest year where available.
- **`comments.json`** — `{ subject, teacher, grade, year, points: string[] }`,
  the condensed key points of each teacher comment (for the synthesis section and
  as evidence behind findings).
- **`assessment.json`** — curated synthesis: `strengths[]`, `watchAreas[]`,
  `learningStyle` (short paragraphs). Editable by the owner.
- **`roadmap.json`** — `focusAreas[]`, each `{ title, why (evidence), steps[],
  parentSupport[] }`. Editable.

### Data the extraction must capture (shape only)

> **Privacy:** this repo is public. The spec describes the *shape* of the data only.
> No real scores, grades, or verbatim teacher comments live here — they exist solely
> in the git-ignored `content/*.json` and in Supabase. Do not paste actual values
> into this document.

- **Trends:** per core subject (Science, Maths, English/ESL, ICT, Global
  Perspectives), DEC→MAY progression scores per grade G1–G4, each with its scale
  (`max` 6 for G1, 10 for G2–G4), normalised to % for charting. Some subjects start
  at G2 (gaps allowed).
- **Current (G4) snapshot:** end-of-year subject scores for the radar + the MOET
  overall grades + Vietnamese strand mastery levels.
- **Attributes:** Cambridge learner attributes, Vinser qualities (G1–G2), CLISE
  strands (G4) — captured as labels + a short consistency note, not numbers.
- **Comments synthesis:** recurring **strength** and **growth-area** themes, each a
  short title plus its supporting quotes/teacher/year. The concrete quotes live only
  in `content/comments.json`; here we record only that the structure is
  `{ title, evidence: [{ quote, who, grade }] }`.

---

## 4. Sections (single scrolling page)

1. **Header + KPIs** — name/ID, "Đánh giá nội bộ · Lớp 1 → Lớp 4", date; KPI tiles:
   years tracked (4), subjects, Grade-4 average, Cambridge attributes at top level.
2. **Xu hướng điểm theo thời gian** — *small multiples*: one mini line chart per core
   subject (Science, Maths, English, ICT, Global Perspectives) across G1→G4,
   normalised to %, DEC vs MAY points marked, with a footnote on the G1 0–6 → G2+
   0–10 scale change.
3. **Bản đồ năng lực hiện tại** — radar (or bars) of Grade-4 subject scores; a
   by-strand breakdown where available (e.g. Vietnamese strands).
4. **Phẩm chất qua các năm** — Cambridge attributes (all top), Vinser (G1–G2), CLISE
   strands; framed as consistency over time.
5. **Tổng hợp nhận xét giáo viên** — two columns: **Điểm mạnh** (cards) and **Điểm
   cần cải thiện** (cards), each card carrying supporting quotes + the years/teachers.
6. **Đánh giá nội bộ** — strengths · watch-areas · learning style (independent,
   curious, accurate-but-can-rush, introverted-but-capable).
7. **Lộ trình cải thiện** — focus areas (Cẩn thận & soát bài · Đọc chủ động · Toán nền
   tảng · Tự tin diễn đạt), each with concrete steps + how parents help, as a
   checklist to use with the child; tied to evidence.

---

## 5. Components

- `LineTrend` — SVG line chart for one subject's DEC/MAY % across grades.
- `Bars` / reuse a `RadarChart` (SVG) — current capability map.
- `AttributeGrid` — attributes per year.
- `ThemeCard` — a strength/growth theme with quotes + evidence chips.
- `FocusArea` — roadmap card (why · steps · parent support · checkboxes).
- Shared `Section`, `Eyebrow`, KPI tiles — mirror the portfolio's Editorial-Warm
  building blocks.
- Pure helper `normalizePct(score, max)` — unit-tested (the one place with real
  logic; scale normalisation must be correct or trends mislead).

---

## 6. Testing

- Unit: `normalizePct` (scale normalisation) and any trend-series builder.
- Build + lint clean. No e2e (internal, static).

---

## 7. Monorepo touch points

- `pnpm-workspace.yaml` already globs `apps/*`.
- Add root script `dev:study` (mirror `dev:portfolio`).
- **Do NOT** modify `.github/workflows/deploy.yml` — this app is local-only.

---

## 8. Out of scope / later

- Auto-extraction from PDFs, data-entry UI, multi-child, bilingual toggle.
- Integration into Family Quest (this could later become its Phase 2), or a private
  deployment behind auth.

---

## v2 Addendum — Database + Auth (supersedes §2 Architecture, §3 Data model, §4 footnote, §7)

**Decision (2026-06-23):** the dashboard moves from local-only JSON-in-bundle to a
DB-backed, auth-gated app that can be deployed safely. Data is fetched at runtime
from Supabase behind a login + RLS, so it is never baked into the static bundle.

**Backend — shared with the Family app (one Supabase project):**
- New migration `apps/study/supabase/migrations/0006_study_docs.sql`, applied to the
  same project *after* Family's `0005`. **No data in the migration.**
- Table `study_docs(id, family_id → families, doc_key ∈ {academics,comments,
  assessment,roadmap}, data jsonb, updated_at, unique(family_id, doc_key))`.
- Document-store (JSONB) on purpose: read-mostly, document-shaped, one-to-one with
  the four content files. Avoids premature normalisation (YAGNI).
- RLS: parents only — `using (family_id = my_family_id() and is_parent())` for both
  read and write. Reuses Family's `my_family_id()` / `is_parent()` helpers. Children
  and non-allowlisted users see nothing.

**Auth — copy Family's small auth surface into study (shared backend, independent code):**
- `lib/supabase.ts`, `lib/session.ts` (Google OAuth), `app/providers.tsx`
  (`AuthProvider`/`useAuth`), `features/auth/LoginScreen.tsx` (study copy),
  `components/Spinner.tsx`, `lib/useAsync.ts`, slim `lib/db-types.ts` (Member/Role).
- Gate in `app/page.tsx`: loading → Spinner · `member.role === 'parent'` → Dashboard
  · signed-in non-parent → "không có quyền" · not allowlisted → `LoginScreen`.

**Data flow:** Dashboard becomes a client component. `lib/study-data.ts` fetches the
four docs from `study_docs` for the member's family and renders the existing sections
(LineTrend / RadarChart / ThemeCard / FocusArea unchanged). `content/*.json` remains
local-only and serves only as the seed source.

**Seed (keeps data out of the public repo):** committed `scripts/seed.mjs` reads the
local (git-ignored) `content/*.json` plus `SUPABASE_SERVICE_ROLE_KEY` from a git-ignored
`.env`, and upserts the four docs into `study_docs`. The script holds no data/secrets,
so it is safe to commit. Run once after migrating.

**Deploy:** add a `/study` build to `.github/workflows/deploy.yml`
(`NEXT_PUBLIC_BASE_PATH=/study` + the existing Supabase secrets), assembled into
`apps/portfolio/out/study`. Safe to host publicly: the app shell is static but all
data loads from Supabase behind Google login + parent-only RLS.

**Editing later:** parents edit the JSONB directly, or edit JSON and re-seed. A mini-CMS
is out of scope.
