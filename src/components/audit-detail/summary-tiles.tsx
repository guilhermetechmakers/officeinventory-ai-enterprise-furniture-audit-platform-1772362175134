/**
 * SummaryTiles - Reusable tile component displaying a metric and label
 * Center-aligned numeric metrics with descriptive labels
 */

import { cn } from '@/lib/utils'

interface SummaryTileProps {
  label: string
  value: number
  tooltip?: string
  variant?: 'default' | 'warning' | 'success' | 'info'
  className?: string
}

const variantStyles = {
  default: 'bg-card border-border shadow-card hover:shadow-elevated',
  warning: 'bg-warning/10 border-warning/30 shadow-card hover:shadow-elevated',
  success: 'bg-primary/10 border-primary/30 shadow-card hover:shadow-elevated',
  info: 'bg-info/10 border-info/30 shadow-card hover:shadow-elevated',
}

export function SummaryTile({
  label,
  value,
  tooltip,
  variant = 'default',
  className,
}: SummaryTileProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border p-6 shadow-card transition-all duration-200 hover:shadow-elevated',
        variantStyles[variant],
        className
      )}
      title={tooltip}
      role="figure"
      aria-label={`${label}: ${value}`}
    >
      <span className="text-3xl font-bold text-foreground tabular-nums">
        {value}
      </span>
      <span className="mt-1 text-sm font-medium text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

interface SummaryTilesProps {
  totalItems: number
  lowConfidenceCount: number
  exceptionsCount: number
  duplicatesCount: number
  className?: string
}

export function SummaryTiles({
  totalItems,
  lowConfidenceCount,
  exceptionsCount,
  duplicatesCount,
  className,
}: SummaryTilesProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-4 sm:grid-cols-4',
        className
      )}
      role="group"
      aria-label="Audit summary metrics"
    >
      <SummaryTile
        label="Total Items"
        value={totalItems}
        tooltip="Total number of detected furniture items in this audit"
      />
      <SummaryTile
        label="Low Confidence"
        value={lowConfidenceCount}
        tooltip="Items with confidence below 50% — recommended for review"
        variant="warning"
      />
      <SummaryTile
        label="Exceptions"
        value={exceptionsCount}
        tooltip="Items flagged as exceptions requiring attention"
        variant={exceptionsCount > 0 ? 'warning' : 'default'}
      />
      <SummaryTile
        label="Duplicates"
        value={duplicatesCount}
        tooltip="Potential duplicate detections — consider merging"
        variant={duplicatesCount > 0 ? 'info' : 'default'}
      />
    </div>
  )
}
