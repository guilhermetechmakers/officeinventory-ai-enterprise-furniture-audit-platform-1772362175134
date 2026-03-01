import { ChevronRight, RefreshCw, XCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from './status-badge'
import { ProgressBar } from './progress-bar'
import { cn } from '@/lib/utils'
import type { Batch, BatchStatus } from '@/types/bulk-upload'

interface BatchCardProps {
  batch: Batch
  onViewDetails: (batch: Batch) => void
  onRetry?: (batch: Batch) => void
  onCancel?: (batch: Batch) => void
  isRetrying?: boolean
  isCancelling?: boolean
}

export function BatchCard({
  batch,
  onViewDetails,
  onRetry,
  onCancel,
  isRetrying = false,
  isCancelling = false,
}: BatchCardProps) {
  const b = batch ?? {}
  const canRetry = (b.status ?? '') === 'failed'
  const canCancel =
    (b.status ?? '') === 'processing' || (b.status ?? '') === 'pending'
  const formattedDate = b.uploadedAt
    ? new Date(b.uploadedAt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : '—'

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200',
        'hover:shadow-elevated hover:border-primary/30 hover:scale-[1.01] active:scale-[0.99]',
        'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'
      )}
      onClick={() => onViewDetails(batch)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onViewDetails(batch)
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View details for batch ${b.name ?? 'Unknown'}`}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-foreground truncate">
                {b.name ?? 'Unnamed batch'}
              </h3>
              <StatusBadge status={(b.status ?? 'pending') as BatchStatus} />
            </div>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>{b.site ?? '—'}</span>
              <span>{b.uploader ?? '—'}</span>
              <span>{formattedDate}</span>
            </div>
            <div className="mt-3 max-w-xs">
              <ProgressBar value={b.progress ?? 0} showLabel />
            </div>
          </div>

          <div
            className="flex items-center gap-2 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {canRetry && onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onRetry(batch)
                }}
                disabled={isRetrying}
                className="rounded-full"
                aria-label={`Retry batch ${b.name ?? ''}`}
              >
                <RefreshCw
                  className={cn('h-4 w-4', isRetrying && 'animate-spin')}
                />
                Retry
              </Button>
            )}
            {canCancel && onCancel && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onCancel(batch)
                }}
                disabled={isCancelling}
                className="rounded-full text-destructive hover:text-destructive"
                aria-label={`Cancel batch ${b.name ?? ''}`}
              >
                <XCircle className="h-4 w-4" />
                Cancel
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => {
                e.stopPropagation()
                onViewDetails(batch)
              }}
              aria-label={`Open details for ${b.name ?? ''}`}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
