import { describe, it, expect } from "vitest";
import { normalizePct, toTrendSeries } from "./normalize";

describe("normalizePct", () => {
  it("scales a /6 and a /10 score onto the same percentage axis", () => {
    expect(normalizePct(6, 6)).toBe(100);
    expect(normalizePct(5.8, 6)).toBe(96.7);
    expect(normalizePct(9.6, 10)).toBe(96);
    expect(normalizePct(8.3, 10)).toBe(83);
  });
  it("guards a zero/negative max", () => {
    expect(normalizePct(5, 0)).toBe(0);
  });
});

describe("toTrendSeries", () => {
  it("keeps gaps as null (e.g. a subject with no DEC test that year)", () => {
    const out = toTrendSeries([{ grade: 1, may: 6, max: 6 }]);
    expect(out).toEqual([{ grade: 1, dec: null, may: 100 }]);
  });
});
