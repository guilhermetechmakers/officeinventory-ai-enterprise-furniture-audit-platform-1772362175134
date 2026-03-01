import { cn } from '@/lib/utils'
import { computePasswordStrength, type StrengthTier } from '@/lib/password-strength'

interface PasswordStrengthMeterProps {
  password: string
  className?: string
  /** Accessible label for screen readers */
  'aria-label'?: string
}

const TIER_COLORS: Record<StrengthTier, string> = {
  0: 'bg-destructive',
  1: 'bg-destructive/70',
  2: 'bg-warning',
  3: 'bg-info',
  4: 'bg-primary',
}

export function PasswordStrengthMeter({
  password,
  className,
  'aria-label': ariaLabel = 'Password strength',
}: PasswordStrengthMeterProps) {
  const { score, label, meetsPolicy } = computePasswordStrength(password)

  return (
    <div className={cn('space-y-2', className)} role="status" aria-live="polite">
      <div
        className="flex h-2 gap-1 rounded-full overflow-hidden bg-muted"
        aria-label={ariaLabel}
      >
        {([0, 1, 2, 3] as const).map((tier) => (
          <div
            key={tier}
            className={cn(
              'h-full flex-1 rounded-full transition-all duration-300',
              tier <= score ? TIER_COLORS[score] : 'bg-transparent'
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        {password.length > 0 ? (
          <>
            <span className={meetsPolicy ? 'text-primary font-medium' : ''}>{label}</span>
            {meetsPolicy && (
              <span className="ml-1 text-primary" aria-hidden>
                ✓
              </span>
            )}
          </>
        ) : (
          'Enter a password to see strength'
        )}
      </p>
    </div>
  )
}
