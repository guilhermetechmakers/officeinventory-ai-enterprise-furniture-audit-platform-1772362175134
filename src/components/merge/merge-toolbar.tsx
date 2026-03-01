/**
 * MergeToolbar - Primary action button for merge flow
 */

import { useEffect, useCallback } from 'react'
import { Merge } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface MergeToolbarProps {
  isMergeEnabled: boolean
  onConfirmMerge: () => void
  isLoading?: boolean
  className?: string
}

export function MergeToolbar({
  isMergeEnabled,
  onConfirmMerge,
  isLoading = false,
  className,
}: MergeToolbarProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        if (isMergeEnabled && !isLoading) {
          onConfirmMerge()
        }
      }
    },
    [isMergeEnabled, isLoading, onConfirmMerge]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border border-border bg-secondary px-4 py-3 shadow-card',
        className
      )}
      role="toolbar"
      aria-label="Merge actions"
    >
      <Button
        onClick={onConfirmMerge}
        disabled={!isMergeEnabled || isLoading}
        className={cn(
          'rounded-full',
          isMergeEnabled && 'bg-primary text-primary-foreground'
        )}
      >
        <Merge className="h-4 w-4 mr-2" />
        {isLoading ? 'Merging…' : 'Confirm Merge'}
      </Button>
      <span className="text-xs text-muted-foreground">
        ⌘+Enter to confirm
      </span>
    </div>
  )
}
