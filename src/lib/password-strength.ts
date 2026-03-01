/** Password strength calculation for real-time feedback */

export type StrengthTier = 0 | 1 | 2 | 3 | 4

export interface PasswordStrengthResult {
  score: StrengthTier
  label: string
  meetsPolicy: boolean
}

const LABELS: Record<StrengthTier, string> = {
  0: 'Very weak',
  1: 'Weak',
  2: 'Fair',
  3: 'Good',
  4: 'Strong',
}

/** Minimum requirements for enterprise policy (matches newPasswordSchema) */
const MIN_LENGTH = 12

function hasUppercase(p: string): boolean {
  return /[A-Z]/.test(p)
}

function hasLowercase(p: string): boolean {
  return /[a-z]/.test(p)
}

function hasNumber(p: string): boolean {
  return /[0-9]/.test(p)
}

function hasSpecial(p: string): boolean {
  return /[^A-Za-z0-9]/.test(p)
}

/** Compute password strength (0–4) and whether it meets policy */
export function computePasswordStrength(password: string): PasswordStrengthResult {
  if (!password || password.length === 0) {
    return { score: 0, label: LABELS[0], meetsPolicy: false }
  }

  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (hasUppercase(password)) score++
  if (hasLowercase(password)) score++
  if (hasNumber(password)) score++
  if (hasSpecial(password)) score++

  // Cap at 4 and map: 0-2 -> 0, 3 -> 1, 4 -> 2, 5 -> 3, 6 -> 4
  const tier = Math.min(4, Math.floor(score / 1.5)) as StrengthTier

  const meetsPolicy =
    password.length >= MIN_LENGTH &&
    hasUppercase(password) &&
    hasLowercase(password) &&
    hasNumber(password) &&
    hasSpecial(password)

  return {
    score: meetsPolicy ? 4 : tier,
    label: LABELS[meetsPolicy ? 4 : tier],
    meetsPolicy,
  }
}
