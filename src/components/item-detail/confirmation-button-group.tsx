/**
 * ConfirmationButtonGroup - Pill-shaped CTAs for Confirm, Merge, Flag
 * Consistent styling and states
 */

import { Check, Merge, Flag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface ConfirmationButtonGroupProps {
  onConfirm?: () => void
  onMerge?: () => void
  onFlag?: () => void
  isConfirmed?: boolean
  isFlagged?: boolean
  isConfirming?: boolean
  isMerging?: boolean
  isFlagging?: boolean
  className?: string
}

export function ConfirmationButtonGroup({
  onConfirm,
  onMerge,
  onFlag,
  isConfirmed = false,
  isFlagged = false,
  isConfirming = false,
  isMerging = false,
  isFlagging = false,
  className,
}: ConfirmationButtonGroupProps) {
  return (
    <div
      className={cn('flex flex-wrap gap-2', className)}
      role="group"
      aria-label="Item actions"
    >
      {onConfirm && (
        <Button
          variant={isConfirmed ? 'secondary' : 'default'}
          size="sm"
          onClick={onConfirm}
          disabled={isConfirmed || isConfirming}
          className="rounded-full"
        >
          <Check className="h-4 w-4 mr-2" />
          {isConfirming ? 'Confirming…' : isConfirmed ? 'Confirmed' : 'Confirm'}
        </Button>
      )}
      {onMerge && (
        <Button
          variant="outline"
          size="sm"
          onClick={onMerge}
          disabled={isMerging}
          className="rounded-full"
        >
          <Merge className="h-4 w-4 mr-2" />
          {isMerging ? 'Merging…' : 'Merge'}
        </Button>
      )}
      {onFlag && (
        <Button
          variant={isFlagged ? 'destructive' : 'outline'}
          size="sm"
          onClick={onFlag}
          disabled={isFlagged || isFlagging}
          className="rounded-full"
        >
          <Flag className="h-4 w-4 mr-2" />
          {isFlagging ? 'Flagging…' : isFlagged ? 'Flagged' : 'Flag'}
        </Button>
      )}
    </div>
  )
}
