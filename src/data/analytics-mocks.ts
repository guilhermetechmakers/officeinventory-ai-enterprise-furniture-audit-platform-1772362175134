/**
 * Mock data for Analytics & Insights
 * Used when API endpoints are not yet wired
 */

import type {
  InventoryCountsByType,
  ConditionDistribution,
  UtilizationPoint,
  InferenceMetricPoint,
  AnomalyAlert,
} from '@/types/analytics'

export const mockInventoryCounts: InventoryCountsByType[] = [
  { type: 'Desks', count: 847 },
  { type: 'Chairs', count: 1203 },
  { type: 'Storage', count: 412 },
  { type: 'Meeting Tables', count: 234 },
  { type: 'Screens', count: 156 },
]

export const mockConditionDistribution: ConditionDistribution[] = [
  { category: 'Desks', condition: 'New', count: 120 },
  { category: 'Desks', condition: 'Good', count: 450 },
  { category: 'Desks', condition: 'Fair', count: 220 },
  { category: 'Desks', condition: 'Poor', count: 57 },
  { category: 'Chairs', condition: 'New', count: 180 },
  { category: 'Chairs', condition: 'Good', count: 680 },
  { category: 'Chairs', condition: 'Fair', count: 280 },
  { category: 'Chairs', condition: 'Poor', count: 63 },
  { category: 'Storage', condition: 'New', count: 45 },
  { category: 'Storage', condition: 'Good', count: 220 },
  { category: 'Storage', condition: 'Fair', count: 112 },
  { category: 'Storage', condition: 'Poor', count: 35 },
]

function generateUtilizationPoints(days = 14): UtilizationPoint[] {
  const points: UtilizationPoint[] = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    points.push({
      date: d.toISOString().slice(0, 10),
      utilizationRate: 0.65 + Math.random() * 0.25,
    })
  }
  return points
}

function generateInferenceMetrics(days = 14): InferenceMetricPoint[] {
  const points: InferenceMetricPoint[] = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    points.push({
      date: d.toISOString().slice(0, 10),
      averageConfidence: 0.82 + Math.random() * 0.12,
      truePositives: Math.floor(80 + Math.random() * 40),
      falsePositives: Math.floor(2 + Math.random() * 8),
    })
  }
  return points
}

export const mockUtilizationTrends: UtilizationPoint[] = generateUtilizationPoints()
export const mockInferenceAccuracy: InferenceMetricPoint[] = generateInferenceMetrics()

export const mockAnomalies: AnomalyAlert[] = [
  {
    id: 'a1',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    metric: 'Low confidence spike',
    severity: 'medium',
    description: '12 items with confidence < 70% detected in Floor 2',
  },
  {
    id: 'a2',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    metric: 'Exception spike',
    severity: 'high',
    description: 'Unusual spike in exception count for Building A',
  },
  {
    id: 'a3',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    metric: 'Utilization drop',
    severity: 'low',
    description: 'Utilization rate dropped 15% vs previous week',
  },
]
