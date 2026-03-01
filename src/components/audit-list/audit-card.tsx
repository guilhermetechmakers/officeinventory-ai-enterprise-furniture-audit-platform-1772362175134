/**
 * AuditCard - Summarized view of an audit with metadata and quick actions
 * Null-safe; treats missing counts as 0
 */

import { Link } from 'react-router-dom'
import {
  ClipboardList,
  ExternalLink,
  Copy,
  Download,
  MapPin,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { Audit, AuditStatus } from '@/types/audit-list'

interface AuditCardProps {
  audit: Audit
  selected?: boolean
  onSelect?: (id: string, checked: boolean) => void
  onClone?: (id: string) => void
  onExport?: (id: string) => void
  selectable?: boolean
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

function getStatusVariant(status: AuditStatus | null | undefined): 'success' | 'info' | 'secondary' | 'warning' {
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

export function AuditCard({
  audit,
  selected = false,
  onSelect,
  onClone,
  onExport,
  selectable = true,
}: AuditCardProps) {
  const itemCount = audit?.itemCount ?? 0
  const lastUpdated = formatDate(audit?.lastUpdated)
  const ownerName = audit?.owner?.name ?? 'Unknown'
  const ownerInitials = ownerName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const siteTag = audit?.siteName ?? audit?.siteId ?? ''
  const zoneTag = audit?.zoneName ?? audit?.floorName ?? ''

  return (
    <Card
      className={cn(
        'group transition-all duration-200 hover:shadow-elevated hover:border-primary/20',
        selected && 'ring-2 ring-primary'
      )}
    >
      <CardContent className="p-6">
        <div className="flex gap-4">
          {selectable && (
            <div className="flex shrink-0 items-start pt-0.5">
              <Checkbox
                checked={selected}
                onCheckedChange={(checked) =>
                  onSelect?.(audit.id, checked === true)
                }
                aria-label={`Select ${audit.name}`}
              />
            </div>
          )}
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/20">
                <ClipboardList className="h-6 w-6 text-primary" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <h3 className="font-semibold text-foreground truncate">
                  {audit?.name ?? 'Unnamed Audit'}
                </h3>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {siteTag && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {siteTag}
                      {zoneTag && ` · ${zoneTag}`}
                    </span>
                  )}
                </div>
              </div>
              <Badge variant={getStatusVariant(audit?.status)}>
                {audit?.status ?? 'draft'}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>{itemCount} items</span>
              <span>Updated {lastUpdated}</span>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {ownerInitials}
                  </AvatarFallback>
                </Avatar>
                <span>{ownerName}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 opacity-0 transition-opacity group-hover:opacity-100">
              <Button variant="outline" size="sm" className="rounded-full" asChild>
                <Link to={`/dashboard/audits/${audit.id}`}>
                  <ExternalLink className="h-4 w-4 mr-1.5" />
                  Open
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => onClone?.(audit.id)}
                aria-label="Clone audit"
              >
                <Copy className="h-4 w-4 mr-1.5" />
                Clone
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => onExport?.(audit.id)}
                aria-label="Export audit"
              >
                <Download className="h-4 w-4 mr-1.5" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
