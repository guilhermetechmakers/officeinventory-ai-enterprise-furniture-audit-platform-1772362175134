/**
 * AnalyticsDashboardShell - Layout with FilterBar, AnalyticsCards, AnomaliesPanel
 */

import { useCallback, useState } from 'react'
import { FilterBar } from './filter-bar'
import { AnalyticsCard } from './analytics-card'
import { AnomaliesPanel } from './anomalies-panel'
import { InventoryByTypeChart } from './inventory-by-type-chart'
import { ConditionDistributionChart } from './condition-distribution-chart'
import { UtilizationTrendsChart } from './utilization-trends-chart'
import { InferenceAccuracyChart } from './inference-accuracy-chart'
import { useAnalyticsData, getDefaultFilters } from '@/hooks/use-analytics-data'
import type { AnalyticsFilters } from '@/types/analytics'
import { ensureArray } from '@/lib/safe-array'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AnalyticsDashboardShell() {
  const [filters, setFilters] = useState<AnalyticsFilters>(getDefaultFilters)

  const {
    inventoryCounts,
    conditionDistribution,
    utilizationTrends,
    inferenceAccuracy,
    anomalies,
    isLoading,
    error,
    refetch,
  } = useAnalyticsData(filters)

  const totalInventory = ensureArray(inventoryCounts).reduce(
    (sum, d) => sum + (typeof d.count === 'number' ? d.count : 0),
    0
  )

  const avgUtilization =
    ensureArray(utilizationTrends).length > 0
      ? ensureArray(utilizationTrends).reduce(
          (sum, d) => sum + (typeof d.utilizationRate === 'number' ? d.utilizationRate : 0),
          0
        ) / ensureArray(utilizationTrends).length
      : 0

  const latestConfidence =
    ensureArray(inferenceAccuracy).length > 0
      ? (ensureArray(inferenceAccuracy).at(-1)?.averageConfidence ?? 0) * 100
      : 0

  const handleApply = useCallback(() => {
    refetch()
  }, [refetch])

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics & Insights</h1>
          <p className="text-muted-foreground mt-1">
            Inventory counts, condition distributions, utilization trends, and inference accuracy
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
          className="rounded-full shrink-0"
          aria-label="Refresh data"
        >
          <RefreshCw
            className={cn('h-4 w-4', isLoading && 'animate-spin')}
          />
          Refresh
        </Button>
      </div>

      <FilterBar filters={filters} onChange={setFilters} onApply={handleApply} />

      {error && (
        <div
          className="rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {error.message}.{' '}
          <Button variant="link" size="sm" onClick={() => refetch()} className="h-auto p-0 font-semibold">
            Retry
          </Button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <AnalyticsCard
          title="Inventory by Type"
          value={totalInventory.toLocaleString()}
          subtitle="Total items across categories"
          chartId="inventory-chart"
          exportable
          exportData={inventoryCounts.map((d) => ({ type: d.type, count: d.count }))}
          exportHeaders={['type', 'count']}
          exportFilename="inventory-by-type"
        >
          <InventoryByTypeChart data={inventoryCounts} isLoading={isLoading} />
        </AnalyticsCard>

        <AnalyticsCard
          title="Condition Distribution"
          value={ensureArray(conditionDistribution).length > 0 ? 'By category' : '—'}
          subtitle="Items by condition per category"
          chartId="condition-chart"
          exportable
          exportData={conditionDistribution.map((d) => ({
            category: d.category,
            condition: d.condition,
            count: d.count,
          }))}
          exportHeaders={['category', 'condition', 'count']}
          exportFilename="condition-distribution"
        >
          <ConditionDistributionChart data={conditionDistribution} isLoading={isLoading} />
        </AnalyticsCard>

        <AnalyticsCard
          title="Utilization Trends"
          value={`${Math.round(avgUtilization * 100)}%`}
          subtitle="Utilization rate over selected period"
          chartId="utilization-chart"
          exportable
          exportData={utilizationTrends.map((d) => ({
            date: d.date,
            utilizationRatePercent: Math.round((d.utilizationRate ?? 0) * 100),
          }))}
          exportHeaders={['date', 'utilizationRatePercent']}
          exportFilename="utilization-trends"
        >
          <UtilizationTrendsChart data={utilizationTrends} isLoading={isLoading} />
        </AnalyticsCard>

        <AnalyticsCard
          title="Inference Accuracy"
          value={`${Math.round(latestConfidence)}%`}
          subtitle="Average confidence over time"
          chartId="inference-chart"
          exportable
          exportData={inferenceAccuracy.map((d) => ({
            date: d.date,
            averageConfidencePercent: Math.round((d.averageConfidence ?? 0) * 100),
            truePositives: d.truePositives ?? 0,
            falsePositives: d.falsePositives ?? 0,
          }))}
          exportHeaders={['date', 'averageConfidencePercent', 'truePositives', 'falsePositives']}
          exportFilename="inference-accuracy"
        >
          <InferenceAccuracyChart data={inferenceAccuracy} isLoading={isLoading} />
        </AnalyticsCard>
      </div>

      <AnomaliesPanel anomalies={anomalies} isLoading={isLoading} />
    </div>
  )
}
