import { describe, it, expect } from "vitest";
import path from "node:path";
import {
  getProfile,
  getAchievements,
  getAcademic,
  getCharacter,
  getTeacherComments,
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

  it("loads academic records as an array of year report cards", () => {
    const ac = getAcademic(DIR);
    expect(ac).toHaveLength(2);
    expect(ac[0].grade.vi).toBe("Lớp 2");
    expect(ac[0].subjects[0].score).toBe("10");
    expect(ac[0].subjects[1].level).toBe("T");
    expect(ac[0].honors[0].label.vi).toBe("Học sinh Xuất sắc");
    expect(ac[0].honors[0].note?.en).toBe("Rare");
    expect(ac[1].honors).toEqual([]); // default when omitted
  });

  it("loads the Cambridge character report", () => {
    const c = getCharacter(DIR);
    expect(c.level.code).toBe("C");
    expect(c.attributes[0].keyword.en).toBe("Confident");
  });

  it("loads teacher comments per year", () => {
    const tc = getTeacherComments(DIR);
    expect(tc).toHaveLength(1);
    expect(tc[0].comments[0].teacher).toBe("Eva");
    expect(tc[0].general?.text).toContain("Motivated");
    expect(tc[0].goals).toBe("Read daily.");
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
