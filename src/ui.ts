import type { Product, Category, AppState } from "./types";

function getElement<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element #${id} not found`);
  return el as T;
}

export function renderStatus(state: AppState): void {
  const status = getElement<HTMLDivElement>("status");

  switch (state.status) {
    case "idle":
      status.className = "";
      status.textContent = "";
      break;

    case "loading":
      status.className = "loading";
      status.textContent = "Loading data...";
      break;

    case "error":
      status.className = "error";
      status.textContent = `${state.message}`;
      break;

    case "success":
      status.className = "";
      status.textContent = "";
      break;
  }
}

export function renderCategoryOptions(categories: Category[]): void {
  const select = getElement<HTMLSelectElement>("category-filter");

  select.innerHTML = `<option value="">All Categories</option>`;

  categories.forEach(({ slug, name }) => {
    const option = document.createElement("option");
    option.value = slug;
    option.textContent = name;
    select.appendChild(option);
  });
}

export function renderProductList(
  products: Product[],
  onCardClick: (id: number) => void
): void {
  const list = getElement<HTMLElement>("product-list");

  if (products.length === 0) {
    list.innerHTML = `<p style="color:#888">No products found.</p>`;
    return;
  }

  list.innerHTML = products
    .map(
      ({ id, title, price, category, thumbnail }) => `
      <article class="card" data-id="${id}">
        <img src="${thumbnail}" alt="${title}" loading="lazy" />
        <h3>${title}</h3>
        <p class="price">$${price.toFixed(2)}</p>
        <p class="category">${category}</p>
      </article>
    `
    )
    .join("");

  list.querySelectorAll<HTMLElement>(".card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = Number(card.dataset["id"]);
      onCardClick(id);
    });
  });
}

export function renderProductDetail(
  product: Product,
  onBack: () => void
): void {
  const listSection = getElement<HTMLElement>("product-list");
  const controls = getElement<HTMLElement>("controls");
  const detail = getElement<HTMLElement>("product-detail");

  listSection.classList.add("hidden");
  controls.classList.add("hidden");

  const {
    title,
    description,
    price,
    rating,
    stock,
    brand,
    category,
    thumbnail,
    discountPercentage,
  } = product;

  detail.innerHTML = `
    <button class="back-btn">← Back to list</button>
    <img src="${thumbnail}" alt="${title}" />
    <h2>${title}</h2>
    <p style="color:#888;margin-bottom:0.5rem">${brand} · ${category}</p>
    <p style="margin-bottom:0.75rem">${description}</p>
    <p><strong>Price:</strong> $${price.toFixed(2)}
       <span style="color:#dc2626;font-size:0.85rem">
         (${discountPercentage}% off)
       </span>
    </p>
    <p><strong>Rating:</strong> ⭐ ${rating}</p>
    <p><strong>Stock:</strong> ${stock} units</p>
  `;

  detail.classList.remove("hidden");

  detail.querySelector(".back-btn")?.addEventListener("click", onBack);
}

export function showListView(): void {
  getElement<HTMLElement>("product-list").classList.remove("hidden");
  getElement<HTMLElement>("controls").classList.remove("hidden");
  getElement<HTMLElement>("product-detail").classList.add("hidden");
}