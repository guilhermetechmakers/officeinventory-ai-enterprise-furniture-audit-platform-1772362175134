import * as React from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ValidationErrorTooltipProps {
  error?: string | null
  children: React.ReactElement
  className?: string
}

/** Inline validation UX - shows error icon and message on hover/focus */
export function ValidationErrorTooltip({
  error,
  children,
  className,
}: ValidationErrorTooltipProps) {
  const hasError = Boolean(error?.trim())

  return (
    <div className={cn('relative inline-flex flex-col gap-1', className)}>
      <div className="relative inline-flex">
        {React.cloneElement(children, {
          'aria-invalid': hasError,
          'data-invalid': hasError,
          className: cn(
            children.props.className,
            hasError && 'border-destructive focus-visible:ring-destructive'
          ),
        })}
        {hasError && (
          <span
            className="absolute -right-6 top-1/2 -translate-y-1/2 text-destructive"
            title={error ?? undefined}
          >
            <AlertCircle className="h-4 w-4" aria-hidden />
          </span>
        )}
      </div>
      {hasError && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
