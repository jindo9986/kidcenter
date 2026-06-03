# Design System — KidCenter Portfolio

> Source of truth for the `apps/portfolio` app. Read this before any visual or UI
> change. Do not deviate without explicit user approval.
> Created via `/design-consultation` (gstack), 2026-06-03. Approved direction: **A · Editorial Warm**.

## Product Context
- **What this is:** A bilingual (VI/EN) single-page portfolio for one child, used to
  apply to learning programs. Content is file-based (JSON/Markdown), exportable to PDF.
- **Who it's for:** Two audiences at once — the child (subject) and adult reviewers
  (admissions officers, teachers). The design must read as **credible** to adults
  while staying **warm and age-appropriate** for a 10-year-old.
- **Subject:** Đào Đình Hữu (Tin), 10 — a high-achieving young scientist
  (Science/Math Olympiad medalist) who also loves drawing dinosaurs.
- **Project type:** Personal portfolio / application dossier.

## Aesthetic Direction
- **Name:** Editorial Warm — *"a serious young scientist, presented with warmth."*
- **Decoration level:** intentional (a faint graph-paper texture on the hero, nothing more).
- **Mood:** Structured and trustworthy like a real achievement record, kept human by a
  warm serif, cream paper, and soft rounded cards. Not cutesy; not cold.
- **Memorable thing:** Achievement = gold. The portfolio is medal-heavy, so the gold
  accent is the brand thread tying the whole page together.
- **Anti-patterns to avoid:** neon primaries, bubble-radius on everything, childish
  display fonts (undermine credibility with adult reviewers), purple gradients.

## Typography
Both faces **must support Vietnamese diacritics** (the app is bilingual VI/EN).

- **Display / Hero:** **Fraunces** (soft, characterful old-style serif; has a Vietnamese
  subset). Weight 500–600. Used for h1, section headings, kickers (italic).
- **Body / UI:** **Be Vietnam Pro** (designed for Vietnamese; clean, lightly rounded
  humanist sans). Weights 400/500/600/700.
- **Numbers / scores:** Be Vietnam Pro with `font-variant-numeric: tabular-nums`.
- **Scale (rem / px @16):** h1 2.5/40 · h2 1.625/26 · h3 1.125/18 · body 1/16 ·
  small 0.875/14 · micro 0.75/12. Line-height 1.5 body, 1.15 display.

### Font loading strategy (IMPORTANT — offline build)
The Next.js build runs **offline** (Google Fonts / `next/font/google` is blocked at
build time in this environment). Do **not** use `next/font/google`. Instead:
1. **Self-host:** download the `woff2` files for Fraunces + Be Vietnam Pro (Latin +
   Vietnamese subsets) once, commit them to `apps/portfolio/public/fonts/`, and declare
   `@font-face` in `globals.css` with `font-display: swap`.
2. **Fallback stack (so it always builds & renders):**
   - display: `"Fraunces", Georgia, "Times New Roman", serif`
   - body: `"Be Vietnam Pro", system-ui, -apple-system, "Segoe UI", sans-serif`
3. Until the woff2 files are added, the fallback stack is what ships — acceptable, but
   self-hosting is the target for the intended look.

## Color
Light theme only (a portfolio/print dossier; no dark mode needed). All values are the
approved Variant A palette.

| Token | Hex | Use |
| --- | --- | --- |
| `--color-brand` | `#3730A3` | Primary indigo — trust/intellect; headings accents, chips, primary button |
| `--color-brand-dark` | `#2E2A82` | Hover/pressed primary |
| `--color-gold` | `#E8A317` | Accent — achievement/energy; score chip (9), highlights |
| `--color-teal` | `#0D9488` | Secondary — science/growth; used sparingly (tags) |
| `--color-paper` | `#FFFDF7` | Page background (warm paper) |
| `--color-surface` | `#FFFFFF` | Cards |
| `--color-ink` | `#1F2937` | Primary text |
| `--color-muted` | `#6B7280` | Secondary text |

Medal colors (used for the medal-grouped achievements):
`gold #D4A017 · silver #9CA3AF · bronze #B45309`.

Usage rules: one hero color (indigo) + gold as the meaningful accent. Teal is rare.
Gold must stay tied to achievement (medals, top scores) — do not spray it as decoration.

## Spacing
- **Base unit:** 4px. Density: comfortable.
- **Scale:** 2xs(2) xs(4) sm(8) md(16) lg(24) xl(32) 2xl(48) 3xl(64).

## Layout
- **Approach:** editorial with structure. Single scrolling page, max content width **880px**.
- **Grid:** achievements as cards grouped by category; grades as a 3-column chip grid
  (2-column on mobile).
- **Border radius:** sm 8 · md 16 · lg 24 · xl 28 (cards) · full 9999.
- **Hero treatment:** rounded card (radius 28) with a faint indigo **graph-paper**
  background (repeating 24px lines at ~6% opacity) over warm paper. Round avatar with a
  soft gold radial fill / ring.
- **Sticky top bar:** holds the 🌐 language toggle + ⬇️ PDF button; class `no-print`.

## Motion
- **Approach:** intentional, restrained.
- **Easing:** enter `ease-out`, exit `ease-in`, move `ease-in-out`.
- **Duration:** micro 50–100ms, short 150–250ms (hover, toggles), medium 250–400ms
  (one staggered hero/section reveal on load). No scroll-jacking.

## Component Patterns
- **Localized text:** every string renders both languages wrapped in
  `data-lang="vi"` / `data-lang="en"`; CSS shows the active one via `html[data-locale]`.
- **Achievement group:** white card, serif `h3` category title + count pill; rows with a
  medal emoji/label, title, and an optional year pill (omit when no year).
- **Grade chip:** subject + a round score badge — indigo for 10, gold for 9.
- **Chip rows (personality / skills / interests):** white pills with soft shadow.
- **Focus chips (hero):** solid indigo pills, bold.

## Print / PDF Export
- Trigger: `window.print()` from the PDF button.
- `@media print`: hide `.no-print` (top bar/buttons); white background, black-ish ink;
  expand all sections; `break-inside: avoid` on cards, medal rows, timeline items;
  `@page { margin: 16mm }`. Prints the currently selected locale only (the
  `data-locale` rules already hide the other language).

## Decisions Log
| Date | Decision | Rationale |
| --- | --- | --- |
| 2026-06-03 | Initial design system (Variant A · Editorial Warm) | `/design-consultation` + research ([Webflow](https://webflow.com/blog/color-and-typography-pairings), [UXmatters](https://www.uxmatters.com/mt/archives/2011/10/effective-use-of-color-and-graphics-in-applications-for-children-part-i-toddlers-and-preschoolers.php)). Positioning chosen: "credible yet childlike". Gold tied to medals as brand thread. |
| 2026-06-03 | Fraunces + Be Vietnam Pro, self-hosted | Vietnamese support required (bilingual); offline build blocks `next/font/google`. |
