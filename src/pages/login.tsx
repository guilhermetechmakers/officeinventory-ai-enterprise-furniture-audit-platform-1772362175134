import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  EmailPasswordSignInCard,
  SSOAuthCard,
  InvitationSignupCard,
  RequestAccessCard,
  PasswordResetModal,
  RedirectHandler,
} from '@/components/auth'

export function LoginPage() {
  const [searchParams] = useSearchParams()
  const returnUrl = searchParams.get('returnUrl') ?? searchParams.get('redirect') ?? undefined
  const [showPasswordReset, setShowPasswordReset] = useState(false)
  const [showRequestAccess, setShowRequestAccess] = useState(false)

  return (
    <RedirectHandler fallbackPath="/dashboard">
      <div className="w-full space-y-6 animate-fade-in">
        <div className="space-y-2 text-center lg:text-left">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Sign in
          </h1>
          <p className="text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        <div className="space-y-6">
          <InvitationSignupCard />

          {!showRequestAccess ? (
            <>
              <EmailPasswordSignInCard
                onForgotPassword={() => setShowPasswordReset(true)}
                returnUrl={returnUrl}
              />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <SSOAuthCard returnUrl={returnUrl} />
            </>
          ) : (
            <RequestAccessCard onSuccess={() => setShowRequestAccess(false)} />
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          {showRequestAccess ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setShowRequestAccess(false)}
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => setShowRequestAccess(true)}
                className="font-medium text-primary hover:underline"
              >
                Request access
              </button>
            </>
          )}
        </p>
      </div>

      <PasswordResetModal open={showPasswordReset} onOpenChange={setShowPasswordReset} />
    </RedirectHandler>
  )
}
