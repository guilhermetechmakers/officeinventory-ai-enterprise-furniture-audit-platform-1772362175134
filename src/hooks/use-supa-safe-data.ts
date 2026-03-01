/**
 * Null/undefined guards for Supabase and API data.
 * Use these helpers to safely access potentially missing data.
 */

/** Safely get array from response - always returns array */
export function safeArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : []
}

/** Safely get number with fallback */
export function safeNumber(value: number | null | undefined, fallback = 0): number {
  return typeof value === 'number' && !Number.isNaN(value) ? value : fallback
}

/** Safely get string with fallback */
export function safeString(value: string | null | undefined, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

/** Safely access nested property */
export function safeGet<T, K extends keyof T>(obj: T | null | undefined, key: K): T[K] | undefined {
  return obj?.[key]
}
