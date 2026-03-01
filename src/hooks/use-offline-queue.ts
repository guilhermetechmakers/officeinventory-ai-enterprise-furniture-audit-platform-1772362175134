/**
 * useOfflineQueue - Centralized offline queue state with persistence
 * Hydrates from IndexedDB on mount, persists on changes
 */

import { useState, useEffect, useCallback } from 'react'
import type { Batch, ImageItem, QueuedBatch } from '@/types/capture-upload'
import {
  getAllQueuedBatches,
  saveQueuedBatch,
  updateQueuedBatch,
  removeQueuedBatch,
  generateId,
} from '@/stores/offline-queue-store'
import type { StoredQueuedBatch } from '@/stores/offline-queue-store'

export interface QueuedBatchWithId extends QueuedBatch {
  batch: Batch & { id: string }
}

export function useOfflineQueue() {
  const [batches, setBatches] = useState<StoredQueuedBatch[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  const hydrate = useCallback(async () => {
    const data = await getAllQueuedBatches()
    setBatches(Array.isArray(data) ? data : [])
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    hydrate()
  }, [hydrate])

  const addBatch = useCallback(
    async (batch: Omit<Batch, 'id'>, images: Omit<ImageItem, 'id' | 'batchId' | 'status' | 'progress' | 'retryCount'>[]) => {
      const batchId = generateId()
      const batchWithId: Batch = { ...batch, id: batchId }
      const imageItems: ImageItem[] = images.map((img) => ({
        ...img,
        id: generateId(),
        batchId,
        status: 'queued' as const,
        progress: 0,
        retryCount: 0,
      }))
      const queued: QueuedBatch = {
        batch: batchWithId,
        images: imageItems,
        createdAt: new Date().toISOString(),
      }
      const stored = await saveQueuedBatch(queued)
      setBatches((prev) => [
        ...prev,
        { id: batchId, batch: batchWithId, images: imageItems, createdAt: queued.createdAt },
      ])
      return { batchId, stored }
    },
    []
  )

  const updateBatchImages = useCallback(
    async (batchId: string, images: ImageItem[]) => {
      await updateQueuedBatch(batchId, { images })
      setBatches((prev) =>
        prev.map((b) => (b.id === batchId ? { ...b, images } : b))
      )
    },
    []
  )

  const removeBatch = useCallback(async (batchId: string) => {
    await removeQueuedBatch(batchId)
    setBatches((prev) => prev.filter((b) => b.id !== batchId))
  }, [])

  const getBatchById = useCallback(
    (batchId: string) => batches.find((b) => b.id === batchId),
    [batches]
  )

  const totalItems = batches.reduce((sum, b) => sum + (b.images?.length ?? 0), 0)
  const uploadedCount = batches.reduce(
    (sum, b) => sum + ((b.images ?? []).filter((i) => i.status === 'uploaded').length),
    0
  )
  const failedCount = batches.reduce(
    (sum, b) => sum + ((b.images ?? []).filter((i) => i.status === 'failed').length),
    0
  )
  const queuedCount = batches.reduce(
    (sum, b) => sum + ((b.images ?? []).filter((i) => i.status === 'queued').length),
    0
  )
  const uploadingCount = batches.reduce(
    (sum, b) => sum + ((b.images ?? []).filter((i) => i.status === 'uploading' || i.status === 'retrying').length),
    0
  )

  return {
    batches,
    isHydrated,
    hydrate,
    addBatch,
    updateBatchImages,
    removeBatch,
    getBatchById,
    totalItems,
    uploadedCount,
    failedCount,
    queuedCount,
    uploadingCount,
  }
}
