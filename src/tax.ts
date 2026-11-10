import { percentOf, type Cents } from "./money.ts";
import type { Country } from "./shipping.ts";

const VAT_PERCENT: Record<Country, number> = { DE: 19, FR: 20, PL: 23 };

export function vatPercent(country: Country): number {
  return VAT_PERCENT[country];
}

/** VAT on goods. Shipping is not taxed in this shop. */
export function vatFor(country: Country, taxable: Cents): Cents {
  return percentOf(taxable, VAT_PERCENT[country]);
}
