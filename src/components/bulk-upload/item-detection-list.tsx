import { cn } from '@/lib/utils'
import type { Item } from '@/types/bulk-upload'

export interface ItemDetectionListProps {
  items?: Item[] | null
  className?: string
}

export function ItemDetectionList({ items, className }: ItemDetectionListProps) {
  const safeItems = Array.isArray(items) ? items : []

  if (safeItems.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No detections in this batch yet</p>
    )
  }

  return (
    <div
      className={cn('space-y-3', className)}
      role="list"
      aria-label="Item detections"
    >
      {safeItems.map((item, idx) => (
        <div
          key={item?.id ?? `item-${idx}`}
          className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-elevated"
          role="listitem"
        >
          {(item.evidenceUrl ?? item.imageUrl) ? (
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
              <img
                src={item.evidenceUrl ?? item.imageUrl}
                alt={`Evidence for ${item.type}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="h-14 w-14 shrink-0 rounded-lg border border-border bg-muted" aria-hidden />
          )}
          <div className="min-w-0 flex-1">
            <p className="font-medium text-foreground">{item?.type ?? 'Unknown'}</p>
            <p className="text-sm text-muted-foreground">
              Confidence: {Math.round((item.confidence ?? 0) * 100)}%
            </p>
          </div>
          <div
            className={cn(
              'rounded-full px-2.5 py-0.5 text-xs font-medium',
              (item.confidence ?? 0) >= 0.9
                ? 'bg-primary/20 text-primary-foreground'
                : (item.confidence ?? 0) >= 0.7
                  ? 'bg-info/20 text-foreground'
                  : 'bg-warning/20 text-foreground'
            )}
          >
            {Math.round((item.confidence ?? 0) * 100)}%
          </div>
        </div>
      ))}
    </div>
  )
}
