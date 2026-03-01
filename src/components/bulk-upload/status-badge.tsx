import { Clock, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BatchStatus } from '@/types/bulk-upload'

const statusConfig: Record<
  BatchStatus,
  { icon: typeof Clock; variant: string; label: string }
> = {
  pending: { icon: Clock, variant: 'bg-warning/20 text-foreground border-warning/40', label: 'Pending' },
  processing: { icon: Loader2, variant: 'bg-info/20 text-foreground border-info/40', label: 'Processing' },
  completed: { icon: CheckCircle, variant: 'bg-primary/20 text-primary-foreground border-primary/40', label: 'Completed' },
  failed: { icon: AlertCircle, variant: 'bg-destructive/20 text-destructive border-destructive/40', label: 'Failed' },
}

interface StatusBadgeProps {
  status: BatchStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.pending
  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        config.variant,
        className
      )}
      role="status"
      aria-label={`Status: ${config.label}`}
    >
      {status === 'processing' ? (
        <Icon className="h-3.5 w-3.5 animate-spin" aria-hidden />
      ) : (
        <Icon className="h-3.5 w-3.5" aria-hidden />
      )}
      {config.label}
    </span>
  )
}
