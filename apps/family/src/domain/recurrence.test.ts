import { describe, it, expect } from "vitest";
import { dueOn, generateInstances } from "./recurrence";
import type { ActivityLite } from "./types";

const base: ActivityLite = {
  id: "a1",
  points: 5,
  recurrence: "daily",
  schedule: null,
  assigneeMemberId: null,
  active: true,
};

describe("dueOn", () => {
  it("daily is always due", () => {
    expect(dueOn(base, "2026-06-04")).toBe(true);
  });
  it("weekly is due only on scheduled weekday (2026-06-04 is Thursday=4)", () => {
    const w = { ...base, recurrence: "weekly" as const, schedule: { days: [4] } };
    expect(dueOn(w, "2026-06-04")).toBe(true);
    expect(dueOn(w, "2026-06-05")).toBe(false);
  });
  it("once is due only on its startDate", () => {
    const o = { ...base, recurrence: "once" as const, startDate: "2026-06-04" };
    expect(dueOn(o, "2026-06-04")).toBe(true);
    expect(dueOn(o, "2026-06-05")).toBe(false);
  });
  it("inactive is never due", () => {
    expect(dueOn({ ...base, active: false }, "2026-06-04")).toBe(false);
  });
});

describe("generateInstances", () => {
  it("creates one instance per child for an unassigned daily activity", () => {
    const out = generateInstances([base], ["c1", "c2"], "2026-06-04");
    expect(out).toEqual([
      { activityId: "a1", memberId: "c1", dueDate: "2026-06-04" },
      { activityId: "a1", memberId: "c2", dueDate: "2026-06-04" },
    ]);
  });
  it("creates one instance for an assigned activity only", () => {
    const a = { ...base, assigneeMemberId: "c2" };
    const out = generateInstances([a], ["c1", "c2"], "2026-06-04");
    expect(out).toEqual([{ activityId: "a1", memberId: "c2", dueDate: "2026-06-04" }]);
  });
});
