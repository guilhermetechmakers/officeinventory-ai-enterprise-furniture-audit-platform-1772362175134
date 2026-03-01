/**
 * Bulk Upload Batches API - MVP with mock data, designed for future API wiring
 * GET /api/batches?status=&site=&start=&end=&query=
 * POST /api/batches/{id}/retry
 * POST /api/batches/{id}/cancel
 */

import type { Batch, BatchFilter, RetryBatchResponse, CancelBatchResponse } from '@/types/bulk-upload'

const MOCK_BATCHES: Batch[] = [
  {
    id: '1',
    name: 'Building A - Floor 2',
    site: 'Building A',
    uploader: 'Jane Smith',
    uploadedAt: '2025-02-28T10:30:00Z',
    status: 'completed',
    progress: 100,
    inferenceStartedAt: '2025-02-28T10:31:00Z',
    imageUrls: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=200',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=200',
    ],
    items: [
      { id: 'i1', batchId: '1', type: 'Desk', confidence: 0.94, imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=200', evidenceUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=100' },
      { id: 'i2', batchId: '1', type: 'Chair', confidence: 0.89, imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200', evidenceUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100' },
      { id: 'i3', batchId: '1', type: 'Monitor', confidence: 0.92, imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=200', evidenceUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=100' },
    ],
    errors: [],
  },
  {
    id: '2',
    name: 'Building B - Reception',
    site: 'Building B',
    uploader: 'John Doe',
    uploadedAt: '2025-02-28T09:15:00Z',
    status: 'processing',
    progress: 65,
    inferenceStartedAt: '2025-02-28T09:16:00Z',
    imageUrls: [
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=200',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200',
    ],
    items: [
      { id: 'i4', batchId: '2', type: 'Table', confidence: 0.87, imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=200', evidenceUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=100' },
    ],
    errors: [],
  },
  {
    id: '3',
    name: 'Floor 3 West - Conference',
    site: 'Floor 3 West',
    uploader: 'Alice Johnson',
    uploadedAt: '2025-02-28T08:00:00Z',
    status: 'pending',
    progress: 0,
    imageUrls: [
      'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=200',
    ],
    items: [],
    errors: [],
  },
  {
    id: '4',
    name: 'Building A - Storage',
    site: 'Building A',
    uploader: 'Bob Wilson',
    uploadedAt: '2025-02-27T14:20:00Z',
    status: 'failed',
    progress: 30,
    inferenceStartedAt: '2025-02-27T14:21:00Z',
    imageUrls: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200',
    ],
    items: [],
    errors: [
      { code: 'INFERENCE_TIMEOUT', message: 'AI inference job timed out after 120 seconds', timestamp: '2025-02-27T14:23:00Z' },
      { code: 'IMAGE_QUALITY', message: 'Low resolution detected on image 3', timestamp: '2025-02-27T14:22:30Z' },
    ],
  },
  {
    id: '5',
    name: 'Building C - Open Plan',
    site: 'Building C',
    uploader: 'Carol Davis',
    uploadedAt: '2025-02-27T11:45:00Z',
    status: 'completed',
    progress: 100,
    inferenceStartedAt: '2025-02-27T11:46:00Z',
    imageUrls: [
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=200',
      'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=200',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=200',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200',
    ],
    items: [
      { id: 'i5', batchId: '5', type: 'Desk', confidence: 0.96, imageUrl: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=200', evidenceUrl: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=100' },
      { id: 'i6', batchId: '5', type: 'Chair', confidence: 0.91, imageUrl: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=200', evidenceUrl: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=100' },
      { id: 'i7', batchId: '5', type: 'Whiteboard', confidence: 0.88, imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=200', evidenceUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=100' },
    ],
    errors: [],
  },
]

function filterBatches(batches: Batch[], filter: BatchFilter): Batch[] {
  let result = [...batches]

  if (filter.status && filter.status !== 'all') {
    result = result.filter((b) => b.status === filter.status)
  }

  if (filter.site && filter.site !== 'all') {
    result = result.filter((b) => b.site === filter.site)
  }

  if (filter.startDate) {
    result = result.filter((b) => new Date(b.uploadedAt) >= new Date(filter.startDate!))
  }

  if (filter.endDate) {
    const end = new Date(filter.endDate)
    end.setHours(23, 59, 59, 999)
    result = result.filter((b) => new Date(b.uploadedAt) <= end)
  }

  if (filter.query && filter.query.trim()) {
    const q = filter.query.trim().toLowerCase()
    result = result.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.uploader.toLowerCase().includes(q) ||
        b.site.toLowerCase().includes(q)
    )
  }

  return result
}

/**
 * Fetch batches with optional filters. MVP uses mock data.
 * Response shape validated for runtime safety.
 */
export async function fetchBatches(filter: BatchFilter = {}): Promise<Batch[]> {
  try {
    // Future: const res = await apiGet<{ data: Batch[] }>(`/batches?${new URLSearchParams(filter as Record<string, string>)}`)
    // const list = Array.isArray(res?.data) ? res.data : []
    const list = filterBatches(MOCK_BATCHES, filter ?? {})
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

/**
 * Get unique sites for filter dropdown. Uses full mock data so dropdown
 * is always populated regardless of current filter results.
 */
export function getSitesFromBatches(_batches?: Batch[]): string[] {
  const batches = MOCK_BATCHES ?? []
  const sites = Array.isArray(batches)
    ? batches.map((b) => b?.site).filter(Boolean) as string[]
    : []
  return [...new Set(sites)].sort()
}

/**
 * Retry a failed batch. MVP simulates success.
 */
export async function retryBatch(batchId: string): Promise<RetryBatchResponse> {
  try {
    // Future: const res = await apiPost<RetryBatchResponse>(`/batches/${batchId}/retry`)
    const batch = MOCK_BATCHES.find((b) => b.id === batchId)
    if (!batch) {
      return { success: false }
    }
    return {
      success: true,
      batch: {
        ...batch,
        status: 'pending',
        progress: 0,
        errors: [],
      },
    }
  } catch {
    return { success: false }
  }
}

/**
 * Cancel an in-progress batch. MVP simulates success.
 */
export async function cancelBatch(batchId: string): Promise<CancelBatchResponse> {
  try {
    // Future: const res = await apiPost<CancelBatchResponse>(`/batches/${batchId}/cancel`)
    const batch = MOCK_BATCHES.find((b) => b.id === batchId)
    if (!batch) {
      return { success: false }
    }
    return { success: true }
  } catch {
    return { success: false }
  }
}
