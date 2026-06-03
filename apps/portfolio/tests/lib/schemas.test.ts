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
