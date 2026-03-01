/**
 * GuidanceOverlay: Framing tips, image count requirements, and hints.
 */

import { Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface GuidanceOverlayProps {
  imageCount: number
  minImages?: number
  isExpanded?: boolean
  onToggle?: () => void
  className?: string
}

const TIPS = [
  'Capture furniture from multiple angles for best AI detection.',
  'Ensure good lighting and avoid glare.',
  'Include full items in frame when possible.',
  'Overlap between photos helps with room mapping.',
]

export function GuidanceOverlay({
  imageCount,
  minImages = 1,
  isExpanded = false,
  onToggle,
  className,
}: GuidanceOverlayProps) {
  const meetsMinimum = imageCount >= minImages

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card/95 backdrop-blur-sm overflow-hidden',
        className
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-2 p-4 text-left hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset"
        aria-expanded={isExpanded}
        aria-label="Toggle framing tips"
      >
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-info shrink-0" aria-hidden />
          <span className="font-medium">Framing tips</span>
          <span
            className={cn(
              'text-sm',
              meetsMinimum ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            ({imageCount} photo{imageCount !== 1 ? 's' : ''} selected
            {minImages > 1 ? `, min ${minImages}` : ''})
          </span>
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 pt-0 space-y-2 animate-in">
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {(TIPS ?? []).map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
