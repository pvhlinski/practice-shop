import { lineTotal, subtotal, type Cart } from "./cart.ts";
import type { Category } from "./catalog.ts";
import { percentOf, type Cents } from "./money.ts";

export type Coupon =
  | { code: string; kind: "percent"; percent: number; category?: Category }
  | { code: string; kind: "fixed"; amount: Cents; minSubtotal: Cents };

export const COUPONS: readonly Coupon[] = [
  { code: "SAVE10", kind: "percent", percent: 10 },
  { code: "BOOKS20", kind: "percent", percent: 20, category: "books" },
  { code: "FIVEOFF", kind: "fixed", amount: 500, minSubtotal: 3000 },
];

/** Codes are not case-sensitive: "save10" is SAVE10. */
export function findCoupon(code: string): Coupon | undefined {
  const wanted = code.trim().toUpperCase();
  return COUPONS.find((c) => c.code === wanted);
}

/** What a coupon takes off the cart; never more than the cart is worth. */
export function discountFor(cart: Cart, coupon: Coupon): Cents {
  if (coupon.kind === "fixed") {
    const total = subtotal(cart);
    return total >= coupon.minSubtotal ? Math.min(coupon.amount, total) : 0;
  }
  let discount = 0;
  for (const line of cart) {
    if (coupon.category !== undefined && line.product.category !== coupon.category) continue;
    discount += percentOf(lineTotal(line), coupon.percent);
  }
  return discount;
}
