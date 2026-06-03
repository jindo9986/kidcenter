# Portfolio App — Design Spec

- **Date:** 2026-06-03
- **App:** `apps/portfolio` (Next.js 16, port 3001)
- **Goal:** A bilingual (VI/EN) single-page portfolio for one child, content stored
  in plain JSON/Markdown files, exportable to PDF for program applications.

## Scope

- **One child** for now. Data layout must extend to multiple children later by
  adding a per-child folder, without restructuring.
- **Bilingual VI/EN** — every text field has both languages; a toggle switches the
  visible language.
- **Five content sections:** Profile, Achievements, Projects, Media Gallery,
  Growth Journey (a story-style timeline).
- **PDF export** via browser print (print-optimized CSS + `window.print()`).
- **No database / no network at runtime or build** — content is read from files.

Out of scope (later): multi-child routing, an in-app content editor, image
uploads, i18n beyond VI/EN, server-side PDF rendering.

## Content layout

```
apps/portfolio/content/
├─ profile.json        # name, age, avatar, tagline{vi,en}, bio{vi,en},
│                      # interests[{vi,en}], skills[{vi,en}], parentContact{...}
├─ achievements.json   # [{ date, icon, title{vi,en}, detail{vi,en} }]
├─ journey.json        # [{ date, icon, title{vi,en}, body{vi,en} }]  (timeline story)
├─ gallery.json        # [{ type:'image'|'video', src, caption{vi,en} }]
└─ projects/
   └─ <slug>/
      ├─ meta.json     # { date, tag{vi,en}, cover, title{vi,en} }
      ├─ vi.md         # long-form description (Vietnamese)
      └─ en.md         # long-form description (English)
```

Media assets live in `apps/portfolio/public/media/`. `src` fields in
`gallery.json` / `cover` in `meta.json` are paths under `/media/...`.

Multi-child extension path (not built now): move the above under
`content/<kid-slug>/` and add a child index. Loaders take a base dir so the
change is localized.

## Data types

A localized string is `type L = { vi: string; en: string }`.

- `Profile`: `{ name; age; avatar; tagline: L; bio: L; interests: L[]; skills: L[];
  parentContact: { name; email?; phone? } }`
- `Achievement`: `{ date: string; icon: string; title: L; detail: L }`
- `JourneyMilestone`: `{ date: string; icon: string; title: L; body: L }`
- `MediaItem`: `{ type: 'image' | 'video'; src: string; caption: L }`
- `Project`: `{ slug; date; cover?; tag: L; title: L; bodyHtml: { vi; en } }`
  — `bodyHtml` is `vi.md` / `en.md` rendered to HTML at load time.

## Loading & validation

- `src/lib/content.ts` reads files with `fs` in Server Components (static
  generation; no client fetch).
- Each file is parsed and validated with **zod** schemas. Invalid content throws
  a clear error at build/render time — safety net for hand-edited files.
- Project markdown (`vi.md` / `en.md`) is rendered to HTML with **marked**
  (pure JS, offline). Sanitization is unnecessary because content is authored by
  the repo owner only; if that changes, add a sanitizer.
- Loader functions: `getProfile()`, `getAchievements()`, `getJourney()`,
  `getGallery()`, `getProjects()` — each returns typed, validated data.

## Bilingual rendering

- Goal: minimal client JS, SSR contains both languages, print works per language.
- A `<Localized value={L} />` server component renders **both** strings, each
  wrapped: `<span data-lang="vi">…</span><span data-lang="en">…</span>`.
- Project bodies render both HTML blocks wrapped in `data-lang` divs.
- CSS controls visibility off `html[data-locale]`:
  ```css
  html[data-locale="vi"] [data-lang="en"] { display: none; }
  html[data-locale="en"] [data-lang="vi"] { display: none; }
  ```
- A small client component `<LangToggle>` flips
  `document.documentElement.dataset.locale` between `vi`/`en` (default `vi`),
  persisting choice to `localStorage`.
- No React context, no refetch.

## Page layout (single scrolling page)

Order: Hero (avatar + name + tagline) → About (bio + interests + skills) →
Achievements → Projects (cards; description expands the rendered markdown) →
Growth Journey (vertical timeline) → Media Gallery → Footer (parent contact).

- Reuses `Button` and `Card` from `@kidcenter/ui`.
- Portfolio-specific pieces live in `apps/portfolio/src/components/`
  (`Hero`, `Section`, `Timeline`, `Gallery`, `ProjectCard`, `LangToggle`,
  `Localized`, `PrintButton`).
- A sticky top bar holds the `LangToggle` and the **Tải PDF / Export PDF** button.

## PDF export

- `<PrintButton>` (client) calls `window.print()`.
- A print stylesheet (`@media print`) in `globals.css`:
  - hides the top bar, toggle, buttons, and any interactive affordance;
  - expands all sections (no collapsed state in print);
  - prints only the currently selected locale (the `data-locale` rules already
    hide the other language);
  - sets sensible page breaks (`break-inside: avoid` on cards/timeline items),
    white background, readable margins.

## Testing

- **vitest** unit tests:
  - `content.ts`: loads and validates each fixture; a malformed fixture makes the
    schema throw.
  - markdown rendering: a `.md` fixture renders expected HTML.
  - `Localized` / locale helper: emits both `data-lang` spans.
- Keep it light — the goal is to catch data-shape regressions, not exhaustive UI
  tests.

## New dependencies

- `marked` — markdown → HTML (offline, tiny).
- `zod` — runtime validation of content files.
- `vitest` (dev) — unit tests. Add `@kidcenter/portfolio` `test` script.

All install via pnpm from the npm registry; none require network at build or
runtime.

## Seed content

Migrate the current hardcoded `page.tsx` data into the new content files as the
first real entry (child "Nguyễn Bảo Na"), plus 2–3 projects with VI/EN markdown,
a few achievements, journey milestones, and placeholder gallery items, so the app
renders meaningfully end-to-end.
