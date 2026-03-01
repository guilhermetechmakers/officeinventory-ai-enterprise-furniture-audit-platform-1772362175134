/**
 * ContentRichTextRenderer - Safe rendering for formatted ToS content.
 * Converts sections into structured layout. Null-safe for API responses.
 */

import { ToSSection } from './tos-section'
import type { ToSSection as ToSSectionType } from '@/types/terms-of-service'

export interface ContentRichTextRendererProps {
  sections: ToSSectionType[] | null | undefined
  className?: string
}

export function ContentRichTextRenderer({
  sections,
  className,
}: ContentRichTextRendererProps) {
  const safeSections = Array.isArray(sections) ? sections : []

  if (safeSections.length === 0) {
    return (
      <p className="text-muted-foreground py-8" role="status">
        No terms content available.
      </p>
    )
  }

  return (
    <div className={className ?? 'space-y-8'} role="article">
      {safeSections.map((section) => (
        <ToSSection key={section.id} section={section} level="h2" />
      ))}
    </div>
  )
}
