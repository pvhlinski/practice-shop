import type { Cents } from "./money.ts";

export type Country = "DE" | "FR" | "PL";

export const COUNTRIES: readonly Country[] = ["DE", "FR", "PL"];

/** Orders from this amount (after the discount) ship for free. */
export const FREE_SHIPPING_FROM: Cents = 5000;

const RATES: Record<Country, Cents> = { DE: 499, FR: 599, PL: 699 };

export function shippingFor(country: Country, afterDiscount: Cents): Cents {
  return afterDiscount > FREE_SHIPPING_FROM ? 0 : RATES[country];
}
