import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createShopServer, startMessage } from "./server.ts";

describe("start message", () => {
  it("names the port set by PORT", () => {
    expect(startMessage(8080)).toBe("practice shop on http://localhost:8080");
  });

  it("names the default port 3000", () => {
    expect(startMessage(3000)).toBe("practice shop on http://localhost:3000");
  });
});

const server = createShopServer();
let base = "";

beforeAll(async () => {
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

function quote(body: string): Promise<Response> {
  return fetch(`${base}/quote`, { method: "POST", body, headers: { "content-type": "application/json" } });
}

describe("HTTP API", () => {
  it("answers /health", async () => {
    const res = await fetch(`${base}/health`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("quotes an order", async () => {
    const res = await quote(JSON.stringify({ items: [{ id: "mug", quantity: 2 }], country: "FR" }));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { order: { total: number }; receipt: string };
    expect(body.order.total).toBe(4199);
    expect(body.receipt).toContain("2 x Coffee mug");
  });

  it("answers 400 to a bad request", async () => {
    expect((await quote("not json")).status).toBe(400);
    expect((await quote(JSON.stringify({ items: [], country: "DE" }))).status).toBe(400);
    expect((await quote(JSON.stringify({ items: [{ id: "mug" }], country: "US" }))).status).toBe(400);
    expect((await quote(JSON.stringify({ items: [{ id: "teapot" }], country: "DE" }))).status).toBe(400);
  });
});
