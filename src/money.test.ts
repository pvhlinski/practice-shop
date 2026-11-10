import { describe, expect, it } from "vitest";
import { formatMoney, percentOf } from "./money.ts";

describe("formatMoney", () => {
  it.each([
    [0, "0.00"],
    [5, "0.05"],
    [1250, "12.50"],
    [123456, "1234.56"],
    [-250, "-2.50"],
  ])("%i cents is %s", (value, text) => {
    expect(formatMoney(value)).toBe(text);
  });
});

describe("percentOf", () => {
  it("rounds to a whole cent", () => {
    expect(percentOf(3999, 19)).toBe(760);
    expect(percentOf(1500, 10)).toBe(150);
  });
});
