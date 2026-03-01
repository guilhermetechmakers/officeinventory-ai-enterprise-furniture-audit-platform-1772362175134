import { cn } from '@/lib/utils'

export interface ThumbnailGalleryProps {
  imageUrls?: string[] | null
  className?: string
  maxVisible?: number
}

export function ThumbnailGallery({
  imageUrls,
  className,
  maxVisible,
}: ThumbnailGalleryProps) {
  const urls = Array.isArray(imageUrls) ? imageUrls : []
  const visible = maxVisible != null ? urls.slice(0, maxVisible) : urls
  const remaining = maxVisible != null ? urls.length - maxVisible : 0

  if (urls.length === 0) {
    return (
      <div
        className={cn(
          'flex h-24 items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-sm text-muted-foreground',
          className
        )}
        role="img"
        aria-label="No images"
      >
        No images
      </div>
    )
  }

  return (
    <div
      className={cn('flex flex-wrap gap-2', className)}
      role="list"
      aria-label={`${urls.length} image thumbnails`}
    >
      {visible.map((url, i) => (
        <div
          key={`${url}-${i}`}
          className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/50"
          role="listitem"
        >
          <img
            src={url}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      ))}
      {remaining > 0 && (
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50 text-xs font-medium text-muted-foreground"
          role="listitem"
        >
          +{remaining}
        </div>
      )}
    </div>
  )
}
