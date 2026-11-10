import { describe, expect, it } from "vitest";
import { addItem } from "./cart.ts";
import { computeOrder } from "./order.ts";
import { renderReceipt } from "./receipt.ts";

describe("renderReceipt", () => {
  it("lists the products and the sums", () => {
    const cart = addItem([], "mug", 2);
    const text = renderReceipt(cart, computeOrder(cart, "FR"));
    expect(text).toContain("2 x Coffee mug");
    expect(text).toMatch(/Subtotal\s+30\.00/);
    expect(text).toMatch(/Shipping\s+5\.99/);
    expect(text).toMatch(/VAT 20% on 30\.00\s+6\.00/);
    expect(text).toMatch(/Total\s+41\.99/);
  });
});
