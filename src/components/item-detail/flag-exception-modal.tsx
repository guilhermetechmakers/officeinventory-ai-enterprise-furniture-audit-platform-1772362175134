/**
 * FlagExceptionModal - Modal workflow to capture flag reason and optional notes
 * Triggers server-side flagging; requires min 10 chars for reason
 */

import { useState } from 'react'
import { Flag } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const MIN_REASON_LENGTH = 10

export interface FlagExceptionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFlag: (reason: string, notes?: string) => void | Promise<void>
  itemCategory?: string
}

export function FlagExceptionModal({
  open,
  onOpenChange,
  onFlag,
  itemCategory = 'Item',
}: FlagExceptionModalProps) {
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isValid = (reason?.trim() ?? '').length >= MIN_REASON_LENGTH

  const handleClose = () => {
    setReason('')
    setNotes('')
    setError(null)
    onOpenChange(false)
  }

  const handleSubmit = async () => {
    const trimmed = reason.trim()
    if (trimmed.length < MIN_REASON_LENGTH) {
      setError(`Reason must be at least ${MIN_REASON_LENGTH} characters`)
      return
    }
    setIsSubmitting(true)
    setError(null)
    try {
      await onFlag(trimmed, notes.trim() || undefined)
      handleClose()
    } catch {
      setError('Failed to flag item')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md"
        aria-label="Flag item as exception"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-warning" />
            Flag as Exception
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Provide a reason for flagging this {itemCategory.toLowerCase()}. This
            will move it to the exceptions queue for review.
          </p>
          <div>
            <label htmlFor="flag-reason" className="text-sm font-medium text-foreground">
              Reason <span className="text-destructive">*</span>
            </label>
            <Input
              id="flag-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Incorrect category, damaged, or missing"
              minLength={MIN_REASON_LENGTH}
              className="mt-2"
              aria-required
              aria-invalid={!isValid && reason.length > 0}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Minimum {MIN_REASON_LENGTH} characters
            </p>
          </div>
          <div>
            <label htmlFor="flag-notes" className="text-sm font-medium text-foreground">
              Additional notes (optional)
            </label>
            <Input
              id="flag-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional context"
              className="mt-2"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={handleClose}
            className="rounded-full"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="rounded-full"
          >
            {isSubmitting ? 'Flagging…' : 'Flag item'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
