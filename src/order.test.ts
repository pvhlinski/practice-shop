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

  it("ships an order of exactly 50.00 for free", () => {
    const order = computeOrder(addItem([], "novel", 4), "DE");
    expect(order.subtotal).toBe(5000);
    expect(order.shipping).toBe(0);
    expect(order.total).toBe(5950);
  });

  it("applies a coupon", () => {
    const order = computeOrder(addItem([], "kettle"), "DE", "save10");
    expect(order.couponCode).toBe("SAVE10");
    expect(order.discount).toBe(400);
  });

  it("refuses an empty cart and an unknown coupon", () => {
    expect(() => computeOrder([], "DE")).toThrow(OrderError);
    expect(() => computeOrder(addItem([], "mug"), "DE", "FREE100")).toThrow(OrderError);
  });
});
