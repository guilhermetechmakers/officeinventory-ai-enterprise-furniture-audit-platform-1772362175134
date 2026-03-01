/**
 * VersionBadge - Small UI element showing policy version and last updated timestamp.
 * Used for audit and compliance traceability.
 */

import { Calendar, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface VersionBadgeProps {
  version: string
  lastUpdated: string
  reviewer?: string
  className?: string
}

/** Format ISO or short date for display */
function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    if (Number.isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export function VersionBadge({
  version,
  lastUpdated,
  reviewer,
  className,
}: VersionBadgeProps) {
  const formatted = formatDate(lastUpdated)
  return (
    <div
      role="group"
      aria-label="Policy version and audit information"
      className={cn(
        'flex flex-wrap items-center gap-4 text-sm text-muted-foreground',
        className
      )}
    >
      <span className="flex items-center gap-2" title="Policy version">
        <FileText className="h-4 w-4" aria-hidden />
        <span>v{version}</span>
      </span>
      <span className="flex items-center gap-2" title="Last updated">
        <Calendar className="h-4 w-4" aria-hidden />
        <time dateTime={lastUpdated}>{formatted}</time>
      </span>
      {reviewer && (
        <span className="text-muted-foreground/80">Reviewed by {reviewer}</span>
      )}
    </div>
  )
}
