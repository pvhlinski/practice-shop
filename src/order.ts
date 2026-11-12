import { subtotal, type Cart } from "./cart.ts";
import { discountFor, findCoupon } from "./discounts.ts";
import type { Cents } from "./money.ts";
import { shippingFor, type Country } from "./shipping.ts";
import { vatFor } from "./tax.ts";

export interface Order {
  country: Country;
  subtotal: Cents;
  couponCode: string | null;
  discount: Cents;
  shipping: Cents;
  vat: Cents;
  total: Cents;
}

export class OrderError extends Error {
  override name = "OrderError";
}

export function computeOrder(cart: Cart, country: Country, couponCode?: string): Order {
  if (cart.length === 0) throw new OrderError("the cart is empty");
  const coupon = couponCode === undefined ? undefined : findCoupon(couponCode);
  if (couponCode !== undefined && coupon === undefined) throw new OrderError(`unknown coupon "${couponCode}"`);

  const sub = subtotal(cart);
  const discount = coupon === undefined ? 0 : discountFor(cart, coupon);
  const afterDiscount = sub - discount;
  const shipping = shippingFor(country, afterDiscount);
  const vat = vatFor(country, afterDiscount);
  return {
    country,
    subtotal: sub,
    couponCode: coupon?.code ?? null,
    discount,
    shipping,
    vat,
    total: afterDiscount + shipping + vat,
  };
}
