import {
  fetchDashboardData,
  fetchProductDetail,
  type ProductDetailData,
} from "./api";
import { setState, getAllProducts, getState } from "./state";
import {
  renderStatus,
  renderCategoryOptions,
  renderProductList,
  renderProductDetail,
  showListView,
} from "./ui";
import { debounce, memoize } from "./utils";
import type { Product, AppState } from "./types";
let currentDetailData: ProductDetailData | null = null;

const fetchDetailCached = memoize(
  ({ id, category }: { id: number; category: string }) =>
    fetchProductDetail(id, category),
);

function getFilteredProducts(
  products: Product[],
  search: string,
  category: string,
  sort: string,
): Product[] {
  const query = search.toLowerCase().trim();

  let result = products.filter(
    ({ title, description, category: cat }) =>
      (title.toLowerCase().includes(query) ||
        description.toLowerCase().includes(query)) &&
      (category === "" || cat === category),
  );

  if (sort === "price-asc")
    result = [...result].sort((a, b) => a.price - b.price);
  if (sort === "price-desc")
    result = [...result].sort((a, b) => b.price - a.price);
  if (sort === "name-asc")
    result = [...result].sort((a, b) => a.title.localeCompare(b.title));

  return result;
}

function updateAppState(nextState: AppState): void {
  setState(nextState);
  renderStatus(nextState);
}

function refreshList(): void {
  const search = (document.getElementById("search-input") as HTMLInputElement)
    .value;
  const category = (
    document.getElementById("category-filter") as HTMLSelectElement
  ).value;
  const sort = (document.getElementById("sort-select") as HTMLSelectElement)
    .value;

  const filtered = getFilteredProducts(
    getAllProducts(),
    search,
    category,
    sort,
  );
  renderProductList(filtered, handleCardClick);
}

async function handleCardClick(id: number): Promise<void> {
  let product = getAllProducts().find((p) => p.id === id);
  let category = product?.category;
  if (!category && currentDetailData) {
    if (currentDetailData.product.id === id) {
      category = currentDetailData.product.category;
    } else {
      const relatedProduct = currentDetailData.related.find((p) => p.id === id);
      category = relatedProduct?.category;
    }
  }

  if (!category) return;

  try {
    renderStatus({ status: "loading" });

    const detailData = await fetchDetailCached({ id, category });
    currentDetailData = detailData;
    renderStatus({ status: "idle" });

    renderProductDetail(
      detailData,
      () => {
        currentDetailData = null; 
        showListView();
        refreshList();
      },
      handleCardClick,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    updateAppState({ status: "error", message });
  }
}

function bindControls(): void {
  const debouncedRefresh = debounce(refreshList, 300);

  document
    .getElementById("search-input")
    ?.addEventListener("input", debouncedRefresh);
  document
    .getElementById("category-filter")
    ?.addEventListener("change", refreshList);
  document
    .getElementById("sort-select")
    ?.addEventListener("change", refreshList);
}

async function init(): Promise<void> {
  updateAppState({ status: "loading" });

  try {
    const { products, categories } = await fetchDashboardData();

    updateAppState({ status: "success", data: products, categories });

    const currentState = getState();
    switch (currentState.status) {
      case "success":
        renderCategoryOptions(currentState.categories);
        renderProductList(currentState.data, handleCardClick);
        break;
      case "idle":
      case "loading":
      case "error":
        break;
      default: {
        const _exhaustiveCheck: never = currentState;
        return _exhaustiveCheck;
      }
    }

    bindControls();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    updateAppState({ status: "error", message });
  }
}

init();
