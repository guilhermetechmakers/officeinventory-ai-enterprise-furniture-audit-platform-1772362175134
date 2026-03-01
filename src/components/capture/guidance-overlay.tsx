/**
 * GuidanceOverlay - Framing tips, image count requirements, hints
 */

import { useState } from 'react'
import { HelpCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface GuidanceOverlayProps {
  minPhotos?: number
  currentCount?: number
  className?: string
}

const TIPS = [
  'Capture furniture items in good lighting for best AI detection.',
  'Include full item in frame when possible.',
  'Avoid blurry or dark images.',
  'Multiple angles help improve accuracy.',
]

export function GuidanceOverlay({
  minPhotos = 1,
  currentCount = 0,
  className,
}: GuidanceOverlayProps) {
  const [isOpen, setIsOpen] = useState(false)

  const remaining = Math.max(0, minPhotos - currentCount)
  const hasEnough = currentCount >= minPhotos

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full"
        aria-label="View capture guidance"
        aria-expanded={isOpen}
      >
        <HelpCircle className="h-5 w-5 text-muted-foreground" />
      </Button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 z-50 w-72 rounded-2xl border border-border bg-card p-4 shadow-overlay animate-slide-up"
          role="dialog"
          aria-label="Capture guidance"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm">Capture tips</h4>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 hover:bg-muted"
              aria-label="Close guidance"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {!hasEnough && (
            <p className="text-sm text-muted-foreground mb-3">
              Add {remaining} more photo{remaining !== 1 ? 's' : ''} to meet the minimum ({minPhotos} required).
            </p>
          )}

          <ul className="space-y-2">
            {TIPS.map((tip, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="text-primary shrink-0">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
