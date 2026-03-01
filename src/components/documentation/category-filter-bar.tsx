/**
 * CategoryFilterBar - Chips for Guides, API, FAQs, Troubleshooting, Release Notes.
 */

import { cn } from '@/lib/utils'
import type { DocCategory } from '@/types/documentation'

const CATEGORY_LABELS: Record<DocCategory, string> = {
  Guides: 'Guides',
  API: 'API',
  FAQs: 'FAQs',
  Troubleshooting: 'Troubleshooting',
  ReleaseNotes: 'Release Notes',
  Contact: 'Contact',
}

const DISPLAY_CATEGORIES: DocCategory[] = [
  'Guides',
  'API',
  'FAQs',
  'Troubleshooting',
  'ReleaseNotes',
]

export interface CategoryFilterBarProps {
  activeCategory: DocCategory | null
  onSelect: (category: DocCategory | null) => void
  className?: string
}

export function CategoryFilterBar({
  activeCategory,
  onSelect,
  className,
}: CategoryFilterBarProps) {
  return (
    <div
      className={cn('flex flex-wrap gap-2', className)}
      role="tablist"
      aria-label="Documentation categories"
    >
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={cn(
          'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          activeCategory === null
            ? 'bg-[rgb(var(--primary-foreground))] text-primary'
            : 'bg-secondary text-muted-foreground hover:bg-muted/50 hover:text-foreground'
        )}
        role="tab"
        aria-selected={activeCategory === null}
      >
        All
      </button>
      {DISPLAY_CATEGORIES.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onSelect(cat)}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            activeCategory === cat
              ? 'bg-[rgb(var(--primary-foreground))] text-primary'
              : 'bg-secondary text-muted-foreground hover:bg-muted/50 hover:text-foreground'
          )}
          role="tab"
          aria-selected={activeCategory === cat}
        >
          {CATEGORY_LABELS[cat]}
        </button>
      ))}
    </div>
  )
}
