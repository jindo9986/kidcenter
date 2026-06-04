import { describe, it, expect } from "vitest";
import { hashPin, verifyPin } from "./pin";

describe("pin", () => {
  it("verifies a correct pin and rejects a wrong one", async () => {
    const h = await hashPin("1234", "salt-c1");
    expect(await verifyPin("1234", "salt-c1", h)).toBe(true);
    expect(await verifyPin("0000", "salt-c1", h)).toBe(false);
  });
});
