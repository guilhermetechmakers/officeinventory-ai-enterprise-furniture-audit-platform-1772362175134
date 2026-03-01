import { useNavigate } from 'react-router-dom'
import { EmailVerificationPage } from '@/components/email-verification'

/**
 * Email Verification page - intermediary screen after sign-up or email change.
 * Displays verification status, resend (with cooldown), change email, and next steps.
 *
 * For MVP: Uses simulated flows. Wire to Supabase or API when ready:
 * - POST /api/auth/resend-verification { email } -> { success, cooldownSeconds? }
 * - POST /api/auth/change-email { email } -> { success }
 * - GET /api/auth/verification-status -> { status: 'verified'|'pending'|'failed' }
 */
export function EmailVerificationPageRoute() {
  const navigate = useNavigate()

  // In a real app, userEmail and verificationStatus would come from auth context or route state
  const userEmail = sessionStorage.getItem('officeinventory_pending_verification_email') ?? undefined
  const verificationStatus =
    (sessionStorage.getItem('officeinventory_verification_status') as
      | 'pending'
      | 'verified'
      | 'failed') ?? 'pending'

  return (
    <EmailVerificationPage
      userEmail={userEmail}
      verificationStatus={verificationStatus}
      onResend={async () => {
        // Future: await resendVerification({ email })
        return { cooldownSeconds: 60 }
      }}
      onChangeEmail={async () => {
        // Future: await changeEmail({ email })
      }}
      onProceed={() => {
        sessionStorage.removeItem('officeinventory_pending_verification_email')
        sessionStorage.removeItem('officeinventory_verification_status')
        navigate('/dashboard')
      }}
    />
  )
}
