
import type { Product, ProductsResponse, Category } from "./types";

export async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
  }

  const data = (await response.json()) as T;
  return data;
}

const BASE_URL = "https://dummyjson.com";

export async function fetchProducts(): Promise<Product[]> {
  const data = await fetchJson<ProductsResponse>(
    `${BASE_URL}/products?limit=100`
  );
  return data.products;
}

export async function fetchProductById(id: number): Promise<Product> {
  return fetchJson<Product>(`${BASE_URL}/products/${id}`);
}

export async function fetchCategories(): Promise<Category[]> {
  return fetchJson<Category[]>(`${BASE_URL}/products/categories`);
}

export interface DashboardData {
  products: Product[];
  categories: Category[];
}

export async function fetchDashboardData(): Promise<DashboardData> {
  const [products, categories] = await Promise.all([
    fetchProducts(),
    fetchCategories(),
  ]);

  return { products, categories };
}