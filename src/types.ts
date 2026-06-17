// src/types.ts

// ─── API Response Types ──────────────────────────────────────────────
// Dùng https://dummyjson.com/products

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

// ─── App State (Discriminated Union) ─────────────────────────────────
// Dùng cho Good/Excellent tier — mô tả trạng thái ứng dụng

export type AppState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: Product[]; categories: Category[] }
  | { status: "error"; message: string };

// ─── UI / DTO types ───────────────────────────────────────────────────
// Partial dùng cho update payload (Utility type — Excellent tier)

export type ProductUpdate = Partial<Pick<Product, "title" | "price" | "stock">>;

// Record để map category slug → display name
export type CategoryMap = Record<string, string>;