export function throttle(fn: Function, ms: number) {
  let timeout: Nullable<number> = null;

  return function (...args: unknown[]) {
    if (timeout) {
      return;
    }

    fn(...args);
    timeout = setTimeout(() => {
      clearTimeout(timeout!);
      timeout = null;
    }, ms);
  };
}