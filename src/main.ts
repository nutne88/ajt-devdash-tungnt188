import { fetchDashboardData, fetchProductById } from "./api";
import { setState, getAllProducts, setAllProducts } from "./state";
import {
  renderStatus,
  renderCategoryOptions,
  renderProductList,
  renderProductDetail,
  showListView,
} from "./ui";
import type { Product } from "./types";

function getFilteredProducts(
  products: Product[],
  search: string,
  category: string,
  sort: string
): Product[] {
  let result = products
    .filter(({ title, description }) => {
      const q = search.toLowerCase();
      return (
        title.toLowerCase().includes(q) ||
        description.toLowerCase().includes(q)
      );
    })
    .filter(({ category: cat }) =>
      category === "" ? true : cat === category
    );

  if (sort === "price-asc") {
    result = [...result].sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    result = [...result].sort((a, b) => b.price - a.price);
  } else if (sort === "name-asc") {
    result = [...result].sort((a, b) => a.title.localeCompare(b.title));
  }

  return result;
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
    sort
  );

  renderProductList(filtered, handleCardClick);
}

async function handleCardClick(id: number): Promise<void> {
  try {
    setState({ status: "loading" });
    renderStatus({ status: "loading" });

    const product = await fetchProductById(id);

    setState({ status: "idle" });
    renderStatus({ status: "idle" });

    renderProductDetail(product, () => {
      showListView();
      refreshList();
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    setState({ status: "error", message });
    renderStatus({ status: "error", message });
  }
}

function bindControls(): void {
  document.getElementById("search-input")
    ?.addEventListener("input", refreshList);

  document.getElementById("category-filter")
    ?.addEventListener("change", refreshList);

  document.getElementById("sort-select")
    ?.addEventListener("change", refreshList);
}

//Entry point 
async function init(): Promise<void> {
  setState({ status: "loading" });
  renderStatus({ status: "loading" });

  try {
    // Promise.all
    const { products, categories } = await fetchDashboardData();

    setAllProducts(products);
    setState({ status: "success", data: products, categories });
    renderStatus({ status: "success", data: products, categories });

    renderCategoryOptions(categories);
    renderProductList(products, handleCardClick);
    bindControls();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    setState({ status: "error", message });
    renderStatus({ status: "error", message });
  }
}

init();