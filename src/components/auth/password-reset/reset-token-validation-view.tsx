import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react'
import { NewPasswordForm } from './new-password-form'
import { RedirectToLoginCTA } from './redirect-to-login-cta'
import { supabase } from '@/lib/supabase'

const useSupabase = Boolean(import.meta.env.VITE_SUPABASE_URL)

export type TokenState = 'checking' | 'valid' | 'invalid' | 'expired'

function parseHashParams(): { type?: string; access_token?: string } {
  const hash = window.location.hash ?? ''
  if (!hash) return {}
  const params = new URLSearchParams(hash.replace(/^#/, ''))
  return {
    type: params.get('type') ?? undefined,
    access_token: params.get('access_token') ?? undefined,
  }
}

export function ResetTokenValidationView() {
  const [tokenState, setTokenState] = useState<TokenState>('checking')
  const [resetSuccess, setResetSuccess] = useState(false)
  const [tokenFromUrl, setTokenFromUrl] = useState<string | null>(null)

  useEffect(() => {
    const hashParams = parseHashParams()
    const tokenFromQuery = new URLSearchParams(window.location.search).get('token')
    const hasRecoveryHash = Boolean(
      hashParams.type === 'recovery' || hashParams.access_token
    )

    if (!useSupabase && tokenFromQuery) {
      setTokenFromUrl(tokenFromQuery)
      setTokenState('valid')
      return
    }

    if (!useSupabase) {
      setTokenState('invalid')
      return
    }

    if (!hasRecoveryHash) {
      setTokenState('invalid')
      return
    }

    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        const session = data?.session ?? null
        if (session) {
          setTokenState('valid')
        } else {
          setTokenState('expired')
        }
      } catch {
        setTokenState('invalid')
      }
    }

    checkSession()
  }, [])

  if (resetSuccess) {
    return (
      <div className="w-full space-y-6 animate-fade-in">
        <div className="space-y-2 text-center lg:text-left">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Password reset complete
          </h1>
          <p className="text-muted-foreground">
            You can now sign in with your new password.
          </p>
        </div>
        <Card className="rounded-2xl border border-border bg-card shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20 mb-4">
              <CheckCircle className="h-6 w-6 text-primary shrink-0" aria-hidden />
              <p className="text-sm font-medium text-foreground">
                Your password has been updated successfully.
              </p>
            </div>
            <RedirectToLoginCTA />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (tokenState === 'checking') {
    return (
      <div className="w-full space-y-6 animate-fade-in">
        <Card className="rounded-2xl border border-border bg-card shadow-card">
          <CardContent className="py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" aria-hidden />
              <p className="text-sm text-muted-foreground">Validating reset link...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (tokenState === 'invalid') {
    return (
      <div className="w-full space-y-6 animate-fade-in">
        <div className="space-y-2 text-center lg:text-left">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Invalid reset link
          </h1>
          <p className="text-muted-foreground">
            This password reset link is invalid or has already been used.
          </p>
        </div>
        <Card className="rounded-2xl border border-destructive/30 bg-card shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 mb-4">
              <AlertCircle className="h-6 w-6 text-destructive shrink-0" aria-hidden />
              <p className="text-sm font-medium text-foreground">
                Please request a new password reset link.
              </p>
            </div>
            <Link to="/password-reset/request">
              <Button variant="outline" className="w-full rounded-full">
                Request new reset link
              </Button>
            </Link>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              <Link to="/login" className="font-medium text-primary hover:underline">
                Back to sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (tokenState === 'expired') {
    return (
      <div className="w-full space-y-6 animate-fade-in">
        <div className="space-y-2 text-center lg:text-left">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Link expired
          </h1>
          <p className="text-muted-foreground">
            This password reset link has expired for security reasons.
          </p>
        </div>
        <Card className="rounded-2xl border border-warning/50 bg-card shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-warning/10 border border-warning/20 mb-4">
              <AlertTriangle className="h-6 w-6 text-warning shrink-0" aria-hidden />
              <p className="text-sm font-medium text-foreground">
                Reset links expire after 1 hour. Request a new one to continue.
              </p>
            </div>
            <Link to="/password-reset/request">
              <Button className="w-full rounded-full">
                Request new reset link
              </Button>
            </Link>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              <Link to="/login" className="font-medium text-primary hover:underline">
                Back to sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6 animate-fade-in">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
          Set new password
        </h1>
        <p className="text-muted-foreground">
          Enter and confirm your new password below.
        </p>
      </div>

      <Card className="rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-elevated">
        <CardHeader className="space-y-1">
          <CardTitle>New password</CardTitle>
          <CardDescription>
            Use at least 12 characters with uppercase, lowercase, numbers, and symbols.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20 mb-6">
            <CheckCircle className="h-6 w-6 text-primary shrink-0" aria-hidden />
            <p className="text-sm font-medium text-foreground">
              Reset link is valid. Enter your new password.
            </p>
          </div>
          <NewPasswordForm
            token={tokenFromUrl ?? undefined}
            onSuccess={() => setResetSuccess(true)}
          />
        </CardContent>
      </Card>
    </div>
  )
}
