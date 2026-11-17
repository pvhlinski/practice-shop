import { lineTotal, type Cart } from "./cart.ts";
import { formatMoney } from "./money.ts";
import type { Order } from "./order.ts";
import { vatPercent } from "./tax.ts";

/** A plain-text receipt: one row per product, then the sums. */
export function renderReceipt(cart: Cart, order: Order): string {
  const rows = cart.map((line): [string, string] => [`${line.quantity} x ${line.product.name}`, formatMoney(lineTotal(line))]);
  rows.push(["Subtotal", formatMoney(order.subtotal)]);
  if (order.couponCode !== null) rows.push([`Discount ${order.couponCode}`, `-${formatMoney(order.discount)}`]);
  rows.push(["Shipping", order.shipping === 0 ? "free" : formatMoney(order.shipping)]);
  rows.push([`VAT ${vatPercent(order.country)}% on ${formatMoney(order.subtotal - order.discount)}`, formatMoney(order.vat)]);
  rows.push(["Total", formatMoney(order.total)]);
  const width = Math.max(...rows.map(([label]) => label.length)) + 2;
  return rows.map(([label, amount]) => label.padEnd(width) + amount.padStart(10)).join("\n");
}
