import { useState } from 'react'
import { RefreshCw, XCircle, Flag, LayoutList, Image, AlertTriangle, FileText } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ThumbnailGallery } from './thumbnail-gallery'
import { ItemDetectionList } from './item-detection-list'
import { ProgressBar } from './progress-bar'
import { StatusBadge } from './status-badge'
import { cn } from '@/lib/utils'
import type { Batch, Item, ErrorDetail } from '@/types/bulk-upload'

type DrawerTab = 'summary' | 'items' | 'evidence' | 'errors'

interface BatchDetailDrawerProps {
  batch: Batch | null
  isOpen: boolean
  onClose: () => void
  onRetry?: (batch: Batch) => void
  onCancel?: (batch: Batch) => void
  onMarkReview?: (batch: Batch) => void
  isRetrying?: boolean
  isCancelling?: boolean
}

export function BatchDetailDrawer({
  batch,
  isOpen,
  onClose,
  onRetry,
  onCancel,
  onMarkReview,
  isRetrying = false,
  isCancelling = false,
}: BatchDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<DrawerTab>('summary')

  if (!batch) return null

  const items: Item[] = Array.isArray(batch.items) ? batch.items : []
  const errors: ErrorDetail[] = Array.isArray(batch.errors) ? batch.errors : []
  const imageUrls: string[] = Array.isArray(batch.imageUrls) ? batch.imageUrls : []

  const canRetry = batch.status === 'failed'
  const canCancel = batch.status === 'processing' || batch.status === 'pending'

  const formattedUpload = batch.uploadedAt
    ? new Date(batch.uploadedAt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : '—'
  const formattedInference = batch.inferenceStartedAt
    ? new Date(batch.inferenceStartedAt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : '—'

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="flex flex-col p-0">
        <SheetHeader className="border-b border-border px-6 py-4">
          <SheetTitle>{batch.name}</SheetTitle>
          <SheetDescription>
            {batch.site} · {batch.uploader}
          </SheetDescription>
          <div className="mt-2 flex items-center gap-2">
            <StatusBadge status={batch.status} />
            <ProgressBar value={batch.progress ?? 0} showLabel={true} />
          </div>
        </SheetHeader>

        <SheetBody className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DrawerTab)} className="h-full flex flex-col">
            <TabsList className="mx-6 mt-4 w-full justify-start rounded-full bg-muted/50">
              <TabsTrigger value="summary" className="rounded-full gap-1.5">
                <FileText className="h-4 w-4" />
                Summary
              </TabsTrigger>
              <TabsTrigger value="items" className="rounded-full gap-1.5">
                <LayoutList className="h-4 w-4" />
                Items ({items.length})
              </TabsTrigger>
              <TabsTrigger value="evidence" className="rounded-full gap-1.5">
                <Image className="h-4 w-4" />
                Evidence
              </TabsTrigger>
              <TabsTrigger value="errors" className="rounded-full gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                Errors ({errors.length})
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <TabsContent value="summary" className="mt-0 space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Timeline</h4>
                  <dl className="mt-2 space-y-2 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Uploaded</dt>
                      <dd className="font-medium">{formattedUpload}</dd>
                    </div>
                    {batch.inferenceStartedAt && (
                      <div>
                        <dt className="text-muted-foreground">Inference started</dt>
                        <dd className="font-medium">{formattedInference}</dd>
                      </div>
                    )}
                  </dl>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Images</h4>
                  <ThumbnailGallery imageUrls={imageUrls} className="mt-2" />
                </div>
                {items.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Detections preview</h4>
                    <ItemDetectionList items={items.slice(0, 3)} className="mt-2" />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="items" className="mt-0">
                <ItemDetectionList items={items} />
              </TabsContent>

              <TabsContent value="evidence" className="mt-0">
                <ThumbnailGallery imageUrls={imageUrls} />
                {items.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Evidence thumbnails</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {items.map((item) =>
                        (item.evidenceUrl ?? item.imageUrl) ? (
                          <div
                            key={item.id}
                            className="aspect-square overflow-hidden rounded-lg border border-border"
                          >
                            <img
                              src={item.evidenceUrl ?? item.imageUrl}
                              alt={`Evidence: ${item.type}`}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                            <p className="text-xs text-center py-1 truncate px-2">{item.type}</p>
                          </div>
                        ) : null
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="errors" className="mt-0">
                {errors.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No errors for this batch</p>
                ) : (
                  <div className="space-y-3">
                    {errors.map((err, i) => (
                      <div
                        key={`${err.code}-${i}`}
                        className="rounded-xl border border-destructive/30 bg-destructive/5 p-4"
                      >
                        <p className="font-medium text-destructive">{err.code}</p>
                        <p className="mt-1 text-sm text-foreground">{err.message}</p>
                        {err.timestamp && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {new Date(err.timestamp).toLocaleString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </SheetBody>

        <div className="flex flex-wrap gap-2 border-t border-border p-4">
          {canRetry && onRetry && (
            <Button
              onClick={() => onRetry(batch)}
              disabled={isRetrying}
              className="rounded-full"
              aria-label="Retry batch"
            >
              <RefreshCw className={cn('h-4 w-4 mr-2', isRetrying && 'animate-pulse')} />
              Retry batch
            </Button>
          )}
          {canCancel && onCancel && (
            <Button
              variant="outline"
              onClick={() => onCancel(batch)}
              disabled={isCancelling}
              className="rounded-full"
              aria-label="Cancel batch"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel batch
            </Button>
          )}
          {onMarkReview && (
            <Button
              variant="secondary"
              onClick={() => onMarkReview(batch)}
              className="rounded-full"
              aria-label="Mark for review"
            >
              <Flag className="h-4 w-4 mr-2" />
              Mark for review
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
