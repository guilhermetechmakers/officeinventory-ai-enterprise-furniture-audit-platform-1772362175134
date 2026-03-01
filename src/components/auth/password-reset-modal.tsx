import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { passwordReset } from '@/api/auth'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/lib/auth-validators'
import { mapAuthError } from '@/lib/auth-error-mapper'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface PasswordResetModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PasswordResetModal({ open, onOpenChange }: PasswordResetModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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

  const handleClose = (next: boolean) => {
    if (!next) {
      reset()
      setSubmitted(false)
    }
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent showClose={true} className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Reset password</DialogTitle>
          <DialogDescription>
            Enter your email and we&apos;ll send you a link to reset your password.
          </DialogDescription>
        </DialogHeader>
        {submitted ? (
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              We&apos;ve sent password reset instructions to your email. Check your inbox and spam
              folder.
            </p>
            <Button
              variant="outline"
              className="w-full rounded-full"
              onClick={() => handleClose(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="you@company.com"
                aria-invalid={!!errors.email}
                {...register('email')}
                className={cn(errors.email && 'border-destructive')}
              />
              {errors.email && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full rounded-full"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
