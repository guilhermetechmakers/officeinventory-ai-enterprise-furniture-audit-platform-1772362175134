/**
 * useAnalyticsData - Fetches analytics data with filters and null-safe handling
 */

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  fetchInventoryCounts,
  fetchConditionDistribution,
  fetchUtilizationTrends,
  fetchInferenceAccuracy,
  fetchAnomalies,
} from '@/api/analytics'
import type {
  AnalyticsFilters,
  InventoryCountsByType,
  ConditionDistribution,
  UtilizationPoint,
  InferenceMetricPoint,
  AnomalyAlert,
} from '@/types/analytics'
import { ensureArray } from '@/lib/safe-array'

const QUERY_KEY = ['analytics']

function getDefaultFilters(): AnalyticsFilters {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 30)
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  }
}

export function useAnalyticsData(filters: AnalyticsFilters) {
  const effectiveFilters = useMemo(
    () => ({
      ...getDefaultFilters(),
      ...filters,
    }),
    [filters.startDate, filters.endDate, filters.siteId, filters.floorId, filters.category]
  )

  const inventoryQuery = useQuery({
    queryKey: [...QUERY_KEY, 'inventory-counts', effectiveFilters],
    queryFn: () => fetchInventoryCounts(effectiveFilters),
    staleTime: 60_000,
  })

  const conditionQuery = useQuery({
    queryKey: [...QUERY_KEY, 'condition-distribution', effectiveFilters],
    queryFn: () => fetchConditionDistribution(effectiveFilters),
    staleTime: 60_000,
  })

  const utilizationQuery = useQuery({
    queryKey: [...QUERY_KEY, 'utilization-trends', effectiveFilters],
    queryFn: () => fetchUtilizationTrends(effectiveFilters),
    staleTime: 60_000,
  })

  const inferenceQuery = useQuery({
    queryKey: [...QUERY_KEY, 'inference-accuracy', effectiveFilters],
    queryFn: () => fetchInferenceAccuracy(effectiveFilters),
    staleTime: 60_000,
  })

  const anomaliesQuery = useQuery({
    queryKey: [...QUERY_KEY, 'anomalies', effectiveFilters],
    queryFn: () => fetchAnomalies(effectiveFilters),
    staleTime: 30_000,
  })

  const inventoryCounts: InventoryCountsByType[] = ensureArray(inventoryQuery.data)
  const conditionDistribution: ConditionDistribution[] = ensureArray(conditionQuery.data)
  const utilizationTrends: UtilizationPoint[] = ensureArray(utilizationQuery.data)
  const inferenceAccuracy: InferenceMetricPoint[] = ensureArray(inferenceQuery.data)
  const anomalies: AnomalyAlert[] = ensureArray(anomaliesQuery.data)

  const isLoading =
    inventoryQuery.isLoading ||
    conditionQuery.isLoading ||
    utilizationQuery.isLoading ||
    inferenceQuery.isLoading ||
    anomaliesQuery.isLoading

  const error =
    inventoryQuery.error ??
    conditionQuery.error ??
    utilizationQuery.error ??
    inferenceQuery.error ??
    anomaliesQuery.error

  const refetch = () => {
    inventoryQuery.refetch()
    conditionQuery.refetch()
    utilizationQuery.refetch()
    inferenceQuery.refetch()
    anomaliesQuery.refetch()
  }

  return {
    inventoryCounts,
    conditionDistribution,
    utilizationTrends,
    inferenceAccuracy,
    anomalies,
    isLoading,
    error: error instanceof Error ? error : null,
    refetch,
  }
}

export { getDefaultFilters }
