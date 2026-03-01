/**
 * UtilizationTrendsChart - Line/area chart showing utilization rate over time
 */

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import { ChartPanel } from './chart-panel'
import type { UtilizationPoint } from '@/types/analytics'
import { ensureArray } from '@/lib/safe-array'

export interface UtilizationTrendsChartProps {
  data?: UtilizationPoint[] | null
  isLoading?: boolean
  className?: string
}

function formatDateLabel(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}

export function UtilizationTrendsChart({
  data,
  isLoading = false,
  className,
}: UtilizationTrendsChartProps) {
  const items = ensureArray(data)
  const isEmpty = items.length === 0

  const chartData = items.map((d) => ({
    date: d.date ?? '',
    dateLabel: formatDateLabel(d.date ?? ''),
    utilizationRate: typeof d.utilizationRate === 'number' ? d.utilizationRate : 0,
    ratePercent: Math.round((typeof d.utilizationRate === 'number' ? d.utilizationRate : 0) * 100),
  }))

  return (
    <ChartPanel isEmpty={isEmpty} isLoading={isLoading} className={className}>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={chartData}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          aria-label="Utilization trends over time"
        >
          <defs>
            <linearGradient id="utilizationGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(var(--primary))" stopOpacity={0.4} />
              <stop offset="100%" stopColor="rgb(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="dateLabel"
            tick={{ fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgb(var(--card))',
              border: '1px solid rgb(var(--border))',
              borderRadius: '12px',
            }}
            formatter={(value: number) => [`${value}%`, 'Utilization']}
            labelFormatter={(_, payload) =>
              payload?.[0]?.payload?.date
                ? formatDateLabel(payload[0].payload.date)
                : ''
            }
          />
          <Area
            type="monotone"
            dataKey="ratePercent"
            stroke="rgb(var(--primary))"
            fill="url(#utilizationGradient)"
            strokeWidth={2}
            name="Utilization"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartPanel>
  )
}
