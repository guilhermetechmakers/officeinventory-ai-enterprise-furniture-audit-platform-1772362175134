/**
 * ConditionDistributionChart - Horizontal bar or stacked distribution per category
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { ChartPanel } from './chart-panel'
import type { ConditionDistribution } from '@/types/analytics'
import { ensureArray } from '@/lib/safe-array'

const CONDITION_COLORS: Record<string, string> = {
  New: 'rgb(var(--primary))',
  Good: 'rgb(var(--info))',
  Fair: 'rgb(var(--warning))',
  Poor: 'rgb(var(--destructive))',
  Damaged: 'rgb(var(--muted))',
}

export interface ConditionDistributionChartProps {
  data?: ConditionDistribution[] | null
  isLoading?: boolean
  className?: string
}

export function ConditionDistributionChart({
  data,
  isLoading = false,
  className,
}: ConditionDistributionChartProps) {
  const items = ensureArray(data)
  const isEmpty = items.length === 0

  const flatForChart = items.map((d) => ({
    name: `${d.category ?? 'Unknown'} - ${d.condition ?? 'Unknown'}`,
    count: typeof d.count === 'number' ? d.count : 0,
    fill: CONDITION_COLORS[d.condition ?? ''] ?? 'rgb(var(--muted))',
  }))

  return (
    <ChartPanel isEmpty={isEmpty} isLoading={isLoading} className={className}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={flatForChart}
          layout="vertical"
          margin={{ top: 8, right: 8, left: 80, bottom: 0 }}
          aria-label="Condition distribution by category"
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11 }}
            width={75}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgb(var(--card))',
              border: '1px solid rgb(var(--border))',
              borderRadius: '12px',
            }}
            formatter={(value: number) => [value, 'Count']}
          />
          <Bar dataKey="count" radius={[0, 6, 6, 0]} name="Count">
            {flatForChart.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartPanel>
  )
}
