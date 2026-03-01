import { useMemo } from 'react'
import { cn } from '@/lib/utils'

export type PasswordStrengthTier = 0 | 1 | 2 | 3 | 4

const TIER_LABELS: Record<PasswordStrengthTier, string> = {
  0: 'Very weak',
  1: 'Weak',
  2: 'Fair',
  3: 'Strong',
  4: 'Very strong',
}

const TIER_COLORS: Record<PasswordStrengthTier, string> = {
  0: 'bg-destructive',
  1: 'bg-destructive/80',
  2: 'bg-warning',
  3: 'bg-primary/80',
  4: 'bg-primary',
}

/** Calculate password strength (0–4) based on length and character variety */
export function getPasswordStrength(password: string): PasswordStrengthTier {
  if (!password || password.length === 0) return 0

  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return 1
  if (score <= 2) return 2
  if (score <= 3) return 3
  return 4
}

export interface PasswordStrengthMeterProps {
  password: string
  className?: string
  showLabel?: boolean
}

export function PasswordStrengthMeter({
  password,
  className,
  showLabel = true,
}: PasswordStrengthMeterProps) {
  const strength = useMemo(() => getPasswordStrength(password ?? ''), [password])
  const tier = Math.min(strength, 4) as PasswordStrengthTier

  return (
    <div className={cn('space-y-2', className)} role="meter" aria-valuenow={tier} aria-valuemin={0} aria-valuemax={4} aria-label={`Password strength: ${TIER_LABELS[tier]}`}>
      <div className="flex gap-1">
        {([0, 1, 2, 3] as const).map((i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-all duration-300',
              i < tier ? TIER_COLORS[tier] : 'bg-muted'
            )}
          />
        ))}
      </div>
      {showLabel && password.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Strength: <span className={cn('font-medium', tier >= 3 ? 'text-primary' : tier >= 2 ? 'text-warning' : 'text-destructive')}>{TIER_LABELS[tier]}</span>
        </p>
      )}
    </div>
  )
}
