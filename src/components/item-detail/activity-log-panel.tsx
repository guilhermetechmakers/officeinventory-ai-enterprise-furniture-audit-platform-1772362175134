/**
 * ActivityLogPanel - Read-only timeline showing who changed what and when
 * Displays diffs of changed attributes when available
 */

import { Clock, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ensureArray } from '@/lib/safe-array'
import type { ActivityLogEntry } from '@/types/item-detail'

export interface ActivityLogPanelProps {
  entries: ActivityLogEntry[]
  maxItems?: number
  className?: string
}

function formatTimestamp(ts: string | null | undefined): string {
  if (!ts) return '—'
  try {
    return new Date(ts).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return '—'
  }
}

function renderChanges(changes: Record<string, unknown> | undefined): React.ReactNode {
  if (!changes || typeof changes !== 'object') return null
  const entries = Object.entries(changes)
  if (entries.length === 0) return null
  return (
    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
      {entries.map(([key, val]) => {
        const v = val as Record<string, unknown> | string | number | undefined
        if (v && typeof v === 'object' && ('from' in v || 'to' in v)) {
          const from = (v as { from?: unknown }).from
          const to = (v as { to?: unknown }).to
          return (
            <li key={key}>
              <span className="font-medium">{key}:</span>{' '}
              {from != null ? String(from) : '—'} → {to != null ? String(to) : '—'}
            </li>
          )
        }
        return (
          <li key={key}>
            <span className="font-medium">{key}:</span> {String(v ?? '')}
          </li>
        )
      })}
    </ul>
  )
}

export function ActivityLogPanel({
  entries,
  maxItems = 20,
  className,
}: ActivityLogPanelProps) {
  const list = ensureArray(entries).slice(0, maxItems)

  if (list.length === 0) {
    return (
      <Card className={cn('rounded-2xl', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No activity yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('rounded-2xl', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4 text-muted-foreground" />
          Activity Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3" role="list">
          {list.map((entry) => (
            <li
              key={entry?.id ?? ''}
              className="flex items-start gap-3 rounded-xl border border-border/50 p-3 transition-colors hover:bg-muted/30"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {entry?.action ?? 'Action'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {entry?.actor ?? 'Unknown'} · {formatTimestamp(entry?.timestamp)}
                </p>
                {entry?.changes && renderChanges(entry.changes)}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
