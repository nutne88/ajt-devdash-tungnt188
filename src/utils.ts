import type { CacheEntry } from "./types";

export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>): void => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function memoize<TArg, TResult>(
  fn: (arg: TArg) => Promise<TResult>,
): (arg: TArg) => Promise<TResult> {
  const cache = new Map<string, TResult>();
  return async (arg: TArg): Promise<TResult> => {
    const key = JSON.stringify(arg);
    const cached = cache.get(key);
    if (cached !== undefined) return cached;

    const result = await fn(arg);
    cache.set(key, result);
    return result;
  };
}

export function createTTLCache<T>(ttlMs: number) {
  const store = new Map<string, CacheEntry<T>>();

  return {
    set(key: string, value: T): void {
      store.set(key, { value, timestamp: Date.now() });
    },
    get(key: string): T | null {
      const entry = store.get(key);
      if (!entry) return null;
      if (Date.now() - entry.timestamp > ttlMs) {
        store.delete(key);
        return null;
      }
      return entry.value;
    },
    has(key: string): boolean {
      return this.get(key) !== null;
    },
    clear(): void {
      store.clear();
    },
  };
}
