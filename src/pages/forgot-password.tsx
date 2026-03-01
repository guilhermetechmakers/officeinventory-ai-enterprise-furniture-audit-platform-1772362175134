import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const forgotSchema = z.object({
  email: z.string().email('Invalid email address'),
})

type ForgotForm = z.infer<typeof forgotSchema>

export function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (_data: ForgotForm) => {
    setIsLoading(true)
    try {
      // TODO: Integrate with Supabase Auth password reset
      await new Promise((r) => setTimeout(r, 800))
      setSubmitted(true)
      toast.success('Check your email for reset instructions')
    } catch {
      toast.error('Failed to send reset email')
    } finally {
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="w-full space-y-6">
        <div className="space-y-2 text-center lg:text-left">
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-muted-foreground">
            We&apos;ve sent password reset instructions to your email address.
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Didn&apos;t receive the email? Check your spam folder or{' '}
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="font-medium text-primary hover:underline"
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
    <div className="w-full space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-2xl font-bold">Forgot password?</h1>
        <p className="text-muted-foreground">
          Enter your email and we&apos;ll send you reset instructions
        </p>
      </div>

      <Card>
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
                {...register('email')}
                className={cn(errors.email && 'border-destructive')}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full rounded-full" disabled={isLoading}>
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
