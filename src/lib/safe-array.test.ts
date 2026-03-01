/**
 * Unit tests for safe array operations - runtime safety guards
 */

import { describe, it, expect } from 'vitest'
import {
  ensureArray,
  safeMap,
  safeFilter,
  safeReduce,
} from './safe-array'

describe('ensureArray', () => {
  it('returns empty array for null', () => {
    expect(ensureArray(null)).toEqual([])
  })

  it('returns empty array for undefined', () => {
    expect(ensureArray(undefined)).toEqual([])
  })

  it('returns the array when given valid array', () => {
    const arr = [1, 2, 3]
    expect(ensureArray(arr)).toBe(arr)
  })

  it('returns empty array for non-array values', () => {
    expect(ensureArray('string' as unknown as number[])).toEqual([])
    expect(ensureArray(42 as unknown as number[])).toEqual([])
    expect(ensureArray({} as unknown as number[])).toEqual([])
  })
})

describe('safeMap', () => {
  it('returns empty array for null', () => {
    expect(safeMap<number, number>(null, (x) => x * 2)).toEqual([])
  })

  it('returns empty array for undefined', () => {
    expect(safeMap<number, number>(undefined, (x) => x * 2)).toEqual([])
  })

  it('maps array elements correctly', () => {
    expect(safeMap([1, 2, 3], (x: number) => x * 2)).toEqual([2, 4, 6])
  })

  it('passes index to mapper', () => {
    expect(safeMap<string, string>(['a', 'b'], (x, i) => `${i}:${x}`)).toEqual(['0:a', '1:b'])
  })
})

describe('safeFilter', () => {
  it('returns empty array for null', () => {
    expect(safeFilter(null, () => true)).toEqual([])
  })

  it('filters array elements correctly', () => {
    expect(safeFilter([1, 2, 3, 4], (x) => x % 2 === 0)).toEqual([2, 4])
  })
})

describe('safeReduce', () => {
  it('returns initial value for null', () => {
    expect(safeReduce<number, number>(null, (acc, x) => acc + x, 0)).toBe(0)
  })

  it('reduces array correctly', () => {
    expect(safeReduce([1, 2, 3], (acc: number, x: number) => acc + x, 0)).toBe(6)
  })
})
