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
