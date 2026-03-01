/**
 * Upload API - future-ready for POST /api/uploads/batches.
 * MVP: Simulates upload with progress when endpoint is not available.
 */

import type { Batch, ImageItem } from '@/types/capture'

export interface BatchUploadPayload {
  batch: Batch
  images: Array<{
    id: string
    uri: string
    size: number
    mimeType: string
    metadata?: Record<string, unknown>
  }>
}

export interface BatchUploadResponse {
  success: boolean
  batchId: string
  uploadedCount: number
}

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

/**
 * Simulates upload with progress for MVP when backend is not available.
 */
async function simulateUpload(
  _batch: Batch,
  images: ImageItem[],
  onProgress: (imageId: string, progress: number) => void | Promise<void>
): Promise<BatchUploadResponse> {
  const items = images ?? []
  for (let i = 0; i < items.length; i++) {
    const img = items[i]
    for (let p = 0; p <= 100; p += 10) {
      await new Promise((r) => setTimeout(r, 80))
      await onProgress(img.id, p)
    }
  }
  return {
    success: true,
    batchId: _batch.id,
    uploadedCount: items.length,
  }
}

/**
 * Upload batch to backend. Falls back to simulation if endpoint unavailable.
 */
export async function uploadBatch(
  batch: Batch,
  images: ImageItem[],
  onProgress: (imageId: string, progress: number) => void
): Promise<BatchUploadResponse> {
  const payload: BatchUploadPayload = {
    batch,
    images: (images ?? []).map((img) => ({
      id: img.id,
      uri: img.imageUri,
      size: img.size,
      mimeType: img.mimeType,
    })),
  }

  try {
    const res = await fetch(`${API_BASE}/uploads/batches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      const data = (await res.json()) as BatchUploadResponse
      return data
    }
  } catch {
    // Network error or endpoint not available
  }

  return simulateUpload(batch, images, onProgress)
}
