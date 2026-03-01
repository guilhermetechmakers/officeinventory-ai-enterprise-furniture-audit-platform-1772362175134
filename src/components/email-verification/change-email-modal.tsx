import { useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { EmailInputField, isValidEmail } from './email-input-field'

export interface ChangeEmailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (email: string) => void | Promise<void>
  currentEmail?: string | null
}

export function ChangeEmailModal({
  open,
  onOpenChange,
  onSubmit,
  currentEmail = '',
}: ChangeEmailModalProps) {
  const [newEmail, setNewEmail] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setNewEmail(currentEmail ?? '')
      setEmailError(null)
      setIsSubmitting(false)
      // Focus first input when modal opens
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open, currentEmail])

  const validateAndSubmit = (): boolean => {
    const trimmed = newEmail?.trim() ?? ''
    if (!trimmed) {
      setEmailError('Email is required')
      return false
    }
    if (!isValidEmail(trimmed)) {
      setEmailError('Please enter a valid email address')
      return false
    }
    setEmailError(null)
    return true
  }

  const handleSubmit = async () => {
    if (!validateAndSubmit()) return

    setIsSubmitting(true)
    try {
      await onSubmit(newEmail.trim())
      onOpenChange(false)
    } catch {
      setEmailError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBlur = () => {
    const trimmed = newEmail?.trim() ?? ''
    if (trimmed && !isValidEmail(trimmed)) {
      setEmailError('Please enter a valid email address')
    } else if (emailError) {
      setEmailError(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showClose={true}
        className="rounded-2xl"
        aria-modal="true"
        aria-labelledby="change-email-title"
        aria-describedby="change-email-desc"
      >
        <DialogHeader>
          <DialogTitle id="change-email-title">Change email address</DialogTitle>
          <DialogDescription id="change-email-desc">
            Enter a new email address. A verification link will be sent to the new address.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          className="space-y-4 py-4"
        >
          <EmailInputField
            ref={inputRef}
            value={newEmail}
            onChange={(v) => {
              setNewEmail(v)
              if (emailError && isValidEmail(v?.trim() ?? '')) setEmailError(null)
            }}
            onBlur={handleBlur}
            placeholder="you@company.com"
            error={emailError}
            id="change-email-input"
            aria-label="New email address"
          />
          <DialogFooter className="gap-2 sm:gap-0 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            aria-label="Cancel"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            aria-label="Update email address"
          >
            {isSubmitting ? 'Updating...' : 'Update email'}
          </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
