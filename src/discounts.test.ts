import { describe, expect, it } from "vitest";
import { addItem } from "./cart.ts";
import { discountFor, findCoupon, type Coupon } from "./discounts.ts";

function coupon(code: string): Coupon {
  const found = findCoupon(code);
  if (!found) throw new Error(`no coupon ${code}`);
  return found;
}

describe("coupons", () => {
  it("finds a code in any case", () => {
    expect(findCoupon(" save10 ")?.code).toBe("SAVE10");
    expect(findCoupon("NOPE")).toBeUndefined();
  });

  it("SAVE10 takes 10% off", () => {
    expect(discountFor(addItem([], "kettle"), coupon("SAVE10"))).toBe(400);
  });

  it("BOOKS20 takes 20% off books only", () => {
    const cart = addItem(addItem([], "novel"), "mug");
    expect(discountFor(cart, coupon("BOOKS20"))).toBe(250);
  });

  it("percent coupons apply to the whole line, not one unit", () => {
    expect(discountFor(addItem([], "mug", 3), coupon("SAVE10"))).toBe(450);
    expect(discountFor(addItem([], "novel", 2), coupon("BOOKS20"))).toBe(500);
  });

  it("BOOKS20 discounts only the books in a mixed cart", () => {
    const cart = addItem(addItem([], "mug", 3), "novel", 2);
    expect(discountFor(cart, coupon("BOOKS20"))).toBe(500);
  });

  it("FIVEOFF needs 30.00 in the cart", () => {
    expect(discountFor(addItem([], "mug"), coupon("FIVEOFF"))).toBe(0);
    expect(discountFor(addItem([], "kettle"), coupon("FIVEOFF"))).toBe(500);
  });
});
