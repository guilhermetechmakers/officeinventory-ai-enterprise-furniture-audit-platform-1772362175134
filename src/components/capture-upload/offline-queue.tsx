/**
 * OfflineQueue: Displays queued batches with status, progress, retry.
 */

import { Trash2, RefreshCw, Upload } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { Batch, ImageItem } from '@/types/capture'

const STATUS_LABELS: Record<ImageItem['status'], string> = {
  queued: 'Queued',
  uploading: 'Uploading',
  uploaded: 'Uploaded',
  failed: 'Failed',
  retrying: 'Retrying',
}

const STATUS_VARIANTS: Record<ImageItem['status'], 'default' | 'secondary' | 'success' | 'destructive' | 'warning' | 'info'> = {
  queued: 'secondary',
  uploading: 'info',
  uploaded: 'success',
  failed: 'destructive',
  retrying: 'warning',
}

export interface OfflineQueueProps {
  queuedBatches: Array<{ batch: Batch; images: ImageItem[] }>
  isOnline: boolean
  onRetry: (batch: Batch, images: ImageItem[]) => void
  onRemove: (batchId: string) => void
  isUploading?: boolean
}

export function OfflineQueue({
  queuedBatches,
  isOnline,
  onRetry,
  onRemove,
  isUploading = false,
}: OfflineQueueProps) {
  const batches = queuedBatches ?? []

  if (batches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upload queue</CardTitle>
          <CardDescription>Queued batches will appear here. Photos sync when online.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 text-center">
            <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" aria-hidden />
            <p className="text-sm text-muted-foreground">No items in queue</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload queue</CardTitle>
        <CardDescription>
          {batches.length} batch(es) — {isOnline ? 'Uploading when ready' : 'Offline — will sync when online'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {batches.map(({ batch, images }) => {
          const imgs = images ?? []
          const pending = imgs.filter(
            (i) => i.status === 'queued' || i.status === 'failed' || i.status === 'retrying'
          )

          return (
            <div
              key={batch.id}
              className="rounded-xl border border-border bg-secondary/50 p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{batch.batchName || `Batch ${batch.id.slice(-6)}`}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(batch.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {pending.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => onRetry(batch, images)}
                      disabled={!isOnline || isUploading}
                      aria-label={`Retry upload for batch ${batch.batchName}`}
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Retry
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-destructive hover:text-destructive"
                    onClick={() => onRemove(batch.id)}
                    aria-label={`Remove batch ${batch.batchName} from queue`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {imgs.slice(0, 8).map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-square rounded-lg overflow-hidden border border-border bg-muted"
                  >
                    <img
                      src={img.imageUri}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1">
                      <Badge
                        variant={STATUS_VARIANTS[img.status]}
                        className="text-xs"
                      >
                        {STATUS_LABELS[img.status]}
                      </Badge>
                      {(img.status === 'uploading' || img.status === 'retrying') && (
                        <Progress value={img.progress} className="w-3/4 h-1" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {imgs.length > 8 && (
                <p className="text-xs text-muted-foreground">+{imgs.length - 8} more</p>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
