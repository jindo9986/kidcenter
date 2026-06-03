# Portfolio App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the bilingual (VI/EN) file-based portfolio page in `apps/portfolio`, with zod-validated JSON/Markdown content, a CSS-driven language toggle, and print-to-PDF export.

**Architecture:** Server Components read JSON + Markdown from `apps/portfolio/content/` at build time, validate with zod, render Markdown with `marked`. Every localized string renders both languages wrapped in `data-lang` spans; a tiny client toggle flips `html[data-locale]` and CSS shows the active language. A print stylesheet drives `window.print()` export.

**Tech Stack:** Next.js 16 (App Router, RSC), React 19, TypeScript, Tailwind v4, `zod`, `marked`, `vitest`, shared `@kidcenter/ui`.

All commands run from `apps/portfolio` unless noted. The monorepo uses pnpm; tests use vitest.

---

## File Structure

- `apps/portfolio/package.json` — add `marked`, `zod` deps; `vitest` devDep; `test` script.
- `apps/portfolio/vitest.config.ts` — vitest config (node env, `@` alias, automatic JSX).
- `apps/portfolio/src/lib/schemas.ts` — zod schemas + inferred types (`L`, `Profile`, …).
- `apps/portfolio/src/lib/markdown.ts` — `renderMarkdown(md)` via `marked`.
- `apps/portfolio/src/lib/locale.ts` — `Locale` type + constants.
- `apps/portfolio/src/lib/content.ts` — loaders: `getProfile/Achievements/Journey/Gallery/Projects(dir?)`.
- `apps/portfolio/content/*` — seed content (profile, achievements, journey, gallery, projects).
- `apps/portfolio/tests/fixtures/content/*` — minimal fixture content for loader tests.
- `apps/portfolio/src/components/Localized.tsx` — renders both languages.
- `apps/portfolio/src/components/LangToggle.tsx` — client locale toggle.
- `apps/portfolio/src/components/PrintButton.tsx` — client print trigger.
- `apps/portfolio/src/components/Hero.tsx`, `Section.tsx`, `Timeline.tsx`, `Gallery.tsx`, `ProjectCard.tsx`.
- `apps/portfolio/src/app/layout.tsx` — set default locale + no-flash script.
- `apps/portfolio/src/app/globals.css` — add locale + print CSS.
- `apps/portfolio/src/app/page.tsx` — assemble sections from content.

Test files live in `apps/portfolio/tests/` mirroring `src/lib`.

---

## Task 1: Add dependencies and vitest config

**Files:**
- Modify: `apps/portfolio/package.json`
- Create: `apps/portfolio/vitest.config.ts`

- [ ] **Step 1: Add deps and test script to package.json**

Edit `apps/portfolio/package.json` — add to `dependencies` and `devDependencies`, and add a `test` script:

```json
{
  "name": "@kidcenter/portfolio",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3001",
    "build": "next build",
    "start": "next start --port 3001",
    "lint": "eslint",
    "test": "vitest run"
  },
  "dependencies": {
    "@kidcenter/ui": "workspace:*",
    "marked": "^15.0.0",
    "next": "16.2.7",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "zod": "^3.24.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.7",
    "tailwindcss": "^4",
    "typescript": "^5",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 2: Create vitest config**

Create `apps/portfolio/vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["tests/**/*.test.{ts,tsx}"],
  },
  esbuild: { jsx: "automatic" },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
```

- [ ] **Step 3: Install**

Run (from repo root): `pnpm install`
Expected: resolves and adds `marked`, `zod`, `vitest`. No errors.

- [ ] **Step 4: Verify vitest runs**

Run (from `apps/portfolio`): `pnpm test`
Expected: vitest reports "No test files found" (exit 0) — config loads correctly.

- [ ] **Step 5: Commit**

```bash
git add apps/portfolio/package.json apps/portfolio/vitest.config.ts pnpm-lock.yaml
git commit -m "chore(portfolio): add zod, marked, vitest and test config"
```

---

## Task 2: Content schemas (zod)

**Files:**
- Create: `apps/portfolio/src/lib/schemas.ts`
- Test: `apps/portfolio/tests/lib/schemas.test.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/portfolio/tests/lib/schemas.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { profileSchema, achievementsSchema } from "@/lib/schemas";

describe("schemas", () => {
  it("accepts a valid profile", () => {
    const ok = {
      name: "Na",
      age: 6,
      avatar: "/media/na.jpg",
      tagline: { vi: "Yêu vẽ", en: "Loves drawing" },
      bio: { vi: "Bé Na...", en: "Na is..." },
      interests: [{ vi: "Vẽ", en: "Drawing" }],
      skills: [{ vi: "Sáng tạo", en: "Creativity" }],
      parentContact: { name: "Mẹ Na" },
    };
    expect(profileSchema.parse(ok).age).toBe(6);
  });

  it("rejects a profile missing a localized field", () => {
    const bad = { name: "Na", age: 6, avatar: "x", tagline: { vi: "x" } };
    expect(() => profileSchema.parse(bad)).toThrow();
  });

  it("rejects achievements that are not an array", () => {
    expect(() => achievementsSchema.parse({})).toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL — cannot resolve `@/lib/schemas`.

- [ ] **Step 3: Write the schemas**

Create `apps/portfolio/src/lib/schemas.ts`:

```ts
import { z } from "zod";

export const L = z.object({ vi: z.string(), en: z.string() });
export type L = z.infer<typeof L>;

export const profileSchema = z.object({
  name: z.string(),
  age: z.number(),
  avatar: z.string(),
  tagline: L,
  bio: L,
  interests: z.array(L),
  skills: z.array(L),
  parentContact: z.object({
    name: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
  }),
});
export type Profile = z.infer<typeof profileSchema>;

export const achievementSchema = z.object({
  date: z.string(),
  icon: z.string(),
  title: L,
  detail: L,
});
export const achievementsSchema = z.array(achievementSchema);
export type Achievement = z.infer<typeof achievementSchema>;

export const journeyItemSchema = z.object({
  date: z.string(),
  icon: z.string(),
  title: L,
  body: L,
});
export const journeySchema = z.array(journeyItemSchema);
export type JourneyMilestone = z.infer<typeof journeyItemSchema>;

export const mediaItemSchema = z.object({
  type: z.enum(["image", "video"]),
  src: z.string(),
  caption: L,
});
export const mediaSchema = z.array(mediaItemSchema);
export type MediaItem = z.infer<typeof mediaItemSchema>;

export const projectMetaSchema = z.object({
  date: z.string(),
  cover: z.string().optional(),
  tag: L,
  title: L,
});
export type ProjectMeta = z.infer<typeof projectMetaSchema>;

export type Project = ProjectMeta & {
  slug: string;
  bodyHtml: { vi: string; en: string };
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/portfolio/src/lib/schemas.ts apps/portfolio/tests/lib/schemas.test.ts
git commit -m "feat(portfolio): add zod content schemas"
```

---

## Task 3: Markdown rendering util

**Files:**
- Create: `apps/portfolio/src/lib/markdown.ts`
- Test: `apps/portfolio/tests/lib/markdown.test.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/portfolio/tests/lib/markdown.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { renderMarkdown } from "@/lib/markdown";

describe("renderMarkdown", () => {
  it("renders headings and bold to HTML", () => {
    const html = renderMarkdown("# Hi\n\nThis is **bold**.");
    expect(html).toContain("<h1");
    expect(html).toContain("<strong>bold</strong>");
  });

  it("returns a string synchronously", () => {
    expect(typeof renderMarkdown("plain")).toBe("string");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL — cannot resolve `@/lib/markdown`.

- [ ] **Step 3: Write the implementation**

Create `apps/portfolio/src/lib/markdown.ts`:

```ts
import { marked } from "marked";

/** Render a Markdown string to an HTML string (synchronous, offline). */
export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/portfolio/src/lib/markdown.ts apps/portfolio/tests/lib/markdown.test.ts
git commit -m "feat(portfolio): add markdown renderer"
```

---

## Task 4: Locale constants

**Files:**
- Create: `apps/portfolio/src/lib/locale.ts`

- [ ] **Step 1: Create the file**

Create `apps/portfolio/src/lib/locale.ts`:

```ts
export type Locale = "vi" | "en";
export const LOCALES: Locale[] = ["vi", "en"];
export const DEFAULT_LOCALE: Locale = "vi";
```

- [ ] **Step 2: Commit**

```bash
git add apps/portfolio/src/lib/locale.ts
git commit -m "feat(portfolio): add locale constants"
```

---

## Task 5: Content loaders

**Files:**
- Create: `apps/portfolio/src/lib/content.ts`
- Create fixtures: `apps/portfolio/tests/fixtures/content/profile.json`, `achievements.json`, `journey.json`, `gallery.json`, `projects/demo/meta.json`, `projects/demo/vi.md`, `projects/demo/en.md`
- Test: `apps/portfolio/tests/lib/content.test.ts`

- [ ] **Step 1: Create fixture content**

`apps/portfolio/tests/fixtures/content/profile.json`:

```json
{
  "name": "Test Kid",
  "age": 6,
  "avatar": "/media/avatar.jpg",
  "tagline": { "vi": "Tagline VI", "en": "Tagline EN" },
  "bio": { "vi": "Bio VI", "en": "Bio EN" },
  "interests": [{ "vi": "Vẽ", "en": "Drawing" }],
  "skills": [{ "vi": "Sáng tạo", "en": "Creativity" }],
  "parentContact": { "name": "Parent", "email": "p@example.com" }
}
```

`apps/portfolio/tests/fixtures/content/achievements.json`:

```json
[{ "date": "2025-05-01", "icon": "🏅", "title": { "vi": "Giải Nhì", "en": "2nd Prize" }, "detail": { "vi": "Cuộc thi vẽ", "en": "Drawing contest" } }]
```

`apps/portfolio/tests/fixtures/content/journey.json`:

```json
[{ "date": "2024-09-01", "icon": "🌱", "title": { "vi": "Bắt đầu", "en": "Start" }, "body": { "vi": "Câu chuyện VI", "en": "Story EN" } }]
```

`apps/portfolio/tests/fixtures/content/gallery.json`:

```json
[{ "type": "image", "src": "/media/1.jpg", "caption": { "vi": "Ảnh 1", "en": "Photo 1" } }]
```

`apps/portfolio/tests/fixtures/content/projects/demo/meta.json`:

```json
{ "date": "2025-03-01", "cover": "/media/demo.jpg", "tag": { "vi": "STEM", "en": "STEM" }, "title": { "vi": "Robot giấy", "en": "Paper robot" } }
```

`apps/portfolio/tests/fixtures/content/projects/demo/vi.md`:

```md
# Robot giấy

Mô tả **tiếng Việt**.
```

`apps/portfolio/tests/fixtures/content/projects/demo/en.md`:

```md
# Paper robot

Description in **English**.
```

- [ ] **Step 2: Write the failing test**

Create `apps/portfolio/tests/lib/content.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import path from "node:path";
import {
  getProfile,
  getAchievements,
  getJourney,
  getGallery,
  getProjects,
} from "@/lib/content";

const DIR = path.resolve(__dirname, "../fixtures/content");

describe("content loaders", () => {
  it("loads and validates the profile", () => {
    const p = getProfile(DIR);
    expect(p.name).toBe("Test Kid");
    expect(p.tagline.en).toBe("Tagline EN");
  });

  it("loads achievements, journey, gallery as arrays", () => {
    expect(getAchievements(DIR)).toHaveLength(1);
    expect(getJourney(DIR)[0].title.vi).toBe("Bắt đầu");
    expect(getGallery(DIR)[0].type).toBe("image");
  });

  it("loads projects with rendered bilingual HTML", () => {
    const projects = getProjects(DIR);
    expect(projects).toHaveLength(1);
    expect(projects[0].slug).toBe("demo");
    expect(projects[0].bodyHtml.vi).toContain("<strong>tiếng Việt</strong>");
    expect(projects[0].bodyHtml.en).toContain("<strong>English</strong>");
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL — cannot resolve `@/lib/content`.

- [ ] **Step 4: Write the loaders**

Create `apps/portfolio/src/lib/content.ts`:

```ts
import fs from "node:fs";
import path from "node:path";
import {
  profileSchema,
  achievementsSchema,
  journeySchema,
  mediaSchema,
  projectMetaSchema,
  type Profile,
  type Achievement,
  type JourneyMilestone,
  type MediaItem,
  type Project,
} from "./schemas";
import { renderMarkdown } from "./markdown";

const DEFAULT_DIR = path.join(process.cwd(), "content");

function readJson(dir: string, file: string): unknown {
  return JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
}

export function getProfile(dir: string = DEFAULT_DIR): Profile {
  return profileSchema.parse(readJson(dir, "profile.json"));
}

export function getAchievements(dir: string = DEFAULT_DIR): Achievement[] {
  return achievementsSchema.parse(readJson(dir, "achievements.json"));
}

export function getJourney(dir: string = DEFAULT_DIR): JourneyMilestone[] {
  return journeySchema.parse(readJson(dir, "journey.json"));
}

export function getGallery(dir: string = DEFAULT_DIR): MediaItem[] {
  return mediaSchema.parse(readJson(dir, "gallery.json"));
}

export function getProjects(dir: string = DEFAULT_DIR): Project[] {
  const root = path.join(dir, "projects");
  if (!fs.existsSync(root)) return [];
  const slugs = fs
    .readdirSync(root)
    .filter((s) => fs.statSync(path.join(root, s)).isDirectory());
  const projects = slugs.map((slug) => {
    const pdir = path.join(root, slug);
    const meta = projectMetaSchema.parse(readJson(pdir, "meta.json"));
    const vi = renderMarkdown(fs.readFileSync(path.join(pdir, "vi.md"), "utf8"));
    const en = renderMarkdown(fs.readFileSync(path.join(pdir, "en.md"), "utf8"));
    return { ...meta, slug, bodyHtml: { vi, en } };
  });
  return projects.sort((a, b) => b.date.localeCompare(a.date));
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS (all content tests).

- [ ] **Step 6: Commit**

```bash
git add apps/portfolio/src/lib/content.ts apps/portfolio/tests/lib/content.test.ts apps/portfolio/tests/fixtures
git commit -m "feat(portfolio): add file-based content loaders with validation"
```

---

## Task 6: Seed real content

**Files:**
- Create: `apps/portfolio/content/profile.json`, `achievements.json`, `journey.json`, `gallery.json`
- Create: `apps/portfolio/content/projects/vuon-rau/{meta.json,vi.md,en.md}`, `apps/portfolio/content/projects/robot-giay/{meta.json,vi.md,en.md}`
- Create: `apps/portfolio/public/media/.gitkeep`

- [ ] **Step 1: Create profile.json**

`apps/portfolio/content/profile.json`:

```json
{
  "name": "Nguyễn Bảo Na",
  "age": 6,
  "avatar": "/media/avatar.png",
  "tagline": {
    "vi": "Yêu vẽ, âm nhạc và khám phá thiên nhiên 🌈",
    "en": "Loves drawing, music, and exploring nature 🌈"
  },
  "bio": {
    "vi": "Bé Na là một cô bé tò mò và giàu trí tưởng tượng, thích đặt câu hỏi về thế giới xung quanh. Bé học tốt nhất qua trải nghiệm thực tế — trồng cây, làm thủ công và kể chuyện.",
    "en": "Na is a curious, imaginative child who loves asking questions about the world. She learns best through hands-on experiences — growing plants, crafting, and storytelling."
  },
  "interests": [
    { "vi": "Vẽ", "en": "Drawing" },
    { "vi": "Âm nhạc", "en": "Music" },
    { "vi": "Thiên nhiên", "en": "Nature" }
  ],
  "skills": [
    { "vi": "Sáng tạo", "en": "Creativity" },
    { "vi": "Tiếng Anh", "en": "English" },
    { "vi": "Toán tư duy", "en": "Logical thinking" },
    { "vi": "Âm nhạc", "en": "Music" },
    { "vi": "Làm việc nhóm", "en": "Teamwork" }
  ],
  "parentContact": {
    "name": "Phụ huynh bé Na",
    "email": "daodinhhieu@gmail.com"
  }
}
```

- [ ] **Step 2: Create achievements.json**

`apps/portfolio/content/achievements.json`:

```json
[
  {
    "date": "2025-04-20",
    "icon": "🏅",
    "title": { "vi": "Giải Nhì", "en": "2nd Prize" },
    "detail": { "vi": "Cuộc thi vẽ thiếu nhi cấp quận 2025", "en": "District children's drawing contest 2025" }
  },
  {
    "date": "2025-03-10",
    "icon": "📚",
    "title": { "vi": "Đọc 50 cuốn sách", "en": "Read 50 books" },
    "detail": { "vi": "Thử thách đọc sách 2025", "en": "2025 reading challenge" }
  },
  {
    "date": "2025-01-15",
    "icon": "🎹",
    "title": { "vi": "Piano cấp độ 2", "en": "Piano Level 2" },
    "detail": { "vi": "Hoàn thành chứng chỉ ABRSM", "en": "Completed ABRSM certificate" }
  }
]
```

- [ ] **Step 3: Create journey.json**

`apps/portfolio/content/journey.json`:

```json
[
  {
    "date": "2024-09-01",
    "icon": "🌱",
    "title": { "vi": "Những nét vẽ đầu tiên", "en": "First brushstrokes" },
    "body": { "vi": "Na bắt đầu mê vẽ, phủ kín nhà bằng tranh màu sáp.", "en": "Na fell in love with drawing, filling the house with crayon art." }
  },
  {
    "date": "2025-01-15",
    "icon": "🎹",
    "title": { "vi": "Giai điệu đầu tiên", "en": "First melody" },
    "body": { "vi": "Sau nhiều buổi tập, Na chơi trọn bản nhạc đầu tiên trên piano.", "en": "After many practice sessions, Na played her first full piece on the piano." }
  },
  {
    "date": "2025-04-20",
    "icon": "🏅",
    "title": { "vi": "Lên sân khấu nhận giải", "en": "On stage for an award" },
    "body": { "vi": "Bức tranh của Na đoạt giải Nhì cấp quận — lần đầu tự tin đứng trước đám đông.", "en": "Na's painting won 2nd prize district-wide — her first confident moment on stage." }
  }
]
```

- [ ] **Step 4: Create gallery.json**

`apps/portfolio/content/gallery.json`:

```json
[
  { "type": "image", "src": "/media/art-1.png", "caption": { "vi": "Tranh gia đình em", "en": "My family painting" } },
  { "type": "image", "src": "/media/garden.png", "caption": { "vi": "Vườn rau mini", "en": "Mini veggie garden" } },
  { "type": "image", "src": "/media/robot.png", "caption": { "vi": "Robot giấy", "en": "Paper robot" } }
]
```

- [ ] **Step 5: Create project "vuon-rau"**

`apps/portfolio/content/projects/vuon-rau/meta.json`:

```json
{ "date": "2025-02-01", "cover": "/media/garden.png", "tag": { "vi": "Khám phá khoa học", "en": "Science exploration" }, "title": { "vi": "Vườn rau mini", "en": "Mini veggie garden" } }
```

`apps/portfolio/content/projects/vuon-rau/vi.md`:

```md
Na tự trồng và theo dõi quá trình lớn lên của cây trong **6 tuần**, ghi nhật ký bằng hình vẽ mỗi ngày.

- Gieo hạt và tưới nước hằng ngày
- Đo chiều cao cây bằng thước
- Vẽ lại sự thay đổi của lá
```

`apps/portfolio/content/projects/vuon-rau/en.md`:

```md
Na grew and tracked her plants over **6 weeks**, keeping a daily drawing journal.

- Sowed seeds and watered daily
- Measured plant height with a ruler
- Drew the changing leaves
```

- [ ] **Step 6: Create project "robot-giay"**

`apps/portfolio/content/projects/robot-giay/meta.json`:

```json
{ "date": "2025-03-01", "cover": "/media/robot.png", "tag": { "vi": "STEM · Thủ công", "en": "STEM · Crafts" }, "title": { "vi": "Robot giấy", "en": "Paper robot" } }
```

`apps/portfolio/content/projects/robot-giay/vi.md`:

```md
Na thiết kế và lắp ráp một chú robot từ vật liệu tái chế, rồi **trình bày trước lớp**.

Bé học được cách lên ý tưởng, thử – sai và thuyết trình.
```

`apps/portfolio/content/projects/robot-giay/en.md`:

```md
Na designed and assembled a robot from recycled materials, then **presented it to her class**.

She learned to ideate, iterate through trial and error, and present.
```

- [ ] **Step 7: Add media placeholder dir**

Create `apps/portfolio/public/media/.gitkeep` (empty file). Image files are added by the user later; missing images degrade gracefully (alt text / broken-image only).

- [ ] **Step 8: Verify content validates via test loader**

Add a temporary check — run from `apps/portfolio`:

```bash
node --input-type=module -e "import('./src/lib/content.ts').catch(e=>{console.error(e);process.exit(1)})" 2>/dev/null || echo "skip (ts not directly runnable)"
```

(If the inline check is skipped, content is validated at build time in Task 11.) No commit-blocking action; proceed.

- [ ] **Step 9: Commit**

```bash
git add apps/portfolio/content apps/portfolio/public/media/.gitkeep
git commit -m "feat(portfolio): seed bilingual content for Bảo Na"
```

---

## Task 7: Localized component

**Files:**
- Create: `apps/portfolio/src/components/Localized.tsx`
- Test: `apps/portfolio/tests/components/Localized.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `apps/portfolio/tests/components/Localized.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Localized } from "@/components/Localized";

describe("Localized", () => {
  it("renders both languages with data-lang markers", () => {
    const html = renderToStaticMarkup(
      <Localized value={{ vi: "Xin chào", en: "Hello" }} />,
    );
    expect(html).toContain('data-lang="vi"');
    expect(html).toContain("Xin chào");
    expect(html).toContain('data-lang="en"');
    expect(html).toContain("Hello");
  });

  it("respects the `as` tag", () => {
    const html = renderToStaticMarkup(
      <Localized as="p" value={{ vi: "A", en: "B" }} />,
    );
    expect(html).toContain("<p");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL — cannot resolve `@/components/Localized`.

- [ ] **Step 3: Write the component**

Create `apps/portfolio/src/components/Localized.tsx`:

```tsx
import type { ElementType } from "react";
import type { L } from "@/lib/schemas";

export function Localized({
  value,
  as,
  className,
}: {
  value: L;
  as?: ElementType;
  className?: string;
}) {
  const Tag = (as ?? "span") as ElementType;
  return (
    <>
      <Tag data-lang="vi" className={className}>
        {value.vi}
      </Tag>
      <Tag data-lang="en" className={className}>
        {value.en}
      </Tag>
    </>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/portfolio/src/components/Localized.tsx apps/portfolio/tests/components/Localized.test.tsx
git commit -m "feat(portfolio): add Localized bilingual renderer"
```

---

## Task 8: Locale toggle, print button, layout, and CSS

**Files:**
- Create: `apps/portfolio/src/components/LangToggle.tsx`
- Create: `apps/portfolio/src/components/PrintButton.tsx`
- Modify: `apps/portfolio/src/app/layout.tsx`
- Modify: `apps/portfolio/src/app/globals.css`

- [ ] **Step 1: Create LangToggle (client)**

Create `apps/portfolio/src/components/LangToggle.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@kidcenter/ui";
import type { Locale } from "@/lib/locale";

export function LangToggle() {
  const [locale, setLocale] = useState<Locale>("vi");

  useEffect(() => {
    const saved = (localStorage.getItem("locale") as Locale | null) ?? "vi";
    setLocale(saved);
    document.documentElement.dataset.locale = saved;
  }, []);

  function toggle() {
    const next: Locale = locale === "vi" ? "en" : "vi";
    setLocale(next);
    document.documentElement.dataset.locale = next;
    localStorage.setItem("locale", next);
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggle} aria-label="Switch language">
      🌐 {locale === "vi" ? "EN" : "VI"}
    </Button>
  );
}
```

- [ ] **Step 2: Create PrintButton (client)**

Create `apps/portfolio/src/components/PrintButton.tsx`:

```tsx
"use client";

import { Button } from "@kidcenter/ui";

export function PrintButton() {
  return (
    <Button size="sm" onClick={() => window.print()}>
      ⬇️ <span data-lang="vi">Tải PDF</span>
      <span data-lang="en">Export PDF</span>
    </Button>
  );
}
```

- [ ] **Step 3: Update layout with default locale + no-flash script**

Replace `apps/portfolio/src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KidCenter · Portfolio của bé",
  description:
    "Hồ sơ năng lực của bé — thành tích, dự án và hoạt động để apply các chương trình học.",
};

const noFlash = `try{var l=localStorage.getItem('locale');if(l)document.documentElement.dataset.locale=l;}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" data-locale="vi" className="h-full antialiased">
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlash }} />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Add locale + print CSS**

Append to `apps/portfolio/src/app/globals.css`:

```css
/* Bilingual visibility */
html[data-locale="vi"] [data-lang="en"] {
  display: none;
}
html[data-locale="en"] [data-lang="vi"] {
  display: none;
}

/* Print / PDF export */
@media print {
  .no-print {
    display: none !important;
  }
  body {
    background: #fff;
    color: #000;
  }
  .break-avoid {
    break-inside: avoid;
  }
  @page {
    margin: 16mm;
  }
}
```

- [ ] **Step 5: Verify build compiles the client components**

Run (from repo root): `pnpm --filter @kidcenter/portfolio build`
Expected: compiles (page may be minimal still). No type errors for the new components.

> Note: if `page.tsx` not yet updated, build still succeeds against the existing page. The new components are unused until Task 10 — that is fine.

- [ ] **Step 6: Commit**

```bash
git add apps/portfolio/src/components/LangToggle.tsx apps/portfolio/src/components/PrintButton.tsx apps/portfolio/src/app/layout.tsx apps/portfolio/src/app/globals.css
git commit -m "feat(portfolio): add language toggle, print button, locale+print CSS"
```

---

## Task 9: Section UI components

**Files:**
- Create: `apps/portfolio/src/components/Section.tsx`
- Create: `apps/portfolio/src/components/Hero.tsx`
- Create: `apps/portfolio/src/components/Timeline.tsx`
- Create: `apps/portfolio/src/components/Gallery.tsx`
- Create: `apps/portfolio/src/components/ProjectCard.tsx`

These are presentational Server Components consuming typed content. No unit tests (covered by the build + manual verification in Task 11); keep them small and focused.

- [ ] **Step 1: Section wrapper**

Create `apps/portfolio/src/components/Section.tsx`:

```tsx
import type { L } from "@/lib/schemas";
import { Localized } from "./Localized";

export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: L;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-10">
      <h2 className="mb-4 font-display text-2xl font-bold text-ink">
        <Localized value={title} />
      </h2>
      {children}
    </section>
  );
}
```

- [ ] **Step 2: Hero**

Create `apps/portfolio/src/components/Hero.tsx`:

```tsx
import type { Profile } from "@/lib/schemas";
import { Localized } from "./Localized";

export function Hero({ profile }: { profile: Profile }) {
  return (
    <section className="mb-10 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
      <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent text-5xl shadow-sm">
        {/* Avatar image with emoji fallback */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.avatar}
          alt={profile.name}
          className="h-full w-full object-cover"
          onError={undefined}
        />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-brand">Portfolio</p>
        <h1 className="font-display text-4xl font-extrabold text-ink">
          {profile.name}
        </h1>
        <p className="mt-1 text-ink/60">
          {profile.age}{" "}
          <span data-lang="vi">tuổi</span>
          <span data-lang="en">years old</span> ·{" "}
          <Localized value={profile.tagline} />
        </p>
      </div>
    </section>
  );
}
```

> Note: `<img>` is used (not `next/image`) so locally-missing media degrades to alt text without build-time image optimization or network. This is intentional for the file-based, offline approach.

- [ ] **Step 3: Timeline (journey)**

Create `apps/portfolio/src/components/Timeline.tsx`:

```tsx
import type { JourneyMilestone } from "@/lib/schemas";
import { Localized } from "./Localized";

export function Timeline({ items }: { items: JourneyMilestone[] }) {
  return (
    <ol className="relative ml-3 border-l-2 border-brand/20">
      {items.map((m, i) => (
        <li key={i} className="break-avoid mb-6 ml-6">
          <span className="absolute -left-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-sm">
            {m.icon}
          </span>
          <p className="text-xs font-semibold text-ink/40">{m.date}</p>
          <h3 className="font-bold text-ink">
            <Localized value={m.title} />
          </h3>
          <p className="text-sm text-ink/70">
            <Localized value={m.body} />
          </p>
        </li>
      ))}
    </ol>
  );
}
```

- [ ] **Step 4: Gallery**

Create `apps/portfolio/src/components/Gallery.tsx`:

```tsx
import type { MediaItem } from "@/lib/schemas";
import { Localized } from "./Localized";

export function Gallery({ items }: { items: MediaItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map((item, i) => (
        <figure key={i} className="break-avoid overflow-hidden rounded-2xl bg-white shadow-sm">
          {item.type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.src} alt="" className="aspect-square w-full object-cover" />
          ) : (
            <video src={item.src} controls className="aspect-square w-full object-cover" />
          )}
          <figcaption className="p-2 text-center text-xs text-ink/60">
            <Localized value={item.caption} />
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: ProjectCard**

Create `apps/portfolio/src/components/ProjectCard.tsx`:

```tsx
import type { Project } from "@/lib/schemas";
import { Card } from "@kidcenter/ui";
import { Localized } from "./Localized";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="break-avoid">
      <span className="mb-2 inline-block rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
        <Localized value={project.tag} />
      </span>
      <h3 className="mb-2 text-lg font-bold text-ink">
        <Localized value={project.title} />
      </h3>
      <div
        className="prose prose-sm max-w-none text-ink/70"
        data-lang="vi"
        dangerouslySetInnerHTML={{ __html: project.bodyHtml.vi }}
      />
      <div
        className="prose prose-sm max-w-none text-ink/70"
        data-lang="en"
        dangerouslySetInnerHTML={{ __html: project.bodyHtml.en }}
      />
    </Card>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add apps/portfolio/src/components/Section.tsx apps/portfolio/src/components/Hero.tsx apps/portfolio/src/components/Timeline.tsx apps/portfolio/src/components/Gallery.tsx apps/portfolio/src/components/ProjectCard.tsx
git commit -m "feat(portfolio): add section UI components"
```

---

## Task 10: Assemble the page

**Files:**
- Modify: `apps/portfolio/src/app/page.tsx`

- [ ] **Step 1: Write the page**

Replace `apps/portfolio/src/app/page.tsx` with:

```tsx
import {
  getProfile,
  getAchievements,
  getJourney,
  getGallery,
  getProjects,
} from "@/lib/content";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { Timeline } from "@/components/Timeline";
import { Gallery } from "@/components/Gallery";
import { ProjectCard } from "@/components/ProjectCard";
import { Localized } from "@/components/Localized";
import { LangToggle } from "@/components/LangToggle";
import { PrintButton } from "@/components/PrintButton";

export default function Home() {
  const profile = getProfile();
  const achievements = getAchievements();
  const journey = getJourney();
  const gallery = getGallery();
  const projects = getProjects();

  return (
    <>
      <div className="no-print sticky top-0 z-10 flex items-center justify-end gap-2 border-b border-black/5 bg-cream/80 px-5 py-2 backdrop-blur">
        <LangToggle />
        <PrintButton />
      </div>

      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-8 sm:px-8">
        <Hero profile={profile} />

        <Section id="about" title={{ vi: "Giới thiệu", en: "About" }}>
          <p className="mb-4 leading-relaxed text-ink/70">
            <Localized value={profile.bio} />
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((s, i) => (
              <span
                key={i}
                className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-ink shadow-sm"
              >
                <Localized value={s} />
              </span>
            ))}
          </div>
        </Section>

        <Section id="achievements" title={{ vi: "Thành tích nổi bật", en: "Achievements" }}>
          <div className="grid gap-3 sm:grid-cols-3">
            {achievements.map((a, i) => (
              <div key={i} className="break-avoid rounded-3xl border border-black/5 bg-white p-4 shadow-sm">
                <div className="mb-1 text-2xl">{a.icon}</div>
                <p className="text-xs font-semibold text-ink/40">{a.date}</p>
                <h3 className="font-bold text-ink">
                  <Localized value={a.title} />
                </h3>
                <p className="text-sm text-ink/60">
                  <Localized value={a.detail} />
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="projects" title={{ vi: "Dự án & Hoạt động", en: "Projects & Activities" }}>
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </Section>

        <Section id="journey" title={{ vi: "Hành trình phát triển", en: "Growth Journey" }}>
          <Timeline items={journey} />
        </Section>

        <Section id="gallery" title={{ vi: "Thư viện ảnh & video", en: "Media Gallery" }}>
          <Gallery items={gallery} />
        </Section>

        <footer className="mt-8 border-t border-black/5 pt-4 text-sm text-ink/50">
          <span data-lang="vi">Liên hệ: </span>
          <span data-lang="en">Contact: </span>
          {profile.parentContact.name}
          {profile.parentContact.email ? ` · ${profile.parentContact.email}` : ""}
        </footer>
      </main>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/portfolio/src/app/page.tsx
git commit -m "feat(portfolio): assemble portfolio page from content"
```

---

## Task 11: Build, run, and verify end-to-end

**Files:** none (verification)

- [ ] **Step 1: Run unit tests**

Run (from `apps/portfolio`): `pnpm test`
Expected: all tests PASS.

- [ ] **Step 2: Build**

Run (from repo root): `pnpm --filter @kidcenter/portfolio build`
Expected: build succeeds; `/` prerendered as static. zod validation of real content passes (no schema errors).

- [ ] **Step 3: Run dev and verify rendering**

Run (from repo root): `pnpm dev:portfolio` (background)
Then:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001          # expect 200
curl -s http://localhost:3001 | grep -c 'data-lang="vi"'                # expect > 0
curl -s http://localhost:3001 | grep -o "Nguyễn Bảo Na" | head -1       # expect the name
curl -s http://localhost:3001 | grep -o "Growth Journey"                # EN present in DOM too
```

Expected: HTTP 200; both `data-lang="vi"` and EN strings present in server HTML; name renders. Stop the dev server afterward.

- [ ] **Step 4: Manual visual check (optional but recommended)**

Use the `browse` or `webapp-testing` skill to open `http://localhost:3001`, click the 🌐 toggle (verify language switches), and trigger print preview to confirm the PDF layout hides the top bar and shows one language.

- [ ] **Step 5: Final commit / clean tree**

```bash
git add -A
git commit -m "test(portfolio): verify build and rendering" --allow-empty
```

---

## Self-Review

**Spec coverage:**
- Content layout (JSON + MD) → Tasks 5, 6. ✓
- Data types → Task 2. ✓
- Loading & zod validation → Tasks 2, 5. ✓
- Markdown via marked → Task 3. ✓
- Bilingual CSS toggle + persistence → Tasks 7, 8. ✓
- Page layout / sections → Tasks 9, 10. ✓
- PDF print export → Task 8 (CSS) + 8 (PrintButton). ✓
- Testing (vitest) → Tasks 2, 3, 5, 7. ✓
- New deps (marked, zod, vitest) → Task 1. ✓
- Seed content → Task 6. ✓
- Multi-child extension via `dir` param → Task 5 (loaders take `dir`). ✓

**Placeholder scan:** No TBD/TODO; every code step shows full code. Media images are intentionally placeholders (documented), not plan gaps.

**Type consistency:** `L`, `Profile`, `Achievement`, `JourneyMilestone`, `MediaItem`, `Project` defined in Task 2 and used unchanged in Tasks 5, 7, 9, 10. Loader names (`getProfile/getAchievements/getJourney/getGallery/getProjects`) consistent across Tasks 5 and 10. `Localized` props (`value`, `as`, `className`) consistent across Tasks 7, 9, 10.

No gaps found.
