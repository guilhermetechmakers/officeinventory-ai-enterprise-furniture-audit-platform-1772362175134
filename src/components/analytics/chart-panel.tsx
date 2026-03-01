/**
 * ChartPanel - Generic chart wrapper with null-safe data validation
 */

import type { ReactNode } from 'react'
import { BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ChartPanelProps {
  children: ReactNode
  isEmpty?: boolean
  isLoading?: boolean
  className?: string
  'data-chart-id'?: string
}

export function ChartPanel({
  children,
  isEmpty = false,
  isLoading = false,
  className,
  'data-chart-id': chartId,
}: ChartPanelProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          'flex min-h-[240px] items-center justify-center rounded-xl bg-muted/30',
          className
        )}
        role="status"
        aria-label="Loading chart"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div
        className={cn(
          'flex min-h-[240px] flex-col items-center justify-center gap-2 rounded-xl bg-muted/20 p-6',
          className
        )}
        role="status"
        aria-label="No data"
      >
        <BarChart3 className="h-12 w-12 text-muted-foreground/50" aria-hidden />
        <p className="text-sm text-muted-foreground">No data available</p>
      </div>
    )
  }

  return (
    <div
      className={cn('min-h-[240px]', className)}
      data-chart-id={chartId}
    >
      {children}
    </div>
  )
}
