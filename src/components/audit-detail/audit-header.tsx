/**
 * AuditHeader - Displays audit name, context chips, owner, status, and date range
 */

import { MapPin, User, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { AuditDetail } from '@/types/audit-detail'

interface AuditHeaderProps {
  audit: AuditDetail | null
  className?: string
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return '—'
  }
}

function getStatusVariant(status: string | null | undefined): 'success' | 'info' | 'secondary' | 'warning' {
  switch (status) {
    case 'complete':
      return 'success'
    case 'in-progress':
      return 'info'
    case 'archived':
      return 'warning'
    default:
      return 'secondary'
  }
}

function formatStatusDisplay(status: string | null | undefined): string {
  if (!status) return 'Draft'
  const map: Record<string, string> = {
    complete: 'Complete',
    'in-progress': 'In Progress',
    archived: 'Archived',
    draft: 'Draft',
  }
  return map[status] ?? status.charAt(0).toUpperCase() + status.slice(1)
}

export function AuditHeader({ audit, className }: AuditHeaderProps) {
  if (!audit) return null

  const location = audit?.location ?? {}
  const chips = [
    location.clientName,
    location.siteName,
    location.floorName ?? location.zoneName,
    location.roomName,
  ].filter(Boolean) as string[]

  return (
    <header className={cn('space-y-4', className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            {audit?.name ?? 'Unnamed Audit'}
          </h1>
          <div className="flex flex-wrap gap-2" role="list" aria-label="Location context">
            {chips.map((chip, idx) => (
              <span
                key={`${chip}-${idx}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-muted/50 px-3 py-1 text-sm text-muted-foreground"
                role="listitem"
              >
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                {chip}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" aria-hidden />
            {audit?.ownerName ?? 'Unknown'}
          </span>
          <Badge variant={getStatusVariant(audit?.status)}>
            {formatStatusDisplay(audit?.status)}
          </Badge>
          <span className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" aria-hidden />
            {formatDate(audit?.startDate)} – {formatDate(audit?.endDate)}
          </span>
        </div>
      </div>
    </header>
  )
}
