/**
 * Safe array helpers - guards against null/undefined to prevent runtime crashes.
 * Use (items ?? []).map(...) or these helpers when iterating over API/DB results.
 */

/** Safely map over an array; returns [] if input is null/undefined/non-array */
export function safeMap<T, U>(
  items: T[] | null | undefined,
  fn: (item: T, index: number) => U
): U[] {
  const arr = Array.isArray(items) ? items : []
  return arr.map(fn)
}

/** Safely filter an array; returns [] if input is null/undefined/non-array */
export function safeFilter<T>(
  items: T[] | null | undefined,
  fn: (item: T, index: number) => boolean
): T[] {
  const arr = Array.isArray(items) ? items : []
  return arr.filter(fn)
}

/** Safely reduce an array; returns initialValue if input is null/undefined/non-array */
export function safeReduce<T, U>(
  items: T[] | null | undefined,
  fn: (acc: U, item: T, index: number) => U,
  initialValue: U
): U {
  const arr = Array.isArray(items) ? items : []
  return arr.reduce(fn, initialValue)
}

/** Coerce to array; returns [] if input is null/undefined, wraps single value in array */
export function toArray<T>(value: T[] | T | null | undefined): T[] {
  if (value == null) return []
  return Array.isArray(value) ? value : [value]
}
