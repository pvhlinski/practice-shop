/** Amounts are integer cents everywhere; only formatting turns them into text. All amounts are in euro. */
export type Cents = number;

/** 1250 -> "12.50", -250 -> "-2.50". */
export function formatMoney(value: Cents): string {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  const whole = Math.floor(abs / 100);
  const rest = String(abs % 100).padStart(2, "0");
  return `${sign}${whole}.${rest}`;
}

/** A percent of an amount, rounded to a whole cent (half up). */
export function percentOf(value: Cents, percent: number): Cents {
  return Math.round((value * percent) / 100);
}
