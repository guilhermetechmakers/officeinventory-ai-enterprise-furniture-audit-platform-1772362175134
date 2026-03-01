import { CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ValidationBadgeProps {
  valid: boolean
  message?: string
  className?: string
}

export function ValidationBadge({ valid, message, className }: ValidationBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        valid ? 'bg-primary/20 text-foreground' : 'bg-destructive/20 text-destructive',
        className
      )}
    >
      {valid ? (
        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
      ) : (
        <AlertCircle className="h-3.5 w-3.5" aria-hidden />
      )}
      <span>{message ?? (valid ? 'Valid' : 'Invalid')}</span>
    </div>
  )
}
