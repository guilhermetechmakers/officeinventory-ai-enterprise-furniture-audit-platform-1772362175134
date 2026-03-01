import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
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
import { confirmPasswordReset } from '@/api/auth'
import {
  confirmPasswordResetSchema,
  type ConfirmPasswordResetFormValues,
} from '@/lib/auth-validators'
import { computePasswordStrength } from '@/lib/password-strength'
import { mapAuthError } from '@/lib/auth-error-mapper'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { PasswordStrengthMeter } from './password-strength-meter'

interface NewPasswordFormProps {
  onSuccess: () => void
  /** Token from URL query (for non-Supabase API) */
  token?: string | null
}

const PASSWORD_POLICY_GUIDANCE = [
  'At least 12 characters',
  'One uppercase letter',
  'One lowercase letter',
  'One number',
  'One special character',
]

export function NewPasswordForm({ onSuccess, token }: NewPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ConfirmPasswordResetFormValues>({
    resolver: zodResolver(confirmPasswordResetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const password = watch('password', '')
  const confirmPassword = watch('confirmPassword', '')
  const { meetsPolicy } = computePasswordStrength(password)
  const passwordsMatch = password.length > 0 && password === confirmPassword
  const canSubmit = meetsPolicy && passwordsMatch && !isLoading

  const onSubmit = async (data: ConfirmPasswordResetFormValues) => {
    if (!canSubmit) return
    setIsLoading(true)
    try {
      await confirmPasswordReset({
        newPassword: data.password,
        ...(token ? { token } : {}),
      })
      toast.success('Password updated successfully')
      onSuccess()
    } catch (err) {
      toast.error(mapAuthError(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-elevated">
      <CardHeader className="space-y-1">
        <CardTitle>Create new password</CardTitle>
        <CardDescription>
          Enter and confirm your new password. Make sure it meets the requirements below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">New password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? 'password-error' : 'password-policy'
                }
                {...register('password')}
                className={cn('pr-10', errors.password && 'border-destructive')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <PasswordStrengthMeter password={password} aria-label="Password strength" />
            {errors.password && (
              <p id="password-error" className="text-sm text-destructive" role="alert">
                {errors.password.message}
              </p>
            )}
            <p id="password-policy" className="text-xs text-muted-foreground">
              {PASSWORD_POLICY_GUIDANCE.join(' • ')}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? 'confirm-error' : undefined}
                {...register('confirmPassword')}
                className={cn(
                  'pr-10',
                  errors.confirmPassword && 'border-destructive'
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded p-1"
                aria-label={
                  showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p id="confirm-error" className="text-sm text-destructive" role="alert">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            disabled={!canSubmit}
          >
            {isLoading ? 'Updating...' : 'Reset password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
