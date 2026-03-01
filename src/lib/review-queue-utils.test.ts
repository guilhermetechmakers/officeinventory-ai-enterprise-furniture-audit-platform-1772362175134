/**
 * Unit tests for safe data handling, sanitizeItem, formatConfidence, toDateString
 */

import { describe, it, expect } from 'vitest'
import {
  formatConfidence,
  toDateString,
  sanitizeItem,
  ensureArray,
  safeMap,
} from './review-queue-utils'

describe('formatConfidence', () => {
  it('formats 0-1 scale as percentage', () => {
    expect(formatConfidence(0.62)).toBe('62%')
    expect(formatConfidence(0.5)).toBe('50%')
  })

  it('formats 0-100 scale as percentage', () => {
    expect(formatConfidence(85)).toBe('85%')
  })

  it('handles null/undefined', () => {
    expect(formatConfidence(null)).toBe('0%')
    expect(formatConfidence(undefined)).toBe('0%')
  })
})

describe('toDateString', () => {
  it('formats valid ISO date', () => {
    const result = toDateString('2025-02-28T10:00:00Z')
    expect(result).toMatch(/Feb/)
    expect(result).toMatch(/2025/)
  })

  it('returns empty string for null/undefined', () => {
    expect(toDateString(null)).toBe('')
    expect(toDateString(undefined)).toBe('')
  })

  it('returns empty string for invalid date', () => {
    expect(toDateString('invalid')).toBe('')
  })
})

describe('sanitizeItem', () => {
  it('returns safe defaults for null', () => {
    const result = sanitizeItem(null)
    expect(result).toMatchObject({
      id: '',
      aiItemId: '',
      type: 'Unknown',
      attributes: {},
      confidence: 0,
      status: 'lowConfidence',
    })
    expect(result.siteContext).toBeDefined()
    expect(result.siteContext?.clientId).toBe('')
  })

  it('returns safe defaults for undefined', () => {
    const result = sanitizeItem(undefined)
    expect(result.id).toBe('')
    expect(result.type).toBe('Unknown')
  })

  it('sanitizes partial item', () => {
    const result = sanitizeItem({
      id: 'x',
      type: 'Desk',
    } as any)
    expect(result.id).toBe('x')
    expect(result.type).toBe('Desk')
    expect(result.confidence).toBe(0)
    expect(result.attributes).toEqual({})
  })

  it('ensures evidenceUrls is array', () => {
    const result = sanitizeItem({
      id: 'x',
      evidenceUrls: null,
    } as any)
    expect(Array.isArray(result.evidenceUrls)).toBe(true)
    expect(result.evidenceUrls).toEqual([])
  })

  it('preserves valid item', () => {
    const item = {
      id: 'rq-1',
      aiItemId: 'ai-1',
      type: 'Desk',
      attributes: { material: 'Wood' },
      confidence: 0.8,
      siteContext: { location: 'Floor 2' },
      status: 'lowConfidence' as const,
      createdAt: '2025-02-28',
      updatedAt: '2025-02-28',
    }
    const result = sanitizeItem(item as any)
    expect(result.id).toBe('rq-1')
    expect(result.confidence).toBe(0.8)
    expect(result.siteContext?.location).toBe('Floor 2')
  })
})

describe('ensureArray re-export', () => {
  it('works', () => {
    expect(ensureArray([1, 2])).toEqual([1, 2])
    expect(ensureArray(null)).toEqual([])
  })
})

describe('safeMap re-export', () => {
  it('works', () => {
    expect(safeMap([1, 2], (x) => x * 2)).toEqual([2, 4])
  })
})
