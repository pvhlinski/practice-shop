import { describe, expect, it } from "vitest";
import { shippingFor } from "./shipping.ts";

describe("shipping", () => {
  it("charges the country rate below the free-shipping amount", () => {
    expect(shippingFor("DE", 1500)).toBe(499);
    expect(shippingFor("PL", 4999)).toBe(699);
  });

  it("is free for bigger orders", () => {
    expect(shippingFor("FR", 6000)).toBe(0);
  });
});
