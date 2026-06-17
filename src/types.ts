
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

export type AppState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: Product[]; categories: Category[] }
  | { status: "error"; message: string };
export type ProductUpdate = Partial<Pick<Product, "title" | "price" | "stock">>;
export type CategoryMap = Record<string, string>;