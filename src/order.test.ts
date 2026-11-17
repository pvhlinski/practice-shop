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
    expect(computeOrder(addItem([], "atlas"), "DE", "BOOKS20")).toEqual({
      country: "DE",
      subtotal: 4500,
      couponCode: "BOOKS20",
      discount: 900,
      shipping: 499,
      vat: 684,
      total: 4783,
    });
  });

  it("charges VAT on the full price without a coupon", () => {
    expect(computeOrder(addItem([], "atlas"), "DE")).toEqual({
      country: "DE",
      subtotal: 4500,
      couponCode: null,
      discount: 0,
      shipping: 499,
      vat: 855,
      total: 5854,
    });
  });

  it("ships an order of exactly 50.00 for free", () => {
    const cart = addItem(addItem(addItem(addItem([], "novel"), "novel"), "novel"), "novel");
    expect(computeOrder(cart, "DE")).toEqual({
      country: "DE",
      subtotal: 5000,
      couponCode: null,
      discount: 0,
      shipping: 0,
      vat: 950,
      total: 5950,
    });
  });

  it("refuses an empty cart and an unknown coupon", () => {
    expect(() => computeOrder([], "DE")).toThrow(OrderError);
    expect(() => computeOrder(addItem([], "mug"), "DE", "FREE100")).toThrow(OrderError);
  });
});
