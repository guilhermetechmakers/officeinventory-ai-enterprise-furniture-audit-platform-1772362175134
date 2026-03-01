/**
 * OfflineQueue - Local queue display with per-item status and retry
 */

import { CheckCircle, Clock, AlertCircle, RefreshCw, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/dashboard/empty-state'
import type { ImageItem, ImageItemStatus } from '@/types/capture-upload'
import { MOCK_ROOMS, MOCK_FLOORS, MOCK_SITES } from '@/data/capture-locations'
import { cn } from '@/lib/utils'

interface QueuedBatchDisplay {
  id: string
  batchName: string
  locationLabel: string
  imageCount: number
  images: ImageItem[]
  createdAt: string
}

interface OfflineQueueProps {
  batches: QueuedBatchDisplay[]
  onRetry: (batchId: string, images: ImageItem[]) => void
  onRemove: (batchId: string) => void
  isUploading: boolean
  className?: string
}

const statusConfig: Record<
  ImageItemStatus,
  { icon: typeof CheckCircle; label: string; variant: 'success' | 'info' | 'warning' | 'destructive' | 'secondary' }
> = {
  queued: { icon: Clock, label: 'Queued', variant: 'secondary' },
  uploading: { icon: Clock, label: 'Uploading', variant: 'info' },
  retrying: { icon: RefreshCw, label: 'Retrying', variant: 'warning' },
  uploaded: { icon: CheckCircle, label: 'Uploaded', variant: 'success' },
  failed: { icon: AlertCircle, label: 'Failed', variant: 'destructive' },
}

function getLocationLabel(siteId: string, floorId: string, roomId: string): string {
  const site = MOCK_SITES.find((s) => s.id === siteId)
  const floor = MOCK_FLOORS.find((f) => f.id === floorId)
  const room = MOCK_ROOMS.find((r) => r.id === roomId)
  const parts = [site?.name, floor?.name, room?.name].filter(Boolean)
  return parts.join(' / ') || 'Unknown'
}

export function OfflineQueue({
  batches,
  onRetry,
  onRemove,
  isUploading,
  className,
}: OfflineQueueProps) {
  const batchList = batches ?? []
  const hasFailed = batchList.some((b) =>
    (b.images ?? []).some((i) => i.status === 'failed')
  )

  if (batchList.length === 0) {
    return (
      <Card className={cn('', className)}>
        <CardHeader>
          <CardTitle>Upload Queue</CardTitle>
          <CardDescription>
            Queued batches will appear here. Add photos and queue for upload.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<Clock className="h-7 w-7" />}
            title="No batches in queue"
            description="Capture photos, select a location, add metadata, and tap Queue for Upload."
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Upload Queue</CardTitle>
            <CardDescription>
              {batchList.length} batch{batchList.length !== 1 ? 'es' : ''} in queue
            </CardDescription>
          </div>
          {hasFailed && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const failedBatch = batchList.find((b) =>
                  (b.images ?? []).some((i) => i.status === 'failed')
                )
                if (failedBatch) {
                  onRetry(failedBatch.id, failedBatch.images ?? [])
                }
              }}
              disabled={isUploading}
              className="rounded-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry failed
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {batchList.map((batch) => {
          const images = batch.images ?? []
          const failedCount = images.filter((i) => i.status === 'failed').length
          const uploadedCount = images.filter((i) => i.status === 'uploaded').length

          return (
            <div
              key={batch.id}
              className="rounded-2xl border border-border bg-card p-4 space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-semibold">{batch.batchName || 'Unnamed batch'}</h4>
                  <p className="text-sm text-muted-foreground">{batch.locationLabel}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {batch.imageCount} photo{batch.imageCount !== 1 ? 's' : ''} · {new Date(batch.createdAt).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onRemove(batch.id)}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Remove batch from queue"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(images ?? []).slice(0, 8).map((img) => {
                  const config = statusConfig[img.status] ?? statusConfig.queued
                  const Icon = config.icon
                  return (
                    <div
                      key={img.id}
                      className="relative aspect-square rounded-xl overflow-hidden border border-border bg-muted"
                    >
                      <img
                        src={img.imageUri}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1 p-1">
                        <Icon className="h-5 w-5 text-white" />
                        <span className="text-[10px] text-white font-medium truncate w-full text-center">
                          {config.label}
                        </span>
                        {(img.status === 'uploading' || img.status === 'retrying') && (
                          <Progress value={img.progress} className="h-1 w-full" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {images.length > 8 && (
                <p className="text-xs text-muted-foreground">
                  +{images.length - 8} more
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                <Badge variant="success">{uploadedCount} uploaded</Badge>
                {failedCount > 0 && (
                  <>
                    <Badge variant="destructive">{failedCount} failed</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRetry(batch.id, images)}
                      disabled={isUploading}
                      className="rounded-full"
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Retry
                    </Button>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

export function mapBatchesToDisplay(
  batches: Array<{
    id: string
    batch: { batchName: string; siteId: string; floorId: string; roomId: string }
    images: ImageItem[]
    createdAt: string
  }>
): QueuedBatchDisplay[] {
  return (batches ?? []).map((b) => ({
    id: b.id,
    batchName: b.batch?.batchName ?? 'Unnamed',
    locationLabel: getLocationLabel(
      b.batch?.siteId ?? '',
      b.batch?.floorId ?? '',
      b.batch?.roomId ?? ''
    ),
    imageCount: (b.images ?? []).length,
    images: b.images ?? [],
    createdAt: b.createdAt ?? new Date().toISOString(),
  }))
}
