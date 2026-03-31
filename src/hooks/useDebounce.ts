import { useState, useEffect } from 'react';

/**
 * Debounces a value by the specified delay in milliseconds.
 * Useful for delaying search/filter operations until the user stops typing.
 *
 * @param value - The value to debounce
 * @param delayMs - Delay in milliseconds (default: 300)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
