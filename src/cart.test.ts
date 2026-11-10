import { describe, expect, it } from "vitest";
import { addItem, CartError, removeItem, subtotal, type Cart } from "./cart.ts";

describe("cart", () => {
  it("adds up the quantities of the same product", () => {
    let cart: Cart = [];
    cart = addItem(cart, "mug");
    cart = addItem(cart, "mug", 2);
    expect(cart).toHaveLength(1);
    expect(cart[0]?.quantity).toBe(3);
  });

  it("refuses an unknown product and a bad quantity", () => {
    expect(() => addItem([], "teapot")).toThrow(CartError);
    expect(() => addItem([], "mug", 0)).toThrow(CartError);
    expect(() => addItem([], "mug", 1.5)).toThrow(CartError);
  });

  it("removes a product", () => {
    const cart = addItem(addItem([], "mug"), "novel");
    expect(removeItem(cart, "mug").map((line) => line.product.id)).toEqual(["novel"]);
  });

  it("sums the lines", () => {
    const cart = addItem(addItem([], "mug", 2), "novel");
    expect(subtotal(cart)).toBe(2 * 1500 + 1250);
  });
});
