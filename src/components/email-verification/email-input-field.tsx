import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

export function isValidEmail(value: string): boolean {
  if (!value?.trim()) return false
  return EMAIL_REGEX.test(value.trim())
}

export interface EmailInputFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string | null
  id?: string
}

export const EmailInputField = React.forwardRef<HTMLInputElement, EmailInputFieldProps>(
  (
    {
      value,
      onChange,
      placeholder = 'you@company.com',
      error,
      id = 'email-input',
      disabled = false,
      autoFocus = false,
      'aria-label': ariaLabel = 'Email address',
      className,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? 'email-input'
    return (
    <div className="space-y-2">
      <Label htmlFor={inputId} className="sr-only">
        {ariaLabel}
      </Label>
      <Input
        ref={ref}
        id={inputId}
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        autoComplete="email"
        aria-label={ariaLabel}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={cn(error && 'border-destructive focus-visible:ring-destructive', className)}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
    )
  }
)
EmailInputField.displayName = 'EmailInputField'
