/**
 * Validation helpers for API responses and runtime safety.
 */

/** Check if value is a non-empty array */
export function isArrayResponse<T>(value: unknown): value is T[] {
  return Array.isArray(value)
}

/** Coalesce to default when value is null/undefined */
export function coalesce<T>(value: T | null | undefined, fallback: T): T {
  return value ?? fallback
}

/** Extract items from API response with validation */
export function extractItems<T>(response: { data?: unknown } | null | undefined): T[] {
  const data = response?.data
  return Array.isArray(data) ? (data as T[]) : []
}

/** Ensure value is an array; returns [] if null/undefined/non-array */
export function ensureArray<T>(value: unknown): T[] {
  if (value == null) return []
  return Array.isArray(value) ? (value as T[]) : []
}
