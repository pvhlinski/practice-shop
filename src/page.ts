import { addItem, CartError, type Cart } from "./cart.ts";
import { CATALOG } from "./catalog.ts";
import { formatMoney } from "./money.ts";
import { computeOrder, OrderError, type Order } from "./order.ts";
import { renderReceipt } from "./receipt.ts";
import { COUNTRIES, type Country } from "./shipping.ts";

const COUNTRY_NAMES: Record<Country, string> = { DE: "Germany", FR: "France", PL: "Poland" };
const DEFAULT_COUNTRY: Country = "DE";

class FormError extends Error {
  override name = "FormError";
}

/** The form as it was sent: the typed quantities by product id, the country code and the coupon. */
interface FormValues {
  quantities: Record<string, string>;
  country: string;
  coupon: string;
}

/**
 * The page for a query: the empty form at first. Once the form is sent (it always sends a country), the form keeps what
 * was typed, and below it comes the receipt of that order or what is wrong with it.
 */
export function renderPage(query: URLSearchParams): { status: number; body: string } {
  const values = formValues(query);
  if (!query.has("country")) return { status: 200, body: layout(form(values), "") };
  try {
    const { cart, order } = quote(values);
    return { status: 200, body: layout(form(values), `<h2>Your order</h2>\n<pre>${escapeHtml(renderReceipt(cart, order))}</pre>`) };
  } catch (err) {
    if (err instanceof FormError || err instanceof CartError || err instanceof OrderError) {
      return { status: 400, body: layout(form(values), `<p role="alert">${escapeHtml(err.message)}</p>`) };
    }
    return { status: 500, body: layout(form(values), '<p role="alert">internal error</p>') };
  }
}

function formValues(query: URLSearchParams): FormValues {
  return {
    quantities: Object.fromEntries(CATALOG.map((product) => [product.id, query.get(product.id)?.trim() ?? ""])),
    country: query.get("country") ?? DEFAULT_COUNTRY,
    coupon: query.get("coupon")?.trim() ?? "",
  };
}

/** The order the form describes; an empty quantity and 0 leave the product out. */
function quote(values: FormValues): { cart: Cart; order: Order } {
  if (!isCountry(values.country)) throw new FormError(`choose a country: ${COUNTRIES.join(", ")}`);
  let cart: Cart = [];
  for (const product of CATALOG) {
    const typed = values.quantities[product.id] ?? "";
    if (typed === "") continue;
    if (!/^\d+$/.test(typed)) {
      throw new FormError(`the quantity of ${product.name} must be a whole number of 0 or more`);
    }
    const quantity = Number(typed);
    if (quantity > 0) cart = addItem(cart, product.id, quantity);
  }
  return { cart, order: computeOrder(cart, values.country, values.coupon === "" ? undefined : values.coupon) };
}

function isCountry(code: string): code is Country {
  return (COUNTRIES as readonly string[]).includes(code);
}

function form(values: FormValues): string {
  const rows = CATALOG.map((product) => {
    const id = `qty-${product.id}`;
    const quantity = escapeHtml(values.quantities[product.id] ?? "");
    return `<tr><td><label for="${id}">${escapeHtml(product.name)}</label></td><td>${formatMoney(product.price)}</td><td><input id="${id}" name="${product.id}" type="number" min="0" step="1" value="${quantity}"></td></tr>`;
  });
  const options = COUNTRIES.map(
    (code) => `<option value="${code}"${code === values.country ? " selected" : ""}>${COUNTRY_NAMES[code]}</option>`,
  );
  return [
    '<form method="get" action="/">',
    "<table>",
    "<thead><tr><th>Product</th><th>Price</th><th>Quantity</th></tr></thead>",
    "<tbody>",
    ...rows,
    "</tbody>",
    "</table>",
    `<p><label for="country">Country</label> <select id="country" name="country">${options.join("")}</select></p>`,
    `<p><label for="coupon">Coupon</label> <input id="coupon" name="coupon" value="${escapeHtml(values.coupon)}"></p>`,
    '<p><button type="submit">Calculate</button></p>',
    "</form>",
  ].join("\n");
}

function layout(formHtml: string, result: string): string {
  return [
    "<!doctype html>",
    '<html lang="en">',
    '<head><meta charset="utf-8"><title>Practice shop</title></head>',
    "<body>",
    "<h1>Practice shop</h1>",
    "<p>Prices are in euro, without VAT.</p>",
    formHtml,
    result,
    "</body>",
    "</html>",
    "",
  ].join("\n");
}

/** Text as HTML shows it: the characters markup is made of become character references. */
function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}
