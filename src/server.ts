import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { addItem, CartError, type Cart } from "./cart.ts";
import { computeOrder, OrderError } from "./order.ts";
import { renderReceipt } from "./receipt.ts";
import { COUNTRIES, type Country } from "./shipping.ts";

export class RequestError extends Error {
  override name = "RequestError";
}

interface QuoteRequest {
  items: { id: string; quantity: number }[];
  country: Country;
  coupon?: string;
}

/** GET /health, and POST /quote with {"items":[{"id":"mug","quantity":2}],"country":"DE","coupon":"SAVE10"}. */
export function createShopServer(): Server {
  return createServer((req, res) => {
    if (req.method === "GET" && req.url === "/health") return send(res, 200, { ok: true });
    if (req.method === "POST" && req.url === "/quote") return void quote(req, res);
    send(res, 404, { error: "not found" });
  });
}

async function quote(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    const request = parseQuote(await readBody(req));
    let cart: Cart = [];
    for (const item of request.items) cart = addItem(cart, item.id, item.quantity);
    const order = computeOrder(cart, request.country, request.coupon);
    send(res, 200, { order, receipt: renderReceipt(cart, order) });
  } catch (err) {
    if (err instanceof RequestError || err instanceof CartError || err instanceof OrderError) {
      send(res, 400, { error: err.message });
    } else {
      send(res, 500, { error: "internal error" });
    }
  }
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk: string) => (body += chunk));
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function parseQuote(body: string): QuoteRequest {
  let data: unknown;
  try {
    data = JSON.parse(body);
  } catch {
    throw new RequestError("the body is not valid JSON");
  }
  if (typeof data !== "object" || data === null) throw new RequestError("the body must be a JSON object");
  const { items, country, coupon } = data as Record<string, unknown>;
  if (!Array.isArray(items) || items.length === 0) throw new RequestError("items must be a non-empty list");
  if (typeof country !== "string" || !COUNTRIES.includes(country as Country)) {
    throw new RequestError(`country must be one of ${COUNTRIES.join(", ")}`);
  }
  let couponCode: string | undefined;
  if (coupon !== undefined) {
    if (typeof coupon !== "string") throw new RequestError("coupon must be a string");
    couponCode = coupon;
  }
  return { items: items.map(parseItem), country: country as Country, coupon: couponCode };
}

function parseItem(item: unknown): { id: string; quantity: number } {
  const { id, quantity } = (item ?? {}) as Record<string, unknown>;
  if (typeof id !== "string") throw new RequestError("every item needs an id");
  let count = 1;
  if (quantity !== undefined) {
    if (typeof quantity !== "number") throw new RequestError("quantity must be a number");
    count = quantity;
  }
  return { id, quantity: count };
}

function send(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}
