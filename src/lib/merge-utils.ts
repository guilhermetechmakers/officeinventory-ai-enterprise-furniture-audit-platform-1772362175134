/**
 * Merge & Duplicate Resolution utilities
 * Data normalization and conflict resolution helpers
 * CRITICAL: All functions guard against null/undefined
 */

import { ensureArray } from '@/lib/safe-array'

/** Produce canonical form with defaults for attributes */
export function normalizeAttributes(
  input: Record<string, unknown> | null | undefined,
  defaults: Record<string, unknown> = {}
): Record<string, unknown> {
  const safe = input && typeof input === 'object' ? input : {}
  const result = { ...defaults }
  for (const [key, val] of Object.entries(safe)) {
    if (val !== undefined && val !== null) {
      result[key] = val
    }
  }
  return result
}

/** Suggested resolutions when values conflict */
export function resolveConflicts(
  existingValue: unknown,
  incomingValue: unknown
): { suggested: unknown; hasConflict: boolean } {
  if (existingValue === incomingValue) {
    return { suggested: existingValue, hasConflict: false }
  }
  const existingStr = String(existingValue ?? '').trim()
  const incomingStr = String(incomingValue ?? '').trim()
  if (!existingStr) return { suggested: incomingValue, hasConflict: false }
  if (!incomingStr) return { suggested: existingValue, hasConflict: false }
  return {
    suggested: existingValue,
    hasConflict: true,
  }
}

/** Safe data fetcher - returns data ?? [] and robust null checks */
export function safeDataFetcher<T>(
  data: T[] | null | undefined
): T[] {
  return ensureArray(data)
}
