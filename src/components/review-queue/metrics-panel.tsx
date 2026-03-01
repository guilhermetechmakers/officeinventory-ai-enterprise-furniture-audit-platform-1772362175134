/**
 * MetricsPanel - Items per hour, avg review time, total reviewed
 */

import { AlertTriangle, Copy, User, Clock, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReviewQueueMetrics } from '@/types/review-queue'

export interface MetricsPanelProps {
  metrics: ReviewQueueMetrics
  isLoading?: boolean
  className?: string
}

export function MetricsPanel({ metrics, isLoading = false, className }: MetricsPanelProps) {
  const itemsPerHour = metrics?.itemsPerHour ?? 0
  const avgReviewTime = metrics?.avgReviewTimeMinutes ?? 0
  const totalReviewed = metrics?.totalReviewed ?? 0
  const lowConfidence = metrics?.lowConfidenceCount ?? 0
  const exceptions = metrics?.exceptionsCount ?? 0
  const duplicates = metrics?.duplicatesCount ?? 0
  const assignedToMe = metrics?.assignedToMeCount ?? 0

  const cards = [
    {
      label: 'Items / Hour',
      value: itemsPerHour.toFixed(1),
      icon: TrendingUp,
      className: 'text-primary',
    },
    {
      label: 'Avg Review Time',
      value: `${avgReviewTime.toFixed(1)} min`,
      icon: Clock,
      className: 'text-info',
    },
    {
      label: 'Total Reviewed',
      value: String(totalReviewed),
      icon: TrendingUp,
      className: 'text-foreground',
    },
    {
      label: 'Low Confidence',
      value: String(lowConfidence),
      icon: AlertTriangle,
      className: 'text-warning',
    },
    {
      label: 'Exceptions',
      value: String(exceptions),
      icon: AlertTriangle,
      className: 'text-destructive',
    },
    {
      label: 'Duplicates',
      value: String(duplicates),
      icon: Copy,
      className: 'text-info',
    },
    {
      label: 'Assigned to Me',
      value: String(assignedToMe),
      icon: User,
      className: 'text-primary',
    },
  ]

  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-[rgb(var(--primary-foreground))] p-4 text-white shadow-card',
        className
      )}
      role="region"
      aria-label="Review productivity metrics"
    >
      <h3 className="text-sm font-semibold mb-4">Productivity</h3>
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-12 rounded-xl shimmer animate-pulse"
              aria-hidden
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {cards.map((card) => (
            <div
              key={card.label}
              className="flex items-center justify-between gap-2 rounded-xl bg-white/10 px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <card.icon className={cn('h-4 w-4 shrink-0', card.className)} aria-hidden />
                <span className="text-xs font-medium text-white/90">{card.label}</span>
              </div>
              <span className="text-sm font-bold tabular-nums">{card.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
