/**
 * useReviewQueueData - Fetches queue data with safe handling
 */

import { useQuery } from '@tanstack/react-query'
import { fetchReviewQueue, fetchReviewQueueMetrics } from '@/api/review-queue'
import type { ReviewItem, ReviewQueueTab, ReviewQueueFilters, ReviewQueueMetrics } from '@/types/review-queue'
import { sanitizeItem } from '@/lib/review-queue-utils'

const QUERY_KEY_QUEUE = ['review-queue']
const QUERY_KEY_METRICS = ['review-queue-metrics']

export interface UseReviewQueueDataResult {
  items: ReviewItem[]
  total: number
  page: number
  pageSize: number
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export function useReviewQueueData(
  tab: ReviewQueueTab,
  filters: ReviewQueueFilters,
  page = 1,
  pageSize = 50
): UseReviewQueueDataResult {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [...QUERY_KEY_QUEUE, tab, filters, page, pageSize],
    queryFn: () => fetchReviewQueue(tab, filters, page, pageSize),
    staleTime: 30_000,
  })

  const rawItems = Array.isArray(data?.items) ? data.items : []
  const items = rawItems.map((i) => sanitizeItem(i))

  return {
    items,
    total: data?.total ?? 0,
    page: data?.page ?? page,
    pageSize: data?.pageSize ?? pageSize,
    isLoading,
    error: error instanceof Error ? error : null,
    refetch: () => refetch(),
  }
}

export interface UseReviewQueueMetricsResult {
  metrics: ReviewQueueMetrics
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export function useReviewQueueMetrics(): UseReviewQueueMetricsResult {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: QUERY_KEY_METRICS,
    queryFn: fetchReviewQueueMetrics,
    staleTime: 60_000,
  })

  const metrics: ReviewQueueMetrics = {
    itemsPerHour: data?.itemsPerHour ?? 0,
    avgReviewTimeMinutes: data?.avgReviewTimeMinutes ?? 0,
    totalReviewed: data?.totalReviewed ?? 0,
    lowConfidenceCount: data?.lowConfidenceCount ?? 0,
    exceptionsCount: data?.exceptionsCount ?? 0,
    duplicatesCount: data?.duplicatesCount ?? 0,
    assignedToMeCount: data?.assignedToMeCount ?? 0,
  }

  return {
    metrics,
    isLoading,
    error: error instanceof Error ? error : null,
    refetch: () => refetch(),
  }
}
