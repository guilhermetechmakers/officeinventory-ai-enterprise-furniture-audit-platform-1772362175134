/**
 * AnomaliesPanel - Compact cards listing recent anomalies (spikes, low confidence)
 */

import { AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { AnomalyAlert, AnomalySeverity } from '@/types/analytics'
import { ensureArray } from '@/lib/safe-array'

export interface AnomaliesPanelProps {
  anomalies?: AnomalyAlert[] | null
  isLoading?: boolean
  className?: string
}

function formatTimestamp(ts: string): string {
  try {
    const d = new Date(ts)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  } catch {
    return ts
  }
}

function getSeverityConfig(severity: AnomalySeverity) {
  switch (severity) {
    case 'high':
      return {
        icon: AlertTriangle,
        className: 'text-destructive bg-destructive/10',
        label: 'High',
      }
    case 'medium':
      return {
        icon: AlertCircle,
        className: 'text-warning bg-warning/10',
        label: 'Medium',
      }
    default:
      return {
        icon: Info,
        className: 'text-info bg-info/10',
        label: 'Low',
      }
  }
}

export function AnomaliesPanel({
  anomalies,
  isLoading = false,
  className,
}: AnomaliesPanelProps) {
  const items = ensureArray(anomalies)

  return (
    <Card
      className={cn(
        'rounded-2xl border border-border shadow-card transition-all duration-300',
        className
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold">Anomaly Alerts</CardTitle>
        <p className="text-sm text-muted-foreground">
          Recent spikes and low-confidence items
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 rounded-xl shimmer animate-pulse"
                aria-hidden
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center gap-2 rounded-xl bg-muted/20 py-8"
            role="status"
            aria-label="No anomalies"
          >
            <AlertCircle className="h-10 w-10 text-muted-foreground/50" aria-hidden />
            <p className="text-sm text-muted-foreground">No anomalies detected</p>
          </div>
        ) : (
          <ul className="space-y-3" role="list" aria-label="Anomaly alerts">
            {items.map((a) => {
              const config = getSeverityConfig(a.severity ?? 'low')
              return (
                <li key={a.id}>
                  <div
                    className={cn(
                      'flex gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted/30'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                        config.className
                      )}
                    >
                      <config.icon className="h-4 w-4" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{a.metric ?? 'Anomaly'}</span>
                        <span
                          className={cn(
                            'rounded-full px-2 py-0.5 text-xs font-medium',
                            config.className
                          )}
                        >
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {a.description ?? ''}
                      </p>
                      <time
                        className="text-xs text-muted-foreground mt-1 block"
                        dateTime={a.timestamp ?? ''}
                      >
                        {formatTimestamp(a.timestamp ?? '')}
                      </time>
                    </div>
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
