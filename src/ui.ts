import type { Product, Category, AppState } from "./types";
import type { ProductDetailData } from "./api";

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
      status.textContent = "⏳ Loading data...";
      break;
    case "error":
      status.className = "error";
      status.textContent = `❌ ${state.message}`;
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
    list.innerHTML = `<p>No products found.</p>`;
    return;
  }

  list.innerHTML = products
    .map(
      ({ id, title, price, category, thumbnail, rating }) => `
      <article class="card" data-id="${id}">
        <img src="${thumbnail}" alt="${title}" loading="lazy" />
        <h3>${title}</h3>
        <p class="price">$${price.toFixed(2)}</p>
        <p class="category">${category}</p>
        <p class="rating">⭐ ${rating}</p>
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
  { product, related }: ProductDetailData,
  onBack: () => void,
  onRelatedClick: (id: number) => void
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

  const relatedHTML =
    related.length > 0
      ? `
      <div class="related">
        <h3>Related Products</h3>
        <div class="related-grid">
          ${related
            .map(
              ({ id, title, price, thumbnail }) => `
            <article class="card related-card" data-id="${id}">
              <img src="${thumbnail}" alt="${title}" loading="lazy" />
              <h3>${title}</h3>
              <p class="price">$${price.toFixed(2)}</p>
            </article>
          `
            )
            .join("")}
        </div>
      </div>
    `
      : "";

  detail.innerHTML = `
    <button class="back-btn">← Back to list</button>
    <div class="detail-content">
      <img src="${thumbnail}" alt="${title}" />
      <div class="detail-info">
        <h2>${title}</h2>
        <p class="detail-meta">${brand} · ${category}</p>
        <p class="detail-desc">${description}</p>
        <p>
          <strong>Price:</strong>
          <span class="detail-price">$${price.toFixed(2)}</span>
          <span class="detail-discount">${discountPercentage}% off</span>
        </p>
        <p><strong>Rating:</strong> ⭐ ${rating}</p>
        <p><strong>Stock:</strong> ${stock} units</p>
      </div>
    </div>
    ${relatedHTML}
  `;

  detail.classList.remove("hidden");

  detail.querySelector(".back-btn")?.addEventListener("click", onBack);

  detail.querySelectorAll<HTMLElement>(".related-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = Number(card.dataset["id"]);
      onRelatedClick(id);
    });
  });
}

export function showListView(): void {
  getElement<HTMLElement>("product-list").classList.remove("hidden");
  getElement<HTMLElement>("controls").classList.remove("hidden");
  getElement<HTMLElement>("product-detail").classList.add("hidden");
}