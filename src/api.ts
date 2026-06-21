import type { Product, ProductsResponse, Category } from "./types";
import { createTTLCache  } from "./utils"; 

const detailCache = createTTLCache<{ product: Product; related: Product[] }>(5 * 60 * 1000);

export async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
  }
  return response.json() as Promise<T>; 
}

const BASE_URL = "https://dummyjson.com";

export async function fetchProducts(): Promise<Product[]> {
  const data = await fetchJson<ProductsResponse>(`${BASE_URL}/products?limit=100`);
  return data.products;
}

export async function fetchProductById(id: number): Promise<Product> {
  return fetchJson<Product>(`${BASE_URL}/products/${id}`);
}

export async function fetchCategories(): Promise<Category[]> {
  return fetchJson<Category[]>(`${BASE_URL}/products/categories`);
}

export interface ProductDetailData {
  product: Product;
  related: Product[];
}

export async function fetchProductDetail(id: number, category: string): Promise<ProductDetailData> {
  const cacheKey = `${id}-${category}`;
  const cached = detailCache.get(cacheKey);
  if (cached) return cached;

  const [product, categoryData] = await Promise.all([
    fetchProductById(id),
    fetchJson<ProductsResponse>(`${BASE_URL}/products/category/${category}?limit=5`),
  ]);

  const related = categoryData.products.filter((p) => p.id !== id);
  const result = { product, related };

  detailCache.set(cacheKey, result);
  return result;
}

export interface DashboardData {
  products: Product[];
  categories: Category[];
}

export async function fetchDashboardData(): Promise<DashboardData> {
  const [products, categories] = await Promise.all([fetchProducts(), fetchCategories()]);
  return { products, categories };
}