/**
 * useSafeState - Initialize and manage array state safely with defaults.
 * Ensures useState<Type[]>([]) for arrays, never useState() or useState(null).
 */
import { useState, useCallback } from 'react'

export function useSafeState<T>(initialValue: T[]): [T[], (value: T[] | ((prev: T[]) => T[])) => void] {
  const [state, setState] = useState<T[]>(initialValue ?? [])

  const setSafeState = useCallback((value: T[] | ((prev: T[]) => T[])) => {
    setState((prev) => {
      const next = typeof value === 'function' ? value(prev ?? []) : value
      return Array.isArray(next) ? next : []
    })
  }, [])

  return [state ?? [], setSafeState]
}
