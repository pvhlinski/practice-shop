import type { Cents } from "./money.ts";

export type Category = "kitchen" | "books" | "garden";

export interface Product {
  id: string;
  name: string;
  price: Cents;
  category: Category;
}

export const CATALOG: readonly Product[] = [
  { id: "mug", name: "Coffee mug", price: 1500, category: "kitchen" },
  { id: "kettle", name: "Electric kettle", price: 3999, category: "kitchen" },
  { id: "novel", name: "Paperback novel", price: 1250, category: "books" },
  { id: "atlas", name: "World atlas", price: 4500, category: "books" },
  { id: "gloves", name: "Garden gloves", price: 899, category: "garden" },
];

export function findProduct(id: string): Product | undefined {
  return CATALOG.find((p) => p.id === id);
}
