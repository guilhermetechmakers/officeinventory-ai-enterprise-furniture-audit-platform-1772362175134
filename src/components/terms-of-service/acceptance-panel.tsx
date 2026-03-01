/**
 * AcceptancePanel - Checkbox + action button for ToS acceptance.
 * Sticky or anchored near bottom when in signup flow.
 */

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { UseTermsAcceptanceReturn } from '@/hooks/use-terms-acceptance'

export interface AcceptancePanelProps {
  acceptance: UseTermsAcceptanceReturn
  /** When true, panel is sticky at bottom (e.g. signup flow) */
  sticky?: boolean
  /** Callback when user successfully accepts */
  onAccepted?: () => void
  className?: string
}

export function AcceptancePanel({
  acceptance,
  sticky = false,
  onAccepted,
  className,
}: AcceptancePanelProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [checked, setChecked] = useState(false)

  const handleAccept = async () => {
    if (!checked) return
    setIsSubmitting(true)
    try {
      const success = await acceptance.acceptTerms()
      if (success) {
        acceptance.setAccepted(true)
        onAccepted?.()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-card p-6 shadow-card',
        sticky && 'sticky bottom-6',
        className
      )}
      role="region"
      aria-label="Terms of Service acceptance"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label
          htmlFor="tos-accept-checkbox"
          className="flex items-start gap-3 cursor-pointer text-sm text-foreground"
        >
          <Checkbox
            id="tos-accept-checkbox"
            checked={checked}
            onCheckedChange={(v) => setChecked(v === true)}
            aria-describedby="tos-accept-label"
            className="mt-0.5"
          />
          <span id="tos-accept-label">
            I have read and accept the Terms of Service
          </span>
        </label>
        <Button
          onClick={handleAccept}
          disabled={!checked || isSubmitting}
          aria-busy={isSubmitting}
          className="shrink-0"
        >
          {isSubmitting ? 'Accepting...' : 'Accept'}
        </Button>
      </div>
    </div>
  )
}
