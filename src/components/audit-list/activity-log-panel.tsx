/**
 * ActivityLogPanel - Recent actions on audit or site for traceability
 * Null-safe; displays activity entries with timestamps
 */

import { Clock, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ActivityLog } from '@/types/audit-list'

function safeArray<T>(arr: T[] | null | undefined): T[] {
  return Array.isArray(arr) ? arr : []
}

function formatTimestamp(ts: string | null | undefined): string {
  if (!ts) return '—'
  try {
    const d = new Date(ts)
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return '—'
  }
}

interface ActivityLogPanelProps {
  entries: ActivityLog[]
  maxItems?: number
}

export function ActivityLogPanel({
  entries,
  maxItems = 10,
}: ActivityLogPanelProps) {
  const list = safeArray(entries).slice(0, maxItems)

  if (list.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No recent activity</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
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
              key={entry.id}
              className="flex items-start gap-3 rounded-xl border border-border/50 p-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {entry.action ?? 'Action'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {entry.userName ?? 'Unknown'} · {formatTimestamp(entry.timestamp)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
