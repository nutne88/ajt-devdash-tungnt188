export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
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

export type AppState =
  | { readonly status: "idle" }
  | { readonly status: "loading" }
  | {
      readonly status: "success";
      readonly data: Product[];
      readonly categories: Category[];
    }
  | { readonly status: "error"; readonly message: string };

export type ProductUpdate = Partial<Pick<Product, "title" | "price" | "stock">>;

export type ProductCard = Pick<
  Product,
  "id" | "title" | "price" | "category" | "thumbnail" | "rating"
>;

export type ProductDraft = Omit<Product, "id">;

export type CategoryMap = Record<string, string>;

export interface CacheEntry<T> {
  value: T;
  timestamp: number;
}
