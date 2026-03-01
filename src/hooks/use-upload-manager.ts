/**
 * UploadManager hook: Handles batch uploads with retry and exponential backoff.
 */

import { useCallback, useRef } from 'react'
import { toast } from 'sonner'
import { uploadBatch } from '@/api/uploads'
import type { Batch, ImageItem } from '@/types/capture'

const MAX_RETRIES = 3
const BASE_DELAY_MS = 1000

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

export interface UseUploadManagerOptions {
  onImageUpdate: (image: ImageItem) => Promise<void>
  onBatchComplete?: (batchId: string) => void
}

export function useUploadManager({
  onImageUpdate,
  onBatchComplete,
}: UseUploadManagerOptions) {
  const isUploadingRef = useRef(false)

  const uploadSingleBatch = useCallback(
    async (batch: Batch, images: ImageItem[]): Promise<boolean> => {
      const pending = (images ?? []).filter(
        (i) => i.status === 'queued' || i.status === 'failed' || i.status === 'retrying'
      )
      if (pending.length === 0) return true

      for (const img of pending) {
        await onImageUpdate({
          ...img,
          status: 'uploading',
          progress: 0,
        })
      }

      let lastError: Error | null = null
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          const result = await uploadBatch(
            batch,
            pending,
            async (imageId, progress) => {
              const img = pending.find((i) => i.id === imageId)
              if (img) {
                await onImageUpdate({
                  ...img,
                  status: progress >= 100 ? 'uploaded' : 'uploading',
                  progress,
                  uploadedAt: progress >= 100 ? new Date().toISOString() : undefined,
                })
              }
            }
          )

          if (result.success) {
            for (const img of pending) {
              await onImageUpdate({
                ...img,
                status: 'uploaded',
                progress: 100,
                uploadedAt: new Date().toISOString(),
              })
            }
            toast.success(`Uploaded ${result.uploadedCount} photo(s)`)
            onBatchComplete?.(batch.id)
            return true
          }
        } catch (err) {
          lastError = err instanceof Error ? err : new Error(String(err))
          if (attempt < MAX_RETRIES) {
            const backoff = BASE_DELAY_MS * Math.pow(2, attempt)
            await delay(backoff)
            for (const img of pending) {
              await onImageUpdate({
                ...img,
                status: 'retrying',
                retryCount: attempt + 1,
              })
            }
          }
        }
      }

      for (const img of pending) {
        await onImageUpdate({
          ...img,
          status: 'failed',
          retryCount: MAX_RETRIES,
        })
      }
      toast.error(lastError?.message ?? 'Upload failed. Tap retry to try again.')
      return false
    },
    [onImageUpdate, onBatchComplete]
  )

  const processQueue = useCallback(
    async (queuedBatches: Array<{ batch: Batch; images: ImageItem[] }>) => {
      if (isUploadingRef.current) return
      isUploadingRef.current = true

      const batches = queuedBatches ?? []
      for (const { batch, images } of batches) {
        const pending = (images ?? []).filter(
          (i) => i.status === 'queued' || i.status === 'failed' || i.status === 'retrying'
        )
        if (pending.length > 0) {
          await uploadSingleBatch(batch, images)
        }
      }

      isUploadingRef.current = false
    },
    [uploadSingleBatch]
  )

  return { uploadSingleBatch, processQueue }
}
