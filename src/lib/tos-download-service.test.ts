/**
 * Unit tests for ToS download service - null safety for sections
 */

import { describe, it, expect } from 'vitest'
import { generateToSExport } from './tos-download-service'

describe('generateToSExport', () => {
  it('returns blob for null sections (uses fallback)', () => {
    const blob = generateToSExport(null)
    expect(blob).toBeInstanceOf(Blob)
    expect(blob.type).toContain('text/plain')
    expect(blob.size).toBeGreaterThan(0)
  })

  it('returns blob for undefined sections (uses fallback)', () => {
    const blob = generateToSExport(undefined)
    expect(blob).toBeInstanceOf(Blob)
    expect(blob.size).toBeGreaterThan(0)
  })

  it('returns blob for empty array', () => {
    const blob = generateToSExport([])
    expect(blob).toBeInstanceOf(Blob)
    expect(blob.size).toBeGreaterThan(0)
  })

  it('includes section content when given valid sections', () => {
    const sections = [
      { id: 'intro', title: 'Introduction', body: 'Test body.', subsections: [] },
    ]
    const blob = generateToSExport(sections)
    expect(blob.size).toBeGreaterThan(50)
    expect(blob.type).toContain('text/plain')
  })
})
