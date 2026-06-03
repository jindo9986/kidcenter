import { describe, it, expect } from "vitest";
import path from "node:path";
import {
  getProfile,
  getAchievements,
  getAcademic,
  getJourney,
  getGallery,
  getProjects,
} from "@/lib/content";

const DIR = path.resolve(__dirname, "../fixtures/content");

describe("content loaders", () => {
  it("loads and validates the profile", () => {
    const p = getProfile(DIR);
    expect(p.name).toBe("Test Kid");
    expect(p.school.en).toBe("Test School");
    expect(p.birthDate).toBe("2016-02-23");
  });

  it("loads achievements with category + medal default", () => {
    const a = getAchievements(DIR);
    expect(a).toHaveLength(3);
    expect(a[2].category).toBe("local");
    expect(a[2].medal).toBe("none");
  });

  it("loads academic record", () => {
    const ac = getAcademic(DIR);
    expect(ac.year).toBe("2025-2026");
    expect(ac.grades).toHaveLength(2);
    expect(ac.honors[0].vi).toBe("Học sinh Xuất sắc");
  });

  it("loads journey and gallery as arrays", () => {
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
