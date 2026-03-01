/**
 * InferenceAccuracyChart - Line chart for inference accuracy and confidence over time
 */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { ChartPanel } from './chart-panel'
import type { InferenceMetricPoint } from '@/types/analytics'
import { ensureArray } from '@/lib/safe-array'

export interface InferenceAccuracyChartProps {
  data?: InferenceMetricPoint[] | null
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

export function InferenceAccuracyChart({
  data,
  isLoading = false,
  className,
}: InferenceAccuracyChartProps) {
  const items = ensureArray(data)
  const isEmpty = items.length === 0

  const chartData = items.map((d) => ({
    date: d.date ?? '',
    dateLabel: formatDateLabel(d.date ?? ''),
    confidence: Math.round((d.averageConfidence ?? 0) * 100),
    truePositives: d.truePositives ?? 0,
    falsePositives: d.falsePositives ?? 0,
  }))

  return (
    <ChartPanel isEmpty={isEmpty} isLoading={isLoading} className={className}>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={chartData}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          aria-label="Inference accuracy over time"
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="dateLabel"
            tick={{ fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 12 }}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
            domain={[0, 100]}
          />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgb(var(--card))',
              border: '1px solid rgb(var(--border))',
              borderRadius: '12px',
            }}
            formatter={(value: number, name: string) => [
              name === 'confidence' ? `${value}%` : value,
              name === 'confidence' ? 'Avg Confidence' : name,
            ]}
            labelFormatter={(_, payload) =>
              payload?.[0]?.payload?.date
                ? formatDateLabel(payload[0].payload.date)
                : ''
            }
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="confidence"
            stroke="rgb(var(--primary))"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Avg Confidence"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="truePositives"
            stroke="rgb(var(--info))"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="True Positives"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="falsePositives"
            stroke="rgb(var(--destructive))"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="False Positives"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartPanel>
  )
}
