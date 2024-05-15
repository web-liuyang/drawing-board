export function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number = 500,
  immediate: boolean = false,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null;
  return function debounced(this: unknown, ...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout as ReturnType<typeof setTimeout>);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  };
}
