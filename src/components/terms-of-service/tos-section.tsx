/**
 * ToSSection - Reusable component for a ToS section with title, body, and optional subsections.
 * Renders semantic HTML for accessibility.
 */

import { cn } from '@/lib/utils'
import type { ToSSection as ToSSectionType } from '@/types/terms-of-service'

export interface ToSSectionProps {
  section: ToSSectionType
  level?: 'h2' | 'h3'
  className?: string
}

/** Escape HTML to prevent XSS when rendering user content */
function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text ?? ''
  return div.innerHTML
}

/** Safe HTML for body: escape then preserve line breaks */
function safeBodyHtml(body: string): string {
  const escaped = escapeHtml(body ?? '')
  return escaped.replace(/\n/g, '<br />')
}

export function ToSSection({
  section,
  level = 'h2',
  className,
}: ToSSectionProps) {
  const HeadingTag = level
  const subsections = section.subsections ?? []

  return (
    <section
      id={section.id}
      className={cn('scroll-mt-24', className)}
      aria-labelledby={`${section.id}-heading`}
    >
      <HeadingTag
        id={`${section.id}-heading`}
        className="text-xl font-bold text-foreground mb-3"
      >
        {section.title}
      </HeadingTag>
      <div
        className="text-muted-foreground text-base leading-relaxed prose prose-neutral dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{
          __html: safeBodyHtml(section.body),
        }}
      />
      {subsections.length > 0 && (
        <div className="mt-4 pl-4 border-l-2 border-border space-y-4">
          {subsections.map((sub) => (
            <ToSSection
              key={sub.id}
              section={sub}
              level="h3"
              className={className}
            />
          ))}
        </div>
      )}
    </section>
  )
}
