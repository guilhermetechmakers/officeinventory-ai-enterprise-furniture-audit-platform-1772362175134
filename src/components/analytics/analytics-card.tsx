/**
 * AnalyticsCard - Metric card with chart, value, subtitle, and export
 */

import { useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExportButton } from './export-button'
import { cn } from '@/lib/utils'

export interface AnalyticsCardProps {
  title: string
  value: string | number
  subtitle?: string
  chartId?: string
  exportable?: boolean
  exportData?: Record<string, unknown>[]
  exportHeaders?: string[]
  exportFilename?: string
  children?: React.ReactNode
  className?: string
}

export function AnalyticsCard({
  title,
  value,
  subtitle,
  chartId,
  exportable = true,
  exportData = [],
  exportHeaders,
  exportFilename,
  children,
  className,
}: AnalyticsCardProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  return (
    <Card
      className={cn(
        'rounded-2xl border border-border shadow-card transition-all duration-300 hover:shadow-elevated',
        className
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-bold">{title}</CardTitle>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
        {exportable && (
          <ExportButton
            chartId={chartId}
            chartRef={chartRef}
            data={exportData}
            headers={exportHeaders}
            filename={exportFilename ?? title.toLowerCase().replace(/\s+/g, '-')}
            className="shrink-0"
          />
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <span className="text-2xl font-bold tabular-nums">{value}</span>
        </div>
        {children && (
          <div ref={chartRef} className="min-h-0">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
