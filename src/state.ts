import type { AppState, Product } from "./types";

let appState: AppState = { status: "idle" };

export function getState(): AppState {
  return appState;
}

export function setState(next: AppState): void {
  appState = next;
}

export function getAllProducts(): Product[] {
  if (appState.status === "success") {
    return appState.data;
  }
  return [];
}
