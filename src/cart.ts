import { findProduct, type Product } from "./catalog.ts";
import type { Cents } from "./money.ts";

export interface CartLine {
  product: Product;
  quantity: number;
}

export type Cart = readonly CartLine[];

export class CartError extends Error {
  override name = "CartError";
}

/** Adds a product; the same product twice becomes one line with the quantities added up. */
export function addItem(cart: Cart, productId: string, quantity = 1): Cart {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new CartError(`quantity must be a whole number of at least 1, got ${quantity}`);
  }
  const product = findProduct(productId);
  if (!product) throw new CartError(`unknown product "${productId}"`);
  const existing = cart.find((line) => line.product.id === productId);
  if (existing) {
    return cart.map((line) => (line === existing ? { ...line, quantity: line.quantity + quantity } : line));
  }
  return [...cart, { product, quantity }];
}

export function removeItem(cart: Cart, productId: string): Cart {
  return cart.filter((line) => line.product.id !== productId);
}

export function lineTotal(line: CartLine): Cents {
  return line.product.price * line.quantity;
}

export function subtotal(cart: Cart): Cents {
  return cart.reduce((sum, line) => sum + lineTotal(line), 0);
}
