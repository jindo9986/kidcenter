import { describe, it, expect } from "vitest";
import { computeAge, formatDateDMY } from "@/lib/date";

describe("computeAge", () => {
  it("returns 10 for 2016-02-23 on 2026-06-03", () => {
    expect(computeAge("2016-02-23", new Date("2026-06-03"))).toBe(10);
  });

  it("does not count a birthday that has not happened yet this year", () => {
    expect(computeAge("2016-02-23", new Date("2026-01-10"))).toBe(9);
  });

  it("counts the birthday on the exact day", () => {
    expect(computeAge("2016-02-23", new Date("2026-02-23"))).toBe(10);
  });
});

describe("formatDateDMY", () => {
  it("formats ISO to dd/mm/yyyy", () => {
    expect(formatDateDMY("2016-02-23")).toBe("23/02/2016");
  });
});
