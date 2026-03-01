import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { StatusMessageCard } from './status-message-card'
import { ResendControl, DEFAULT_COOLDOWN_SECONDS } from './resend-control'
import { ChangeEmailModal } from './change-email-modal'
import { SupportLink } from './support-link'
import { NextStepsPanel } from './next-steps-panel'
import { useCountdownTimer } from '@/hooks/use-countdown-timer'
import { cn } from '@/lib/utils'
import type { VerificationStatus } from '@/types/auth'

/**
 * Simulated delay for MVP - replace with actual API call when integrating.
 * Future: POST /api/auth/resend-verification { email } -> { success, cooldownSeconds? }
 */
const SIMULATED_RESEND_DELAY_MS = 800

/**
 * Simulated delay for MVP - replace with actual API call when integrating.
 * Future: POST /api/auth/change-email { email } -> { success }
 */
const SIMULATED_CHANGE_EMAIL_DELAY_MS = 600

export interface EmailVerificationPageProps {
  userEmail?: string | null
  verificationStatus?: VerificationStatus | string | null
  onResend?: (email: string) => void | Promise<{ cooldownSeconds?: number }>
  onChangeEmail?: (email: string) => void | Promise<void>
  onProceed?: () => void
  cooldownSeconds?: number
}

export function EmailVerificationPage({
  userEmail,
  verificationStatus = 'pending',
  onResend,
  onChangeEmail,
  onProceed,
  cooldownSeconds: initialCooldown = DEFAULT_COOLDOWN_SECONDS,
}: EmailVerificationPageProps) {
  const [displayEmail, setDisplayEmail] = useState(userEmail ?? '')
  const [status, setStatus] = useState<VerificationStatus>(
    (verificationStatus as VerificationStatus) ?? 'pending'
  )
  const [showChangeEmailModal, setShowChangeEmailModal] = useState(false)
  const [isResendLoading, setIsResendLoading] = useState(false)

  const { remainingSeconds, start: startCooldown, isActive: isCooldownActive } = useCountdownTimer(
    initialCooldown ?? DEFAULT_COOLDOWN_SECONDS
  )

  useEffect(() => {
    setDisplayEmail(userEmail ?? '')
  }, [userEmail])

  useEffect(() => {
    const normalized = (verificationStatus ?? 'pending') as VerificationStatus
    if (normalized === 'verified' || normalized === 'pending' || normalized === 'failed') {
      setStatus(normalized)
    }
  }, [verificationStatus])

  const handleResend = useCallback(async () => {
    const email = displayEmail?.trim() ?? ''
    if (!email) {
      toast.error('Please enter your email address first')
      return
    }

    setIsResendLoading(true)
    try {
      if (onResend) {
        const result = await onResend(email)
        const cooldown = result?.cooldownSeconds ?? initialCooldown ?? DEFAULT_COOLDOWN_SECONDS
        startCooldown(cooldown)
        toast.success('Verification email sent')
      } else {
        await new Promise((r) => setTimeout(r, SIMULATED_RESEND_DELAY_MS))
        startCooldown(initialCooldown ?? DEFAULT_COOLDOWN_SECONDS)
        toast.success('Verification email sent')
      }
    } catch {
      toast.error('Failed to send verification email. Please try again.')
    } finally {
      setIsResendLoading(false)
    }
  }, [displayEmail, onResend, initialCooldown, startCooldown])

  const handleChangeEmail = useCallback(
    async (newEmail: string) => {
      if (onChangeEmail) {
        await onChangeEmail(newEmail)
      } else {
        await new Promise((r) => setTimeout(r, SIMULATED_CHANGE_EMAIL_DELAY_MS))
      }
      setDisplayEmail(newEmail)
      setStatus('pending')
      setShowChangeEmailModal(false)
      toast.success('Verification email sent to new address')
    },
    [onChangeEmail]
  )

  const isVerified = status === 'verified'

  const statusMessage =
    status === 'verified'
      ? 'Your email has been verified'
      : 'A verification email has been sent'

  const statusSubtext =
    status === 'verified'
      ? null
      : 'Verification may take a few minutes. Check your spam folder if you don\'t see it.'

  return (
    <div className="w-full space-y-8 animate-fade-in">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
          Verify your email
        </h1>
        <p className="text-muted-foreground">
          We need to confirm your email address to complete your account setup.
        </p>
      </div>

      <StatusMessageCard
        status={status}
        message={statusMessage}
        subtext={statusSubtext}
        email={displayEmail || undefined}
      />

      {!displayEmail ? (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <p className="text-sm text-muted-foreground">
            We couldn&apos;t find your email address. Please{' '}
            <button
              type="button"
              onClick={() => setShowChangeEmailModal(true)}
              className="font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
              aria-label="Enter your email address"
            >
              enter your email
            </button>{' '}
            to receive the verification link.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <ResendControl
              onResend={handleResend}
              cooldownSeconds={remainingSeconds}
              isResendDisabled={isCooldownActive}
              isLoading={isResendLoading}
              className="w-full sm:w-auto"
            />
            <button
              type="button"
              onClick={() => setShowChangeEmailModal(true)}
              className={cn(
                'text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded',
                'self-start sm:self-center'
              )}
              aria-label="Change email address"
            >
              Change email
            </button>
          </div>

          <div className="flex flex-col gap-4 pt-2">
            <SupportLink />
          </div>
        </>
      )}

      <NextStepsPanel
        isVerified={isVerified}
        onProceed={onProceed}
        proceedLabel="Continue to Dashboard"
        proceedTo="/dashboard"
      />

      <ChangeEmailModal
        open={showChangeEmailModal}
        onOpenChange={setShowChangeEmailModal}
        onSubmit={handleChangeEmail}
        currentEmail={displayEmail || undefined}
      />

      <p className="text-center text-sm text-muted-foreground">
        Already verified?{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
