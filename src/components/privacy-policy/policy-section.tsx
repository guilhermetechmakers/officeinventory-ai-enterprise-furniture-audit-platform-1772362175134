/**
 * PolicySection - Reusable component for a policy section with title, body, and optional subsections.
 * Renders semantic HTML for accessibility.
 */

import { cn } from '@/lib/utils'
import type { PolicySection as PolicySectionType } from '@/types/privacy-policy'

export interface PolicySectionProps {
  section: PolicySectionType
  level?: 'h2' | 'h3'
  className?: string
  /** Optional search highlight - text to highlight in body */
  searchQuery?: string
}

/** Escape HTML to prevent XSS when rendering user content */
function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

/** Highlight search matches in text (returns safe HTML string) */
function highlightMatch(text: string, query: string): string {
  if (!query?.trim()) return escapeHtml(text)
  const escaped = escapeHtml(text)
  const regex = new RegExp(`(${escapeRegex(query.trim())})`, 'gi')
  return escaped.replace(regex, '<mark class="bg-primary/30 text-foreground rounded px-0.5">$1</mark>')
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function PolicySection({
  section,
  level = 'h2',
  className,
  searchQuery,
}: PolicySectionProps) {
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
          __html: highlightMatch(section.body, searchQuery ?? ''),
        }}
      />
      {subsections.length > 0 && (
        <div className="mt-4 pl-4 border-l-2 border-border space-y-4">
          {(subsections ?? []).map((sub) => (
            <PolicySection
              key={sub.id}
              section={sub}
              level="h3"
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </section>
  )
}
