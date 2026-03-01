/**
 * EvidenceModal - Lightbox-style modal to view cropped detections and source image
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ImageOff } from 'lucide-react'

export interface EvidenceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  evidenceUrl: string | null
  sourceImageUrl?: string | null
  itemCategory?: string
}

export function EvidenceModal({
  open,
  onOpenChange,
  evidenceUrl,
  sourceImageUrl,
  itemCategory,
}: EvidenceModalProps) {
  const hasEvidence = Boolean(evidenceUrl)
  const hasSource = Boolean(sourceImageUrl)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl"
        showClose={true}
        aria-label="View evidence"
      >
        <DialogHeader>
          <DialogTitle>
            Evidence {itemCategory ? `– ${itemCategory}` : ''}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Cropped Detection
            </p>
            <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
              {hasEvidence ? (
                <img
                  src={evidenceUrl ?? ''}
                  alt={`Evidence for ${itemCategory ?? 'item'}`}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div
                  className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground"
                  aria-hidden
                >
                  <ImageOff className="h-12 w-12" />
                  <span className="text-sm">No image available</span>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Source Image
            </p>
            <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
              {hasSource ? (
                <img
                  src={sourceImageUrl ?? ''}
                  alt="Source image"
                  className="h-full w-full object-contain"
                />
              ) : (
                <div
                  className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground"
                  aria-hidden
                >
                  <ImageOff className="h-12 w-12" />
                  <span className="text-sm">No source image</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
