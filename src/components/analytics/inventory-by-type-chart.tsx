/**
 * InventoryByTypeChart - Stacked/grouped bar chart for inventory counts
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { ChartPanel } from './chart-panel'
import type { InventoryCountsByType } from '@/types/analytics'
import { ensureArray } from '@/lib/safe-array'

const CHART_COLORS = [
  'rgb(var(--primary))',
  'rgb(var(--info))',
  'rgb(var(--warning))',
  'rgb(var(--muted))',
  'rgb(var(--destructive))',
]

export interface InventoryByTypeChartProps {
  data?: InventoryCountsByType[] | null
  isLoading?: boolean
  className?: string
}

export function InventoryByTypeChart({
  data,
  isLoading = false,
  className,
}: InventoryByTypeChartProps) {
  const items = ensureArray(data)
  const isEmpty = items.length === 0

  const chartData = items.map((d, i) => ({
    name: d.type ?? 'Unknown',
    count: typeof d.count === 'number' ? d.count : 0,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }))

  return (
    <ChartPanel isEmpty={isEmpty} isLoading={isLoading} className={className}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          aria-label="Inventory counts by type"
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 12 }} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgb(var(--card))',
              border: '1px solid rgb(var(--border))',
              borderRadius: '12px',
            }}
            formatter={(value: number) => [value, 'Count']}
          />
          <Bar
            dataKey="count"
            fill="rgb(var(--primary))"
            radius={[6, 6, 0, 0]}
            name="Count"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartPanel>
  )
}
