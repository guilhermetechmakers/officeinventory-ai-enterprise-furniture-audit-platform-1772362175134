import { z } from 'zod'

/** Client-side validation schemas for auth flows */

export const emailSchema = z.string().min(1, 'Email is required').email('Invalid email address')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password should contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password should contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password should contain at least one number')

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
})

export const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export const requestAccessSchema = z.object({
  organizationName: z.string().min(2, 'Organization name is required'),
  contactEmail: emailSchema,
  reason: z.string().min(10, 'Please provide a reason (at least 10 characters)'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type SignupFormValues = z.infer<typeof signupSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type RequestAccessFormValues = z.infer<typeof requestAccessSchema>
