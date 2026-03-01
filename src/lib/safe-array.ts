/**
 * Safe array utilities - guard against null/undefined
 * CRITICAL: Use these for runtime safety
 */

export function safeMap<T, U>(
  items: T[] | null | undefined,
  fn: (item: T, index: number) => U
): U[] {
  return Array.isArray(items) ? items.map(fn) : []
}

export function safeFilter<T>(
  items: T[] | null | undefined,
  predicate: (item: T, index: number) => boolean
): T[] {
  return Array.isArray(items) ? items.filter(predicate) : []
}

export function safeReduce<T, U>(
  items: T[] | null | undefined,
  reducer: (acc: U, item: T, index: number) => U,
  initial: U
): U {
  return Array.isArray(items) ? items.reduce(reducer, initial) : initial
}

export function ensureArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : []
}

/** Alias for ensureArray - use ensureArray for consistency */
export const toSafeArray = ensureArray

/**
 * SafeArrayUtils - guard against non-arrays
 * Use ensureArray(input) -> Array for runtime safety
 */
export const SafeArrayUtils = {
  ensureArray,
  safeMap: <T, U>(
    items: T[] | null | undefined,
    fn: (item: T, index: number) => U
  ): U[] => (Array.isArray(items) ? items.map(fn) : []),
  safeFilter: <T>(
    items: T[] | null | undefined,
    predicate: (item: T, index: number) => boolean
  ): T[] => (Array.isArray(items) ? items.filter(predicate) : []),
}
