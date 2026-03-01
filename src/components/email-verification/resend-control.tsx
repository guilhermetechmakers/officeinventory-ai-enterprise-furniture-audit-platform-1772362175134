import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'

const DEFAULT_COOLDOWN_SECONDS = 60

export interface ResendControlProps {
  onResend: () => void | Promise<void>
  cooldownSeconds?: number
  isResendDisabled?: boolean
  isLoading?: boolean
  className?: string
}

export function ResendControl({
  onResend,
  cooldownSeconds = 0,
  isResendDisabled = false,
  isLoading = false,
  className,
}: ResendControlProps) {
  const cooldown = cooldownSeconds ?? 0
  const disabled = isResendDisabled || isLoading || cooldown > 0

  return (
    <Button
      type="button"
      variant="default"
      onClick={() => onResend()}
      disabled={disabled}
      className={className}
      aria-label={cooldown > 0 ? `Resend email available in ${cooldown} seconds` : 'Resend verification email'}
    >
      {isLoading ? (
        <>
          <span className="h-4 w-4 animate-pulse rounded-full bg-primary-foreground/50" />
          Sending...
        </>
      ) : cooldown > 0 ? (
        <>
          <Mail className="h-4 w-4" aria-hidden />
          Resend in {cooldown}s
        </>
      ) : (
        <>
          <Mail className="h-4 w-4" aria-hidden />
          Resend verification email
        </>
      )}
    </Button>
  )
}

export { DEFAULT_COOLDOWN_SECONDS }
