//Debounce (closure)

export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>): void => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

//Memoize (closure)


export function memoize<TArg, TResult>(
  fn: (arg: TArg) => Promise<TResult>
): (arg: TArg) => Promise<TResult> {
  const cache = new Map<TArg, TResult>();

  return async (arg: TArg): Promise<TResult> => {
    if (cache.has(arg)) {
      return cache.get(arg) as TResult;
    }
    const result = await fn(arg);
    cache.set(arg, result);
    return result;
  };
}