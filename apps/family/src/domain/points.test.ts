import { describe, it, expect } from "vitest";
import { computeBalance, canAfford } from "./points";

describe("computeBalance", () => {
  it("sums deltas (incl. negatives) and treats empty as 0", () => {
    expect(computeBalance([])).toBe(0);
    expect(computeBalance([{ delta: 10 }, { delta: 5 }, { delta: -4 }])).toBe(11);
  });
});

describe("canAfford", () => {
  it("is true only when balance covers cost and never allows negative", () => {
    expect(canAfford(100, 100)).toBe(true);
    expect(canAfford(99, 100)).toBe(false);
    expect(canAfford(100, 0)).toBe(true);
  });
});
