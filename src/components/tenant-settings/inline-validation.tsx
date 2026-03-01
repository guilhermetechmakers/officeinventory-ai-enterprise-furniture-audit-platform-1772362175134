import { cn } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'

export interface InlineValidationProps {
  message?: string | null
  className?: string
}

export function InlineValidation({ message, className }: InlineValidationProps) {
  if (!message?.trim()) return null

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-sm text-destructive',
        className
      )}
      role="alert"
    >
      <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
      <span>{message}</span>
    </div>
  )
}
