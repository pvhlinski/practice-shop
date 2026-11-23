import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createShopServer } from "./server.ts";

const server = createShopServer();
let base = "";

beforeAll(async () => {
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

async function page(query = ""): Promise<{ status: number; type: string | null; html: string }> {
  const res = await fetch(`${base}/${query}`);
  return { status: res.status, type: res.headers.get("content-type"), html: await res.text() };
}

describe("shop page", () => {
  it("shows the order form", async () => {
    const { status, type, html } = await page();
    expect(status).toBe(200);
    expect(type).toBe("text/html; charset=utf-8");
    expect(html).toContain('<form method="get" action="/">');
    for (const name of ["Coffee mug", "Electric kettle", "Paperback novel", "World atlas", "Garden gloves"]) {
      expect(html).toContain(name);
    }
    expect(html).toContain('<label for="qty-mug">');
    expect(html).toContain('<option value="FR">France</option>');
    expect(html).toContain('<input id="coupon" name="coupon"');
    expect(html).toContain('<button type="submit">Calculate</button>');
    expect(html).not.toContain("Your order");
  });

  it("shows the receipt of the order sent from the form", async () => {
    const { status, html } = await page("?mug=2&kettle=&country=FR&coupon=");
    expect(status).toBe(200);
    expect(html).toContain("Your order");
    expect(html).toContain("2 x Coffee mug");
    expect(html).toMatch(/Total +41\.99/);
    expect(html).toContain('id="qty-mug" name="mug" type="number" min="0" step="1" value="2"');
    expect(html).toContain('<option value="FR" selected>France</option>');
  });

  it("applies the coupon typed in the form", async () => {
    const { status, html } = await page("?mug=2&country=DE&coupon=fiveoff");
    expect(status).toBe(200);
    expect(html).toMatch(/Discount FIVEOFF +-5\.00/);
    expect(html).toContain('value="fiveoff"');
  });

  it("says what is wrong with a form it cannot quote", async () => {
    const cases: [string, string][] = [
      ["?country=DE", "the cart is empty"],
      ["?mug=1.5&country=DE", "the quantity of Coffee mug must be a whole number of 0 or more"],
      ["?mug=-1&country=DE", "the quantity of Coffee mug must be a whole number of 0 or more"],
      ["?mug=1e2&country=DE", "the quantity of Coffee mug must be a whole number of 0 or more"],
      ["?mug=1&country=US", "choose a country: DE, FR, PL"],
      ["?mug=1&country=DE&coupon=NOPE", "unknown coupon &#34;NOPE&#34;"],
    ];
    for (const [query, message] of cases) {
      const { status, html } = await page(query);
      expect(status, query).toBe(400);
      expect(html, query).toContain(`<p role="alert">${message}</p>`);
      expect(html, query).not.toContain("Your order");
    }
  });

  it("shows what was typed as text, never as markup", async () => {
    const { html } = await page("?mug=1&country=DE&coupon=%3Cscript%3Ealert(1)%3C%2Fscript%3E");
    expect(html).not.toContain("<script>");
    expect(html).toContain("&#60;script&#62;alert(1)&#60;/script&#62;");
  });

  it("answers an address it cannot read with not found, and keeps running", async () => {
    expect((await fetch(`${base}//`)).status).toBe(404);
    expect((await fetch(`${base}//?mug=2&country=DE`)).status).toBe(404);
    expect((await fetch(`${base}/health`)).status).toBe(200);
  });

  it("leaves the other addresses as they were", async () => {
    expect((await fetch(`${base}/health`)).headers.get("content-type")).toBe("application/json");
    expect((await fetch(`${base}/`, { method: "POST" })).status).toBe(404);
    expect((await fetch(`${base}/page`)).status).toBe(404);
  });
});
