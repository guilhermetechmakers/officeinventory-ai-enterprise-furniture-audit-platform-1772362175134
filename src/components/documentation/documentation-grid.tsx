/**
 * DocumentationGrid - Grid of DocumentationCard items with pagination.
 */

import { DocumentationCard } from './documentation-card'
import { DocumentationGridSkeleton } from './documentation-skeleton'
import { cn } from '@/lib/utils'
import type { Document } from '@/types/documentation'

export interface DocumentationGridProps {
  documents: Document[]
  isLoading?: boolean
  emptyMessage?: string
  emptyAction?: React.ReactNode
  className?: string
}

export function DocumentationGrid({
  documents,
  isLoading = false,
  emptyMessage = 'No documents found. Try a different search or category.',
  emptyAction,
  className,
}: DocumentationGridProps) {
  const safeDocs = documents ?? []
  const hasDocs = safeDocs.length > 0

  if (isLoading) {
    return <DocumentationGridSkeleton className={className} />
  }

  if (!hasDocs) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 py-16 px-6',
          className
        )}
      >
        <p className="text-muted-foreground text-center mb-4">{emptyMessage}</p>
        {emptyAction}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in',
        className
      )}
    >
      {safeDocs.map((doc) => (
        <DocumentationCard key={doc.id} document={doc} />
      ))}
    </div>
  )
}
