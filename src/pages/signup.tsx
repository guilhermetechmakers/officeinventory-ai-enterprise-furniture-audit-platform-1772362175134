import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type SignupForm = z.infer<typeof signupSchema>

export function SignupPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (_data: SignupForm) => {
    setIsLoading(true)
    try {
      // TODO: Integrate with Supabase Auth
      await new Promise((r) => setTimeout(r, 800))
      toast.success('Account created. Please check your email to verify.')
      navigate('/login')
    } catch {
      toast.error('Failed to create account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-2xl font-bold">Request access</h1>
        <p className="text-muted-foreground">
          Create an account to get started with OfficeInventory AI
        </p>
      </div>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle>Create account</CardTitle>
          <CardDescription>
            Enter your details below. You&apos;ll receive a verification email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                placeholder="Jane Smith"
                {...register('name')}
                className={cn(errors.name && 'border-destructive')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className={cn(errors.password && 'border-destructive')}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword')}
                className={cn(errors.confirmPassword && 'border-destructive')}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full rounded-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Request access'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
