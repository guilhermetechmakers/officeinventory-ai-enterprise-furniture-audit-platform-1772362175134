/**
 * ActivityLog - Recent merge actions with Undo option
 */

import { Undo2, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ensureArray } from '@/lib/safe-array'
import type { LogEntry } from '@/types/merge'

export interface MergeActivityLogProps {
  logs: LogEntry[]
  onUndo: (mergeId: string) => void
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

export function MergeActivityLog({
  logs,
  onUndo,
  maxItems = 10,
  className,
}: MergeActivityLogProps) {
  const list = ensureArray(logs).slice(0, maxItems)

  return (
    <Card
      className={cn(
        'rounded-2xl border border-border bg-secondary shadow-card',
        className
      )}
    >
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
          <Clock className="h-4 w-4 text-muted-foreground" />
          Activity Log
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Recent merge actions
        </p>
      </CardHeader>
      <CardContent>
        {list.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-12 text-center"
            role="status"
          >
            <Clock className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-foreground">No merge activity yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Merged items will appear here
            </p>
          </div>
        ) : (
          <ul className="space-y-3" role="list">
            {list.map((entry) => {
              const mergeId = entry?.mergeId
              const itemsAffected = ensureArray(entry?.itemsAffected)

              return (
                <li
                  key={entry?.id ?? ''}
                  className="flex items-start gap-3 rounded-xl border border-border/50 p-3 transition-colors hover:bg-muted/30"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {entry?.action ?? 'Merge'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {entry?.userId ?? 'Unknown'} · {formatTimestamp(entry?.timestamp)}
                    </p>
                    {entry?.note && (
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        {entry.note}
                      </p>
                    )}
                    {itemsAffected.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Items: {itemsAffected.slice(0, 3).join(', ')}
                        {itemsAffected.length > 3 ? ` +${itemsAffected.length - 3}` : ''}
                      </p>
                    )}
                    {mergeId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-8 rounded-full text-xs"
                        onClick={() => onUndo(mergeId)}
                        aria-label={`Undo merge ${mergeId}`}
                      >
                        <Undo2 className="h-3 w-3 mr-1" />
                        Undo Merge
                      </Button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
