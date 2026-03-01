/**
 * Unit tests for ContentRichTextRenderer - null safety for sections array
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ContentRichTextRenderer } from './content-rich-text-renderer'

describe('ContentRichTextRenderer', () => {
  it('renders empty state for null sections', () => {
    render(<ContentRichTextRenderer sections={null} />)
    expect(screen.getByText('No terms content available.')).toBeInTheDocument()
  })

  it('renders empty state for undefined sections', () => {
    render(<ContentRichTextRenderer sections={undefined} />)
    expect(screen.getByText('No terms content available.')).toBeInTheDocument()
  })

  it('renders empty state for empty array', () => {
    render(<ContentRichTextRenderer sections={[]} />)
    expect(screen.getByText('No terms content available.')).toBeInTheDocument()
  })

  it('renders sections when given valid array', () => {
    const sections = [
      { id: 'intro', title: 'Introduction', body: 'Welcome.', subsections: [] },
    ]
    render(<ContentRichTextRenderer sections={sections} />)
    expect(screen.getByText('Introduction')).toBeInTheDocument()
    expect(screen.getByText('Welcome.')).toBeInTheDocument()
  })
})
