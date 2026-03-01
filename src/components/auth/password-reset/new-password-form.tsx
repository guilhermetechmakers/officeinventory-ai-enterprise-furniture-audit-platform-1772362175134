import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  confirmPasswordResetSchema,
  type ConfirmPasswordResetFormValues,
} from '@/lib/auth-validators'
import { PasswordStrengthMeter, getPasswordStrength } from '@/components/auth/password-reset/password-strength-meter'
import { confirmPasswordReset } from '@/api/auth'
import { mapAuthError } from '@/lib/auth-error-mapper'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const PASSWORD_POLICY = [
  'At least 12 characters',
  'One uppercase letter',
  'One lowercase letter',
  'One number',
  'One special character (!@#$%^&* etc.)',
]

export interface NewPasswordFormProps {
  token?: string
  onSuccess?: () => void
}

export function NewPasswordForm({ token, onSuccess }: NewPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ConfirmPasswordResetFormValues>({
    resolver: zodResolver(confirmPasswordResetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const password = watch('password') ?? ''
  const confirmPassword = watch('confirmPassword') ?? ''
  const strength = getPasswordStrength(password)
  const meetsStrength = strength >= 3
  const passwordsMatch = password.length > 0 && password === confirmPassword
  const canSubmit = meetsStrength && passwordsMatch

  const onSubmit = async (data: ConfirmPasswordResetFormValues) => {
    if (!canSubmit) return
    setIsLoading(true)
    try {
      await confirmPasswordReset({ token, newPassword: data.password })
      toast.success('Password updated successfully')
      onSuccess?.()
    } catch (err) {
      toast.error(mapAuthError(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter new password"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            aria-describedby="password-policy password-strength"
            {...register('password')}
            className={cn('pr-10', errors.password && 'border-destructive')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-destructive" role="alert">
            {errors.password.message}
          </p>
        )}
        <PasswordStrengthMeter password={password} />
        <p id="password-policy" className="text-xs text-muted-foreground">
          {PASSWORD_POLICY.join(' • ')}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            placeholder="Confirm new password"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            {...register('confirmPassword')}
            className={cn('pr-10', errors.confirmPassword && 'border-destructive')}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-destructive" role="alert">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full rounded-full"
        disabled={!canSubmit || isLoading}
      >
        {isLoading ? 'Updating...' : 'Reset password'}
      </Button>
    </form>
  )
}
