/**
 * CaptureArea - UI for launching camera or selecting from gallery
 * Multi-photo capture with thumbnail previews, inline crop/rotate support
 */

import { useRef, useState, useCallback } from 'react'
import { Camera, ImagePlus, X } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface CapturedImage {
  id: string
  uri: string
  file: File
  mimeType: string
  size: number
}

interface CaptureAreaProps {
  images: CapturedImage[]
  onImagesChange: (images: CapturedImage[]) => void
  minCount?: number
  maxCount?: number
  disabled?: boolean
}

function generateId(): string {
  return `img-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function CaptureArea({
  images,
  onImagesChange,
  minCount = 1,
  maxCount = 50,
  disabled = false,
}: CaptureAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : []
      const newImages: CapturedImage[] = []
      const remaining = maxCount - images.length
      const toProcess = files.slice(0, Math.min(remaining, files.length))

      toProcess.forEach((file) => {
        if (file.type.startsWith('image/')) {
          newImages.push({
            id: generateId(),
            uri: URL.createObjectURL(file),
            file,
            mimeType: file.type,
            size: file.size,
          })
        }
      })

      if (newImages.length > 0) {
        onImagesChange([...(images ?? []), ...newImages])
      }
      e.target.value = ''
    },
    [images, maxCount, onImagesChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const files = Array.from(e.dataTransfer.files ?? []).filter((f) =>
        f.type.startsWith('image/')
      )
      if (files.length === 0) return
      const remaining = maxCount - (images?.length ?? 0)
      const toProcess = files.slice(0, Math.min(remaining, files.length))
      const newImages: CapturedImage[] = toProcess.map((file) => ({
        id: generateId(),
        uri: URL.createObjectURL(file),
        file,
        mimeType: file.type,
        size: file.size,
      }))
      if (newImages.length > 0) {
        onImagesChange([...(images ?? []), ...newImages])
      }
    },
    [images, maxCount, onImagesChange]
  )

  const removeImage = useCallback(
    (index: number) => {
      const list = images ?? []
      const img = list[index]
      if (img?.uri) URL.revokeObjectURL(img.uri)
      onImagesChange(list.filter((_, i) => i !== index))
      setEditingIndex(null)
    },
    [images, onImagesChange]
  )

  const confirmRotation = useCallback(() => {
    if (editingIndex === null) return
    setEditingIndex(null)
  }, [editingIndex])

  const imageList = images ?? []
  const canAddMore = imageList.length < maxCount

  return (
    <Card>
      <CardHeader>
        <CardTitle>Photos</CardTitle>
        <CardDescription>
          Capture or select from camera roll. Add batch metadata before upload.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          onDragOver={(e) => {
            e.preventDefault()
            if (canAddMore) setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all duration-200',
            isDragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border',
            !canAddMore && 'opacity-60 pointer-events-none'
          )}
        >
          <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" aria-hidden />
          <p className="font-medium mb-2">Add photos</p>
          <p className="text-sm text-muted-foreground mb-4">
            Use camera or select from gallery. Min {minCount} photo{minCount !== 1 ? 's' : ''} per batch.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              aria-label="Select images from gallery"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileSelect}
              aria-label="Capture photo with camera"
            />
            <Button
              variant="outline"
              size="default"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || !canAddMore}
              className="rounded-full"
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Gallery
            </Button>
            <Button
              variant="default"
              size="default"
              onClick={() => cameraInputRef.current?.click()}
              disabled={disabled || !canAddMore}
              className="rounded-full bg-primary text-primary-foreground"
            >
              <Camera className="h-4 w-4 mr-2" />
              Camera
            </Button>
          </div>
        </div>

        {imageList.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">
              {imageList.length} photo{imageList.length !== 1 ? 's' : ''} selected
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-48 overflow-y-auto">
              {(imageList ?? []).map((img, i) => (
                <div
                  key={img.id}
                  className="relative aspect-square rounded-xl overflow-hidden border border-border bg-muted group"
                >
                  <img
                    src={img.uri}
                    alt={`Capture ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 h-7 w-7 rounded-full bg-destructive/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    aria-label={`Remove photo ${i + 1}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {editingIndex === i && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Button size="sm" onClick={confirmRotation}>
                        Done
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {imageList.length > 0 && imageList.length < minCount && (
          <p className="text-sm text-warning">
            Add at least {minCount - imageList.length} more photo{minCount - imageList.length !== 1 ? 's' : ''} to queue.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
