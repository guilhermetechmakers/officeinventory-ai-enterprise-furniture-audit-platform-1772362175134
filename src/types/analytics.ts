/**
 * Analytics & Insights - Type definitions
 * Runtime-safe shapes for inventory, condition, utilization, inference, and anomalies
 */

export interface InventoryCountByType {
  type: string
  count: number
}

/** @deprecated Use InventoryCountByType */
export type InventoryCountsByType = InventoryCountByType

export interface ConditionDistribution {
  category: string
  condition: string
  count: number
}

export interface UtilizationPoint {
  date: string
  utilizationRate: number
}

export interface InferenceMetricPoint {
  date: string
  averageConfidence: number
  truePositives: number
  falsePositives: number
}

export type AnomalySeverity = 'low' | 'medium' | 'high'

export interface AnomalyAlert {
  id: string
  timestamp: string
  metric: string
  severity: AnomalySeverity
  description: string
}

export interface AnalyticsFilters {
  startDate?: string
  endDate?: string
  siteId?: string
  floorId?: string
  category?: string
}

export interface InventoryCountsResponse {
  data?: InventoryCountByType[]
  total?: number
}

export interface ConditionDistributionResponse {
  data?: ConditionDistribution[]
}

export interface UtilizationTrendsResponse {
  data?: UtilizationPoint[]
}

export interface InferenceAccuracyResponse {
  data?: InferenceMetricPoint[]
}

export interface AnomaliesResponse {
  data?: AnomalyAlert[]
}
