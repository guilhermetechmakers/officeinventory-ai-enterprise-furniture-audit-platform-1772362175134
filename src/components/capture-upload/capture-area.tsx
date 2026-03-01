/**
 * CaptureArea: Launch camera or select from gallery, multi-photo support with thumbnails.
 */

import { useRef, useCallback } from 'react'
import { Camera, ImagePlus, X } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ImageItem } from '@/types/capture'

const ACCEPTED_TYPES = 'image/jpeg,image/png,image/webp,image/gif'

function fileToImageItem(file: File, id: string): ImageItem {
  const uri = URL.createObjectURL(file)
  return {
    id,
    batchId: '',
    imageUri: uri,
    mimeType: file.type || 'image/jpeg',
    size: file.size,
    status: 'queued',
    progress: 0,
    retryCount: 0,
  }
}

export interface CaptureAreaProps {
  images: ImageItem[]
  onImagesChange: (images: ImageItem[]) => void
  disabled?: boolean
}

export function CaptureArea({ images, onImagesChange, disabled }: CaptureAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : []
      const validFiles = files.filter((f) => f.type.startsWith('image/'))
      const newItems = validFiles.map((f) =>
        fileToImageItem(f, `img-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`)
      )
      onImagesChange([...(images ?? []), ...newItems])
      e.target.value = ''
    },
    [images, onImagesChange]
  )

  const removeImage = useCallback(
    (id: string) => {
      const item = (images ?? []).find((i) => i.id === id)
      if (item?.imageUri && item.imageUri.startsWith('blob:')) {
        URL.revokeObjectURL(item.imageUri)
      }
      onImagesChange((images ?? []).filter((i) => i.id !== id))
    },
    [images, onImagesChange]
  )

  const triggerFileSelect = () => fileInputRef.current?.click()
  const triggerCamera = () => cameraInputRef.current?.click()

  const imgList = images ?? []

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Photos</CardTitle>
        <CardDescription>
          Capture or select from gallery. Add batch metadata before upload.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          multiple
          capture={undefined}
          className="hidden"
          onChange={handleFileSelect}
          aria-label="Select images from gallery"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          capture="environment"
          className="hidden"
          onChange={handleFileSelect}
          aria-label="Capture photo with camera"
        />

        <div
          className={cn(
            'rounded-2xl border-2 border-dashed border-border bg-muted/30 p-8 text-center transition-colors',
            !disabled && 'hover:border-primary/50 hover:bg-primary/5'
          )}
        >
          <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" aria-hidden />
          <p className="font-medium mb-2">Add photos</p>
          <p className="text-sm text-muted-foreground mb-4">
            Use camera or select multiple from gallery
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              type="button"
              variant="default"
              size="lg"
              className="rounded-full min-h-[48px]"
              onClick={triggerCamera}
              disabled={disabled}
              aria-label="Capture with camera"
            >
              <Camera className="h-5 w-5 mr-2" />
              Capture
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="rounded-full min-h-[48px]"
              onClick={triggerFileSelect}
              disabled={disabled}
              aria-label="Select from gallery"
            >
              <ImagePlus className="h-5 w-5 mr-2" />
              Gallery
            </Button>
          </div>
        </div>

        {imgList.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">{imgList.length} photo(s) selected</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-40 overflow-y-auto">
              {imgList.map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square rounded-xl overflow-hidden border border-border bg-muted group"
                >
                  <img
                    src={img.imageUri}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    className="absolute top-1 right-1 rounded-full bg-destructive/90 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label={`Remove image ${img.id}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
