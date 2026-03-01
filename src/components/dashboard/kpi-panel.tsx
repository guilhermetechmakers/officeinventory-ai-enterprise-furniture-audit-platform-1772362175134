import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface KPIPanelProps {
  title: string
  value: string | number
  /** Optional delta or status text (e.g. "+12%", "-8") */
  delta?: string
  /** Whether delta is positive (green) or negative (red) */
  positive?: boolean
  /** Optional icon */
  icon?: LucideIcon
  /** Optional sparkline/mini-chart data - card-ready for future charts */
  sparklineData?: number[]
  className?: string
}

export function KPIPanel({
  title,
  value,
  delta,
  positive = true,
  icon: Icon,
  sparklineData,
  className,
}: KPIPanelProps) {
  const displayValue =
    typeof value === 'number' ? value.toLocaleString() : String(value ?? '0')

  return (
    <Card
      className={cn(
        'transition-all duration-200 hover:shadow-elevated hover:-translate-y-0.5',
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        {Icon && <Icon className="h-4 w-4 text-primary" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{displayValue}</div>
        {delta !== undefined && delta !== '' && (
          <div className="mt-1 flex items-center gap-1 text-xs">
            {positive ? (
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-destructive" />
            )}
            <span
              className={cn(
                positive ? 'text-primary' : 'text-destructive'
              )}
            >
              {delta}
            </span>
            <span className="text-muted-foreground">vs last period</span>
          </div>
        )}
        {Array.isArray(sparklineData) && sparklineData.length > 0 && (
          <div className="mt-2 h-8" data-sparkline={JSON.stringify(sparklineData)} />
        )}
      </CardContent>
    </Card>
  )
}
