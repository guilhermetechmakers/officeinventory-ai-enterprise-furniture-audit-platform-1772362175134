/**
 * Review Queue API - fetches queue data, assignments, bulk actions, exports
 * Falls back to mock when API unavailable
 */

import { apiGet, apiPost } from '@/lib/api'
import type {
  ReviewItem,
  ReviewQueueTab,
  ReviewQueueFilters,
  ReviewQueueResponse,
  ReviewQueueMetrics,
} from '@/types/review-queue'
import { mockReviewItems, mockReviewQueueMetrics } from '@/data/review-queue-mocks'
import { ensureArray } from '@/lib/safe-array'

function filterByTab(items: ReviewItem[], tab: ReviewQueueTab, currentUserId = 'user-1'): ReviewItem[] {
  const safe = ensureArray(items)
  switch (tab) {
    case 'low':
      return safe.filter((i) => i.status === 'lowConfidence')
    case 'exceptions':
      return safe.filter((i) => i.status === 'exception')
    case 'duplicates':
      return safe.filter((i) => i.status === 'duplicate')
    case 'assigned':
      return safe.filter((i) => i.assignedTo === currentUserId)
    default:
      return safe
  }
}

function applyFilters(items: ReviewItem[], filters: ReviewQueueFilters): ReviewItem[] {
  let result = ensureArray(items)
  if (filters.minConfidence != null && filters.minConfidence > 0) {
    const min = filters.minConfidence / 100
    result = result.filter((i) => (i.confidence ?? 0) >= min)
  }
  if (filters.maxConfidence != null && filters.maxConfidence < 100) {
    const max = filters.maxConfidence / 100
    result = result.filter((i) => (i.confidence ?? 0) <= max)
  }
  if (filters.siteId) {
    result = result.filter((i) => i.siteContext?.siteId === filters.siteId)
  }
  if (filters.location) {
    result = result.filter((i) =>
      (i.siteContext?.location ?? '').toLowerCase().includes(filters.location!.toLowerCase())
    )
  }
  if (filters.status) {
    result = result.filter((i) => i.status === filters.status)
  }
  if (filters.assignedTo) {
    result = result.filter((i) => i.assignedTo === filters.assignedTo)
  }
  return result
}

/** GET /api/review-queue */
export async function fetchReviewQueue(
  tab: ReviewQueueTab,
  filters: ReviewQueueFilters,
  page = 1,
  pageSize = 50
): Promise<ReviewQueueResponse> {
  try {
    const params = new URLSearchParams({
      tab,
      page: String(page),
      pageSize: String(pageSize),
    })
    if (filters.minConfidence != null) params.set('minConfidence', String(filters.minConfidence))
    if (filters.maxConfidence != null) params.set('maxConfidence', String(filters.maxConfidence))
    if (filters.siteId) params.set('siteId', filters.siteId)
    if (filters.location) params.set('location', filters.location)

    const response = await apiGet<ReviewQueueResponse>(
      `/review-queue?${params.toString()}`
    )
    const data = response ?? {}
    const items = Array.isArray(data.items) ? data.items : []
    const total = typeof data.total === 'number' ? data.total : items.length
    return {
      items,
      total,
      page: data.page ?? page,
      pageSize: data.pageSize ?? pageSize,
    }
  } catch {
    const allItems = filterByTab(mockReviewItems, tab)
    const filtered = applyFilters(allItems, filters)
    const start = (page - 1) * pageSize
    const paginated = filtered.slice(start, start + pageSize)
    return {
      items: paginated,
      total: filtered.length,
      page,
      pageSize,
    }
  }
}

/** GET /api/review-queue/metrics */
export async function fetchReviewQueueMetrics(): Promise<ReviewQueueMetrics> {
  try {
    const data = await apiGet<ReviewQueueMetrics>('/review-queue/metrics')
    return {
      itemsPerHour: data?.itemsPerHour ?? 0,
      avgReviewTimeMinutes: data?.avgReviewTimeMinutes ?? 0,
      totalReviewed: data?.totalReviewed ?? 0,
      lowConfidenceCount: data?.lowConfidenceCount ?? 0,
      exceptionsCount: data?.exceptionsCount ?? 0,
      duplicatesCount: data?.duplicatesCount ?? 0,
      assignedToMeCount: data?.assignedToMeCount ?? 0,
    }
  } catch {
    return mockReviewQueueMetrics
  }
}

/** POST /api/review-queue/assign */
export async function assignReviewItems(payload: {
  itemIds: string[]
  assigneeId: string
  teamId?: string
  slaNotes?: string
  dueDate?: string
}): Promise<{ success: boolean; message?: string }> {
  const ids = Array.isArray(payload.itemIds) ? payload.itemIds : []
  if (ids.length === 0 || !payload.assigneeId) {
    return { success: false, message: 'Missing required fields' }
  }
  try {
    await apiPost('/review-queue/assign', payload)
    return { success: true }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Assignment failed',
    }
  }
}

/** POST /api/review-queue/bulk-accept */
export async function bulkAcceptItems(payload: {
  itemIds: string[]
  action: 'accept' | 'flag'
}): Promise<{ success: boolean; message?: string }> {
  const ids = Array.isArray(payload.itemIds) ? payload.itemIds : []
  if (ids.length === 0) {
    return { success: false, message: 'No items selected' }
  }
  try {
    await apiPost('/review-queue/bulk-accept', payload)
    return { success: true }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Bulk accept failed',
    }
  }
}

/** POST /api/review-queue/export - returns blob URL for download */
export async function exportReviewItems(
  itemIds: string[],
  format: 'csv' | 'pdf'
): Promise<{ url?: string; error?: string }> {
  const ids = Array.isArray(itemIds) ? itemIds : []
  if (ids.length === 0) {
    return { error: 'No items selected' }
  }
  try {
    const API_BASE = import.meta.env.VITE_API_URL ?? '/api'
    const response = await fetch(`${API_BASE}/review-queue/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ itemIds: ids, format }),
    })
    if (!response.ok) throw new Error(response.statusText)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    return { url }
  } catch {
    return getMockExport(ids, format)
  }
}

function getMockExport(itemIds: string[], format: 'csv' | 'pdf'): { url?: string; error?: string } {
  if (format === 'csv') {
    const header = 'itemId,exportedAt\n'
    const rows = itemIds.map((id) => `${id},${new Date().toISOString()}`).join('\n')
    const csv = header + rows + '\n'
    const blob = new Blob([csv], { type: 'text/csv' })
    return { url: URL.createObjectURL(blob) }
  }
  const pdfContent = `PDF Export - ${itemIds.length} items - ${new Date().toISOString()}`
  const blob = new Blob([pdfContent], { type: 'application/pdf' })
  return { url: URL.createObjectURL(blob) }
}
