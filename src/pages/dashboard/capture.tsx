/**
 * Capture Upload (Mobile) - Offline-first photo capture and batch upload
 * Mobile-optimized for field auditors and facility teams
 */

import { useState, useCallback, useEffect } from 'react'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  CaptureArea,
  LocationSelector,
  BatchMetadataForm,
  GuidanceOverlay,
  StatusPanel,
  OfflineQueue,
  mapBatchesToDisplay,
} from '@/components/capture'
import type { CapturedImage } from '@/components/capture'
import type { BatchMetadata } from '@/components/capture'
import { useOfflineQueue } from '@/hooks/use-offline-queue'
import { useOfflineUploadManager } from '@/hooks/use-offline-upload-manager'
import type { Location } from '@/types/capture-upload'

const MIN_PHOTOS = 1

export function CapturePage() {
  const [images, setImages] = useState<CapturedImage[]>([])
  const [location, setLocation] = useState<Location>({
    siteId: '',
    floorId: '',
    roomId: '',
  })
  const [metadata, setMetadata] = useState<BatchMetadata>({
    batchName: '',
    inspector: '',
    timestamp: new Date().toISOString().slice(0, 16),
    notes: '',
    tags: [],
  })
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )

  const {
    batches,
    isHydrated,
    addBatch,
    updateBatchImages,
    removeBatch,
    totalItems,
    uploadedCount,
    failedCount,
    queuedCount,
    uploadingCount,
  } = useOfflineQueue()

  const { uploadBatch, retryFailed } = useOfflineUploadManager(updateBatchImages)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const canQueue =
    Boolean(location.siteId) &&
    Boolean(location.floorId) &&
    Boolean(location.roomId) &&
    (images ?? []).length >= MIN_PHOTOS

  const handleQueueForUpload = useCallback(async () => {
    if (!canQueue) {
      if (!location.roomId) {
        toast.error('Please select a site, floor, and room.')
      } else if ((images ?? []).length < MIN_PHOTOS) {
        toast.error(`Add at least ${MIN_PHOTOS} photo${MIN_PHOTOS !== 1 ? 's' : ''} to queue.`)
      }
      return
    }

    const imageList = images ?? []
    if (imageList.length === 0) {
      toast.error('No images to queue.')
      return
    }

    try {
      const { batchId, stored } = await addBatch(
        {
          siteId: location.siteId,
          floorId: location.floorId,
          roomId: location.roomId,
          batchName: metadata.batchName || `Batch ${new Date().toLocaleString()}`,
          inspector: metadata.inspector,
          timestamp: metadata.timestamp
            ? new Date(metadata.timestamp).toISOString()
            : new Date().toISOString(),
          notes: metadata.notes,
          tags: metadata.tags ?? [],
        },
        imageList.map((img) => ({
          imageUri: img.uri,
          mimeType: img.mimeType,
          size: img.size,
        }))
      )

      setImages([])
      setMetadata((prev) => ({
        ...prev,
        batchName: '',
        notes: '',
        tags: [],
      }))
      toast.success('Batch queued for upload.')

      if (stored && isOnline) {
        await uploadBatch(batchId, stored.images ?? [])
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to queue batch.')
    }
  }, [
    canQueue,
    location,
    images,
    metadata,
    addBatch,
    isOnline,
    uploadBatch,
  ])

  const handleRetry = useCallback(
    async (batchId: string, batchImages: Parameters<typeof retryFailed>[1]) => {
      await retryFailed(batchId, batchImages)
    },
    [retryFailed]
  )

  const displayBatches = mapBatchesToDisplay(
    batches.map((b) => ({
      id: b.id,
      batch: b.batch,
      images: b.images ?? [],
      createdAt: b.createdAt,
    }))
  )

  const lastUploadTime =
    batches.length > 0
      ? (() => {
          const withUploaded = (batches ?? []).flatMap((b) =>
            (b.images ?? []).filter((i) => i.uploadedAt).map((i) => i.uploadedAt!)
          )
          if (withUploaded.length === 0) return undefined
          const latest = withUploaded.sort().pop()
          return latest ? new Date(latest).toLocaleTimeString() : undefined
        })()
      : undefined

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Capture Upload</h1>
            <p className="text-muted-foreground mt-1">
              Mobile-first, offline-tolerant photo capture and batch upload
            </p>
          </div>
          <GuidanceOverlay
            minPhotos={MIN_PHOTOS}
            currentCount={(images ?? []).length}
          />
        </div>
        <StatusPanel
          totalItems={totalItems}
          uploadedCount={uploadedCount}
          failedCount={failedCount}
          queuedCount={queuedCount}
          uploadingCount={uploadingCount}
          lastUploadTime={lastUploadTime}
          isOnline={isOnline}
        />
      </div>

      {!isHydrated ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">Loading queue...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-3">
            <LocationSelector
              value={location}
              onChange={setLocation}
              error={
                canQueue ? undefined : location.siteId && location.floorId && !location.roomId
                  ? 'Select a room before queuing'
                  : undefined
              }
            />

            <div className="lg:col-span-2 space-y-6">
              <CaptureArea
                images={images}
                onImagesChange={setImages}
                minCount={MIN_PHOTOS}
              />

              <BatchMetadataForm value={metadata} onChange={setMetadata} />

              <Button
                className="w-full rounded-full h-12 text-base min-h-[48px]"
                onClick={handleQueueForUpload}
                disabled={!canQueue || uploadingCount > 0}
                aria-label="Queue batch for upload"
              >
                <Upload className="h-5 w-5 mr-2" />
                Queue for Upload
              </Button>
            </div>
          </div>

          <OfflineQueue
            batches={displayBatches}
            onRetry={handleRetry}
            onRemove={removeBatch}
            isUploading={uploadingCount > 0}
          />
        </>
      )}
    </div>
  )
}
