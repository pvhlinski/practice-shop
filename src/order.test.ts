import { describe, expect, it } from "vitest";
import { addItem } from "./cart.ts";
import { computeOrder, OrderError } from "./order.ts";

describe("computeOrder", () => {
  it("adds shipping and VAT", () => {
    expect(computeOrder(addItem([], "kettle"), "DE")).toEqual({
      country: "DE",
      subtotal: 3999,
      couponCode: null,
      discount: 0,
      shipping: 499,
      vat: 760,
      total: 5258,
    });
  });

  it("applies a coupon", () => {
    const order = computeOrder(addItem([], "kettle"), "DE", "save10");
    expect(order.couponCode).toBe("SAVE10");
    expect(order.discount).toBe(400);
  });

  it("charges VAT on the goods after the discount", () => {
    const order = computeOrder(addItem([], "atlas"), "DE", "BOOKS20");
    expect(order.vat).toBe(684);
    expect(order.total).toBe(4783);
  });

  it("refuses an empty cart and an unknown coupon", () => {
    expect(() => computeOrder([], "DE")).toThrow(OrderError);
    expect(() => computeOrder(addItem([], "mug"), "DE", "FREE100")).toThrow(OrderError);
  });
});
