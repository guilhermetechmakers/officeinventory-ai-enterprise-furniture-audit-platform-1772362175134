import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { passwordReset } from '@/api/auth'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/lib/auth-validators'
import { mapAuthError } from '@/lib/auth-error-mapper'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function RequestResetForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true)
    try {
      await passwordReset({ email: data.email })
      setSubmitted(true)
      toast.success('Check your email for reset instructions')
    } catch (err) {
      toast.error(mapAuthError(err))
    } finally {
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="w-full space-y-6 animate-fade-in">
        <div className="space-y-2 text-center lg:text-left">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Check your email
          </h1>
          <p className="text-muted-foreground">
            If an account exists for that email, you&apos;ll receive password reset instructions shortly.
          </p>
        </div>
        <Card className="rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-elevated">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Didn&apos;t receive the email? Check your spam folder or{' '}
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="font-medium text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  try again
                </button>
              </p>
              <Link to="/login">
                <Button variant="outline" className="w-full rounded-full">
                  Back to sign in
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6 animate-fade-in">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
          Forgot password?
        </h1>
        <p className="text-muted-foreground">
          Enter your email and we&apos;ll send you reset instructions
        </p>
      </div>

      <Card className="rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-elevated">
        <CardHeader className="space-y-1">
          <CardTitle>Reset password</CardTitle>
          <CardDescription>
            We&apos;ll email you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                {...register('email')}
                className={cn(errors.email && 'border-destructive')}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        Remember your password?{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
