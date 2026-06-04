# Design System — Family Quest (`apps/family`)

> Family Quest **follows the same Editorial Warm system as the portfolio**.
> The canonical reference is [`../portfolio/DESIGN.md`](../portfolio/DESIGN.md) —
> read it first. This file only records the **family-app-specific** adaptations.
> Do not deviate from the shared tokens without explicit user approval.

## Shared foundation (from portfolio DESIGN.md)
- **Type:** Fraunces (display/headings) + Be Vietnam Pro (body/UI), self-hosted in
  `src/app/fonts/` and declared in `src/app/fonts.css`. Vietnamese diacritics required.
- **Color:** indigo `--color-brand #3730A3` (+ `--color-brand-dark #2E2A82`),
  gold `--color-accent #E8A317`, teal `#0D9488` (rare), cream paper `#FFFDF7`,
  ink `#1F2937`. These override the shared `@kidcenter/ui` tokens in `globals.css`.
- **Gold = achievement.** Tie gold to points/medals/rewards, not generic decoration.
- **Cards:** white, soft rounded (`@kidcenter/ui` `Card`, radius ~24–28), soft shadow.
- **Motion:** restrained; short transitions on hover/toggles.

## Family-specific adaptations
- **Mobile-first.** This app is used on phones (parents' and a shared kids' device),
  unlike the portfolio (desktop dossier). Layouts cap at `max-w-3xl` (parent) /
  `max-w-md` (kid mode) and stack on small screens.
- **Two surfaces:**
  - **Parent** — sticky top nav (`ParentShell`), content in cards. Admin/CMS tone.
  - **Kid mode** — large touch targets, bottom tab bar, big point numbers, emoji
    icons, medals (🥇🥈🥉) on the leaderboard. Playful but uses the same palette/type.
- **Points** render in brand indigo; **rewards/medals** lean on gold as the
  achievement thread.
- **No print/PDF, no bilingual `data-lang` toggle** (those are portfolio-only).

## Decisions Log
| Date | Decision | Rationale |
| --- | --- | --- |
| 2026-06-04 | Adopt portfolio's Editorial Warm for Family Quest | User chose monorepo design consistency over a separate kid theme. Fonts + tokens copied/overridden from portfolio. |
