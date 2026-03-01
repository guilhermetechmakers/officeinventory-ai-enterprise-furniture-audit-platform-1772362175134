/**
 * EvidenceView - Cropped detection image, link to full image, source images gallery
 * Click opens lightbox; lazy-loads images
 */

import { useState, useCallback } from 'react'
import { ExternalLink, ImageOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ImageLightbox } from './image-lightbox'
import type { SourceImage } from '@/types/item-detail'
import { ensureArray } from '@/lib/safe-array'

export interface EvidenceViewProps {
  croppedDetectionImageUrl: string | null
  sourceImages: SourceImage[]
  itemCategory?: string
  className?: string
}

export function EvidenceView({
  croppedDetectionImageUrl,
  sourceImages,
  itemCategory = 'Item',
  className,
}: EvidenceViewProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const safeSources = ensureArray(sourceImages)
  const hasCrop = Boolean(croppedDetectionImageUrl)

  const allImages = hasCrop
    ? [
        {
          id: 'crop',
          url: croppedDetectionImageUrl ?? '',
          thumbnailUrl: croppedDetectionImageUrl ?? '',
        },
        ...safeSources,
      ]
    : safeSources

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }, [])

  return (
    <>
      <div
        className={cn(
          'space-y-6 rounded-2xl border border-border bg-card p-6 shadow-card',
          className
        )}
        role="region"
        aria-label="Evidence"
      >
        <h3 className="text-base font-semibold text-foreground">
          Primary Evidence
        </h3>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Cropped Detection
            </p>
            <button
              type="button"
              onClick={() => openLightbox(0)}
              className="relative block w-full overflow-hidden rounded-xl border border-border bg-muted aspect-square transition-all duration-200 hover:shadow-elevated focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="View cropped detection in full size"
            >
              {hasCrop ? (
                <>
                  <img
                    src={croppedDetectionImageUrl ?? ''}
                    alt={`Cropped detection for ${itemCategory}`}
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity hover:bg-black/20 hover:opacity-100">
                    <ExternalLink className="h-8 w-8 text-white" />
                  </span>
                </>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  <ImageOff className="h-12 w-12" aria-hidden />
                  <span className="text-sm">No cropped image</span>
                </div>
              )}
            </button>
            {hasCrop && (
              <button
                type="button"
                onClick={() => openLightbox(0)}
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                View full size
              </button>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Source Images
            </p>
            {safeSources.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {safeSources.map((img, i) => (
                  <button
                    key={img?.id ?? i}
                    type="button"
                    onClick={() => openLightbox(hasCrop ? i + 1 : i)}
                    className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted transition-all duration-200 hover:shadow-elevated focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    aria-label={`View source image ${i + 1}`}
                  >
                    <img
                      src={img?.thumbnailUrl ?? img?.url ?? ''}
                      alt={`Source ${i + 1}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex aspect-video flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/50 text-muted-foreground">
                <ImageOff className="h-10 w-10 mb-2" />
                <span className="text-sm">No source images</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <ImageLightbox
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        images={allImages}
        currentIndex={lightboxIndex}
        onIndexChange={setLightboxIndex}
        alt={itemCategory}
      />
    </>
  )
}
