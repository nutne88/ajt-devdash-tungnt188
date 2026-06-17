
import { fetchDashboardData } from "./api";

async function init(): Promise<void> {
  console.log("Fetching dashboard data...");

  try {
    const { products, categories } = await fetchDashboardData();
    console.log(`Loaded ${products.length} products`);
    console.log(`Loaded ${categories.length} categories`);
    console.log("First product:", products[0]);
    console.log("Categories sample:", categories.slice(0, 3));
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Failed to load:", error.message);
    }
  }
}

init();