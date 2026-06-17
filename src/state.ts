// src/state.ts
import type { AppState, Product } from "./types";

// State hiện tại của ứng dụng
let appState: AppState = { status: "idle" };

// Danh sách gốc — không mutate, chỉ dùng để filter/sort
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