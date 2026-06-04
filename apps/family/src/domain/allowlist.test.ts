import { describe, it, expect } from "vitest";
import { normalizeEmail, isAllowed } from "./allowlist";

describe("allowlist", () => {
  it("normalizes case and whitespace", () => {
    expect(normalizeEmail("  Mom@Gmail.com ")).toBe("mom@gmail.com");
  });
  it("matches against a normalized allowlist", () => {
    const list = ["mom@gmail.com", "dad@gmail.com"];
    expect(isAllowed("MOM@gmail.com", list)).toBe(true);
    expect(isAllowed("stranger@gmail.com", list)).toBe(false);
  });
});
