/**
 * Analytics API - Inventory counts, condition distribution, utilization, inference accuracy, anomalies
 * Falls back to mock when API unavailable
 */

import { apiGet } from '@/lib/api'
import type {
  InventoryCountsByType,
  ConditionDistribution,
  UtilizationPoint,
  InferenceMetricPoint,
  AnomalyAlert,
  AnalyticsFilters,
} from '@/types/analytics'
import { ensureArray } from '@/lib/safe-array'
import {
  mockInventoryCounts,
  mockConditionDistribution,
  mockUtilizationTrends,
  mockInferenceAccuracy,
  mockAnomalies,
} from '@/data/analytics-mocks'

function buildQueryString(filters: AnalyticsFilters): string {
  const params = new URLSearchParams()
  if (filters.startDate) params.set('startDate', filters.startDate)
  if (filters.endDate) params.set('endDate', filters.endDate)
  if (filters.siteId) params.set('siteId', filters.siteId)
  if (filters.floorId) params.set('floorId', filters.floorId)
  if (filters.category) params.set('category', filters.category)
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

/** GET /api/analytics/inventory-counts */
export async function fetchInventoryCounts(
  filters: AnalyticsFilters
): Promise<InventoryCountsByType[]> {
  try {
    const data = await apiGet<InventoryCountsByType[] | { data?: InventoryCountsByType[] }>(
      `/analytics/inventory-counts${buildQueryString(filters)}`
    )
    const list = Array.isArray(data) ? data : data?.data
    return ensureArray(list)
  } catch {
    return mockInventoryCounts
  }
}

/** GET /api/analytics/condition-distribution */
export async function fetchConditionDistribution(
  filters: AnalyticsFilters
): Promise<ConditionDistribution[]> {
  try {
    const data = await apiGet<
      ConditionDistribution[] | { data?: ConditionDistribution[] }
    >(`/analytics/condition-distribution${buildQueryString(filters)}`)
    const list = Array.isArray(data) ? data : data?.data
    return ensureArray(list)
  } catch {
    return mockConditionDistribution
  }
}

/** GET /api/analytics/utilization-trends */
export async function fetchUtilizationTrends(
  filters: AnalyticsFilters
): Promise<UtilizationPoint[]> {
  try {
    const data = await apiGet<UtilizationPoint[] | { data?: UtilizationPoint[] }>(
      `/analytics/utilization-trends${buildQueryString(filters)}`
    )
    const list = Array.isArray(data) ? data : data?.data
    return ensureArray(list)
  } catch {
    return mockUtilizationTrends
  }
}

/** GET /api/analytics/inference-accuracy */
export async function fetchInferenceAccuracy(
  filters: AnalyticsFilters
): Promise<InferenceMetricPoint[]> {
  try {
    const data = await apiGet<
      InferenceMetricPoint[] | { data?: InferenceMetricPoint[] }
    >(`/analytics/inference-accuracy${buildQueryString(filters)}`)
    const list = Array.isArray(data) ? data : data?.data
    return ensureArray(list)
  } catch {
    return mockInferenceAccuracy
  }
}

/** GET /api/analytics/anomalies */
export async function fetchAnomalies(
  filters: AnalyticsFilters
): Promise<AnomalyAlert[]> {
  try {
    const data = await apiGet<AnomalyAlert[] | { data?: AnomalyAlert[] }>(
      `/analytics/anomalies${buildQueryString(filters)}`
    )
    const list = Array.isArray(data) ? data : data?.data
    return ensureArray(list)
  } catch {
    return mockAnomalies
  }
}
