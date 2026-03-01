/**
 * useOfflineUploadManager - Simulated uploads for offline-first capture
 * MVP: No external API; future: integrate with POST /api/uploads/batches
 */

import { useCallback, useRef } from 'react'
import { toast } from 'sonner'
import type { ImageItem } from '@/types/capture-upload'

const MAX_RETRIES = 3
const INITIAL_BACKOFF_MS = 1000

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function simulateUpload(
  _batchId: string,
  _image: ImageItem,
  onProgress: (p: number) => void
): Promise<void> {
  for (let p = 0; p <= 100; p += 10) {
    await delay(80)
    onProgress(p)
  }
}

export function useOfflineUploadManager(
  updateBatchImages: (batchId: string, images: ImageItem[]) => Promise<void>
) {
  const isUploadingRef = useRef(false)

  const uploadBatch = useCallback(
    async (batchId: string, images: ImageItem[]) => {
      if (isUploadingRef.current) return
      isUploadingRef.current = true

      const imageList = images ?? []
      let updated = [...imageList]

      const updateImage = (id: string, patch: Partial<ImageItem>) => {
        updated = updated.map((img) =>
          img.id === id ? { ...img, ...patch } : img
        )
      }

      const isOnline = typeof navigator !== 'undefined' && navigator.onLine
      if (!isOnline) {
        toast.error('You are offline. Uploads will resume when connected.')
        isUploadingRef.current = false
        return
      }

      const queued = imageList.filter(
        (i) => i.status === 'queued' || i.status === 'failed'
      )

      for (const img of queued) {
        updateImage(img.id, { status: 'uploading', progress: 0 })
        await updateBatchImages(batchId, [...updated])

        let lastError: Error | null = null
        let retries = img.retryCount ?? 0

        while (retries <= MAX_RETRIES) {
          try {
            await simulateUpload(batchId, img, (p) => {
              updateImage(img.id, { progress: p })
              updateBatchImages(batchId, [...updated])
            })
            updateImage(img.id, {
              status: 'uploaded',
              progress: 100,
              uploadedAt: new Date().toISOString(),
            })
            await updateBatchImages(batchId, updated)
            break
          } catch (err) {
            lastError = err instanceof Error ? err : new Error(String(err))
            retries++
            updateImage(img.id, {
              status: 'retrying',
              retryCount: retries,
            })
            await updateBatchImages(batchId, updated)
            if (retries <= MAX_RETRIES) {
              const backoff = INITIAL_BACKOFF_MS * Math.pow(2, retries - 1)
              await delay(backoff)
            }
          }
        }

        if (lastError && (updated.find((i) => i.id === img.id)?.status ?? '') !== 'uploaded') {
          updateImage(img.id, {
            status: 'failed',
            progress: 0,
            retryCount: retries,
          })
          await updateBatchImages(batchId, updated)
          toast.error(`Upload failed: ${img.id.slice(0, 8)}...`)
        }
      }

      const uploaded = updated.filter((i) => i.status === 'uploaded').length
      if (uploaded > 0) {
        toast.success(`${uploaded} photo${uploaded !== 1 ? 's' : ''} uploaded successfully`)
      }

      isUploadingRef.current = false
    },
    [updateBatchImages]
  )

  const retryFailed = useCallback(
    async (batchId: string, images: ImageItem[]) => {
      const failed = (images ?? []).filter((i) => i.status === 'failed')
      if (failed.length === 0) {
        toast.info('No failed uploads to retry')
        return
      }
      const reset = (images ?? []).map((img) =>
        img.status === 'failed'
          ? { ...img, status: 'queued' as const, retryCount: 0, progress: 0 }
          : img
      )
      await updateBatchImages(batchId, reset)
      await uploadBatch(batchId, reset)
    },
    [updateBatchImages, uploadBatch]
  )

  return { uploadBatch, retryFailed }
}
