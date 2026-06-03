import { describe, it, expect } from "vitest";
import { profileSchema, achievementsSchema, academicSchema } from "@/lib/schemas";

const validProfile = {
  name: "Tin",
  nickname: "Tin",
  birthDate: "2016-02-23",
  avatar: "/media/tin.jpg",
  school: { vi: "Trường", en: "School" },
  tagline: { vi: "Yêu khoa học", en: "Loves science" },
  bio: { vi: "Tin...", en: "Tin is..." },
  focus: [{ vi: "Khoa học", en: "Science" }],
  personality: [{ vi: "Độc lập", en: "Independent" }],
  interests: [{ vi: "Vẽ", en: "Drawing" }],
  skills: [{ vi: "Sáng tạo", en: "Creativity" }],
  parentContact: { name: "Bố Tin" },
};

describe("schemas", () => {
  it("accepts a valid profile", () => {
    expect(profileSchema.parse(validProfile).birthDate).toBe("2016-02-23");
  });

  it("rejects a profile missing the school field", () => {
    const { school: _omit, ...bad } = validProfile;
    void _omit;
    expect(() => profileSchema.parse(bad)).toThrow();
  });

  it("defaults achievement medal to 'none' when omitted", () => {
    const parsed = achievementsSchema.parse([
      { category: "local", title: { vi: "x", en: "x" } },
    ]);
    expect(parsed[0].medal).toBe("none");
  });

  it("rejects an unknown achievement category", () => {
    expect(() =>
      achievementsSchema.parse([
        { category: "galactic", title: { vi: "x", en: "x" } },
      ]),
    ).toThrow();
  });

  it("validates academic year records (array) with score or level", () => {
    const a = academicSchema.parse([
      {
        grade: { vi: "Lớp 1", en: "Grade 1" },
        subjects: [
          { subject: { vi: "Toán", en: "Math" }, score: "10" },
          { subject: { vi: "Mĩ thuật", en: "Art" }, level: "T" },
        ],
      },
    ]);
    expect(a[0].subjects[0].score).toBe("10");
    expect(a[0].subjects[1].level).toBe("T");
    expect(a[0].honors).toEqual([]); // default
  });
});
