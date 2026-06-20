import type { CacheEntry } from "./types";

export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>): void => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function memoize<TArg, TResult>(
  fn: (arg: TArg) => Promise<TResult>
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

export class TTLCache<T extends object> {
  private store = new Map<string, CacheEntry<T>>();
  private ttlMs: number;

  constructor(ttlMs: number) {
    this.ttlMs = ttlMs;
  }

  public set(key: string, value: T): void {
    this.store.set(key, { value, timestamp: Date.now() });
  }

  public get(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  public has(key: string): boolean {
    return this.get(key) !== null;
  }

  public clear(): void {
    this.store.clear();
  }
}