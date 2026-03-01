import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NewPasswordForm } from './new-password-form'
import { RedirectToLoginCTA } from './redirect-to-login-cta'
import { cn } from '@/lib/utils'

type TokenState = 'pending' | 'valid' | 'invalid' | 'expired' | 'success'

function parseHashParams(): Record<string, string> {
  const hash = window.location.hash?.slice(1) ?? ''
  if (!hash) return {}
  return hash.split('&').reduce((acc, pair) => {
    const [k, v] = pair.split('=')
    if (k && v) acc[decodeURIComponent(k)] = decodeURIComponent(v)
    return acc
  }, {} as Record<string, string>)
}

const useSupabase = Boolean(import.meta.env.VITE_SUPABASE_URL)

export function ResetTokenValidationView() {
  const [searchParams] = useSearchParams()
  const queryToken = searchParams.get('token') ?? null
  const [tokenState, setTokenState] = useState<TokenState>('pending')
  const [resetSuccess, setResetSuccess] = useState(false)

  useEffect(() => {
    if (useSupabase) {
      const params = parseHashParams()
      const hasRecoveryHash = params?.type === 'recovery' || !!params?.access_token

      if (!hasRecoveryHash) {
        setTokenState('invalid')
        return
      }

      const checkSession = async () => {
        const { data } = await supabase.auth.getSession()
        const session = data?.session ?? null

        if (session) {
          setTokenState('valid')
        } else {
          setTokenState('expired')
        }
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event) => {
          if (event === 'PASSWORD_RECOVERY') {
            setTokenState('valid')
          }
        }
      )

      checkSession()

      return () => {
        subscription?.unsubscribe()
      }
    } else {
      if (queryToken && queryToken.length > 0) {
        setTokenState('valid')
      } else {
        setTokenState('invalid')
      }
    }
  }, [queryToken])

  const handleSuccess = () => {
    setResetSuccess(true)
  }

  if (resetSuccess) {
    return (
      <div className="w-full space-y-6 animate-fade-in">
        <div className="space-y-2 text-center lg:text-left">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Password reset complete
          </h1>
          <p className="text-muted-foreground">
            Your password has been updated. You can now sign in with your new password.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <RedirectToLoginCTA />
        </div>
      </div>
    )
  }

  if (tokenState === 'pending') {
    return (
      <div className="w-full space-y-6 animate-fade-in">
        <div className="space-y-2 text-center lg:text-left">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Validating reset link
          </h1>
          <p className="text-muted-foreground">
            Please wait while we verify your reset link...
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <div className="h-6 w-6 animate-pulse rounded-full bg-muted" />
            <span>Verifying...</span>
          </div>
        </div>
      </div>
    )
  }

  if (tokenState === 'invalid' || tokenState === 'expired') {
    const isExpired = tokenState === 'expired'
    return (
      <div className="w-full space-y-6 animate-fade-in">
        <div className="space-y-2 text-center lg:text-left">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            {isExpired ? 'Link expired' : 'Invalid link'}
          </h1>
          <p className="text-muted-foreground">
            {isExpired
              ? 'This password reset link has expired. Please request a new one.'
              : 'This password reset link is invalid or has already been used.'}
          </p>
        </div>
        <div
          className={cn(
            'rounded-2xl border p-6',
            isExpired
              ? 'border-warning bg-warning/10'
              : 'border-destructive bg-destructive/10'
          )}
        >
          <div className="flex items-start gap-3">
            {isExpired ? (
              <AlertTriangle className="h-6 w-6 shrink-0 text-warning" aria-hidden />
            ) : (
              <AlertCircle className="h-6 w-6 shrink-0 text-destructive" aria-hidden />
            )}
            <div className="space-y-4">
              <p className="text-sm">
                {isExpired
                  ? 'Password reset links expire after 1 hour for security. Request a new link to continue.'
                  : 'Please request a new password reset from the link below.'}
              </p>
              <Link to="/password-reset/request">
                <Button
                  variant="outline"
                  className="w-full rounded-full"
                >
                  Request new reset link
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost" className="w-full rounded-full">
                  Back to sign in
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (tokenState === 'valid') {
    return (
      <div className="w-full space-y-6 animate-fade-in">
        <div className="space-y-2 text-center lg:text-left">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Set new password
          </h1>
          <p className="text-muted-foreground">
            Enter your new password below. Make sure it meets the security requirements.
          </p>
        </div>
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 mb-4">
          <div className="flex items-center gap-2 text-primary">
            <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden />
            <span className="text-sm font-medium">Reset link verified</span>
          </div>
        </div>
        <NewPasswordForm onSuccess={handleSuccess} token={queryToken} />
      </div>
    )
  }

  return null
}
