
import type { AppState, Product } from "./types";

let appState: AppState = { status: "idle" };

let allProducts: Product[] = [];

export function getState(): AppState {
  return appState;
}

export function setState(next: AppState): void {
  appState = next;
}

export function getAllProducts(): Product[] {
  return allProducts;
}

export function setAllProducts(products: Product[]): void {
  allProducts = products;
}