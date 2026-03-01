/**
 * ImageLightbox - Reusable lightbox for viewing full-size images
 * Keyboard accessible: Esc to close, Arrow keys to navigate
 */

import { useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
export interface ImageLightboxProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  images: Array<{ id: string; url: string; thumbnailUrl?: string }>
  currentIndex: number
  onIndexChange?: (index: number) => void
  alt?: string
}

export function ImageLightbox({
  open,
  onOpenChange,
  images,
  currentIndex,
  onIndexChange,
  alt = 'Image',
}: ImageLightboxProps) {
  const safeImages = images ?? []
  const count = safeImages.length
  const index = Math.max(0, Math.min(currentIndex, count - 1))
  const current = count > 0 ? safeImages[index] : null

  const goPrev = useCallback(() => {
    if (count <= 1) return
    const next = index <= 0 ? count - 1 : index - 1
    onIndexChange?.(next)
  }, [count, index, onIndexChange])

  const goNext = useCallback(() => {
    if (count <= 1) return
    const next = index >= count - 1 ? 0 : index + 1
    onIndexChange?.(next)
  }, [count, index, onIndexChange])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onOpenChange, goPrev, goNext])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl p-0 overflow-hidden"
        aria-label="View image"
      >
        <div className="relative flex items-center justify-center min-h-[60vh] bg-[rgb(var(--primary-foreground))]/5">
          {current ? (
            <>
              <img
                src={current.url}
                alt={`${alt} ${index + 1} of ${count}`}
                className="max-h-[70vh] w-auto object-contain"
              />
              {count > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon-lg"
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full shadow-elevated"
                    onClick={goPrev}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon-lg"
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full shadow-elevated"
                    onClick={goNext}
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                  <span
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-sm text-white"
                    aria-live="polite"
                  >
                    {index + 1} / {count}
                  </span>
                </>
              )}
            </>
          ) : (
            <div
              className="flex flex-col items-center justify-center gap-4 text-muted-foreground py-16"
              aria-hidden
            >
              <ImageOff className="h-16 w-16" />
              <span className="text-sm">No image available</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
