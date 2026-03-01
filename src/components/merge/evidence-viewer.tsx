/**
 * EvidenceViewer - Side-by-side cropped detections and source images
 * Responsive grid with zoom/pan and metadata overlays
 */

import { useState, useCallback } from 'react'
import { ZoomIn, ImageOff, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ensureArray } from '@/lib/safe-array'
import { ImageLightbox } from '@/components/item-detail/image-lightbox'
import type { EvidenceItem } from '@/types/merge'

export interface EvidenceViewerProps {
  evidenceList: EvidenceItem[]
  canonicalItemId?: string
  onSelectCanonical?: (itemId: string) => void
  isLoading?: boolean
  className?: string
}

export function EvidenceViewer({
  evidenceList,
  canonicalItemId,
  onSelectCanonical,
  isLoading = false,
  className,
}: EvidenceViewerProps) {
  const safeList = ensureArray(evidenceList)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(100)

  const allImages = safeList.flatMap((e) => {
    const items: Array<{ id: string; url: string; thumbnailUrl?: string }> = []
    const crop = e?.croppedUrl ?? e?.imageUrl
    if (crop) {
      items.push({
        id: `${e?.id ?? ''}-crop`,
        url: crop,
        thumbnailUrl: crop,
      })
    }
    const full = e?.imageUrl
    if (full && full !== crop) {
      items.push({
        id: `${e?.id ?? ''}-full`,
        url: full,
        thumbnailUrl: e?.croppedUrl ?? full,
      })
    }
    return items
  })

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }, [])

  const cycleZoom = useCallback(() => {
    setZoomLevel((z) => (z >= 200 ? 100 : z + 50))
  }, [])

  if (isLoading) {
    return (
      <div
        className={cn(
          'rounded-2xl border border-border bg-secondary p-6 shadow-card',
          className
        )}
        role="status"
        aria-label="Loading evidence"
      >
        <h3 className="text-base font-bold text-foreground mb-4">Evidence</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-xl bg-muted/50 animate-pulse"
              aria-hidden
            />
          ))}
        </div>
      </div>
    )
  }

  if (safeList.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 py-16',
          className
        )}
        role="status"
        aria-label="No evidence"
      >
        <ImageOff className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-sm font-medium text-foreground">No evidence available</p>
        <p className="text-xs text-muted-foreground mt-1">
          Select a duplicate group to load evidence
        </p>
      </div>
    )
  }

  return (
    <>
      <div
        className={cn(
          'rounded-2xl border border-border bg-secondary p-6 shadow-card',
          className
        )}
        role="region"
        aria-label="Evidence viewer"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">
            Evidence
          </h3>
          <button
            type="button"
            onClick={cycleZoom}
            className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label={`Zoom ${zoomLevel}%`}
          >
            <ZoomIn className="h-4 w-4" />
            {zoomLevel}%
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {safeList.map((evidence, idx) => {
            const isCanonical = canonicalItemId === evidence?.itemId
            const cropUrl = evidence?.croppedUrl ?? evidence?.imageUrl
            const fullUrl = evidence?.imageUrl
            const lightboxIdx = allImages.findIndex(
              (img) => img.id === `${evidence?.id ?? ''}-crop` || img.id === `${evidence?.id ?? ''}-full`
            )

            return (
              <div
                key={evidence?.id ?? idx}
                role={onSelectCanonical ? 'button' : undefined}
                tabIndex={onSelectCanonical ? 0 : undefined}
                onClick={
                  onSelectCanonical
                    ? () => onSelectCanonical(evidence?.itemId ?? '')
                    : undefined
                }
                onKeyDown={
                  onSelectCanonical
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          onSelectCanonical(evidence?.itemId ?? '')
                        }
                      }
                    : undefined
                }
                className={cn(
                  'rounded-xl border overflow-hidden transition-all duration-200',
                  isCanonical
                    ? 'border-primary ring-2 ring-primary/30'
                    : 'border-border hover:border-primary/30',
                  onSelectCanonical && 'cursor-pointer'
                )}
              >
                <div
                  className="relative aspect-square bg-muted"
                  style={{ fontSize: `${zoomLevel / 100}em` }}
                >
                  {cropUrl ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        openLightbox(lightboxIdx >= 0 ? lightboxIdx : idx)
                      }}
                      className="block h-full w-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset"
                      aria-label={`View evidence for item ${evidence?.itemId}`}
                    >
                      <img
                        src={cropUrl}
                        alt=""
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity hover:bg-black/20 hover:opacity-100">
                        <ExternalLink className="h-8 w-8 text-white" />
                      </span>
                    </button>
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                      <ImageOff className="h-12 w-12" />
                      <span className="text-sm">No image</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2 text-xs text-white">
                    <span>Item: {evidence?.itemId ?? '—'}</span>
                    {isCanonical && (
                      <span className="ml-2 rounded bg-primary px-1.5 py-0.5 text-primary-foreground">
                        Canonical
                      </span>
                    )}
                  </div>
                </div>
                {fullUrl && fullUrl !== cropUrl && (
                  <div className="border-t border-border p-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        openLightbox(lightboxIdx >= 0 ? lightboxIdx + 1 : idx + 1)
                      }}
                      className="flex w-full items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View full source
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <ImageLightbox
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        images={allImages}
        currentIndex={lightboxIndex}
        onIndexChange={setLightboxIndex}
        alt="Evidence"
      />
    </>
  )
}
