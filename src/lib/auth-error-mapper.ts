/** Maps auth error codes to user-friendly, actionable messages */

const ERROR_MAP: Record<string, string> = {
  INVALID_CREDENTIALS: 'Incorrect email or password. Please try again.',
  ACCOUNT_LOCKED: 'Account locked. Contact your administrator to unlock.',
  ACCOUNT_DISABLED: 'Account is disabled. Contact support for assistance.',
  INSUFFICIENT_PERMISSIONS: 'You do not have permission to access this application.',
  SSO_MISCONFIGURED: 'SSO provider is misconfigured. Contact your administrator.',
  SSO_USER_NOT_FOUND: 'User not found in identity provider. Contact your administrator.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  PASSWORD_TOO_WEAK: 'Password does not meet security requirements.',
  RATE_LIMITED: 'Too many attempts. Please try again later.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNKNOWN: 'An unexpected error occurred. Please try again.',
}

export function mapAuthError(error: unknown): string {
  if (!error) return ERROR_MAP.UNKNOWN

  const err = error as { code?: string; message?: string }
  const code = err?.code ?? ''
  const message = err?.message ?? ''

  if (code && ERROR_MAP[code]) return ERROR_MAP[code]

  const lowerMessage = String(message).toLowerCase()
  if (lowerMessage.includes('invalid') && lowerMessage.includes('credential')) return ERROR_MAP.INVALID_CREDENTIALS
  if (lowerMessage.includes('locked')) return ERROR_MAP.ACCOUNT_LOCKED
  if (lowerMessage.includes('disabled')) return ERROR_MAP.ACCOUNT_DISABLED
  if (lowerMessage.includes('permission')) return ERROR_MAP.INSUFFICIENT_PERMISSIONS
  if (lowerMessage.includes('sso') || lowerMessage.includes('saml') || lowerMessage.includes('oidc'))
    return ERROR_MAP.SSO_MISCONFIGURED
  if (lowerMessage.includes('network') || lowerMessage.includes('fetch')) return ERROR_MAP.NETWORK_ERROR
  if (lowerMessage.includes('rate') || lowerMessage.includes('too many')) return ERROR_MAP.RATE_LIMITED

  return message || ERROR_MAP.UNKNOWN
}
