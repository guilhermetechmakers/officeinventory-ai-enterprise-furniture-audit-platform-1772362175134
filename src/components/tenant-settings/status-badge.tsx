import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type StatusVariant = 'success' | 'failure' | 'pending' | 'warning' | 'info'

export interface StatusBadgeProps {
  status: StatusVariant | string
  label?: string
  className?: string
}

const variantMap: Record<StatusVariant, 'success' | 'destructive' | 'secondary' | 'warning' | 'info'> = {
  success: 'success',
  failure: 'destructive',
  pending: 'secondary',
  warning: 'warning',
  info: 'info',
}

const labelMap: Record<StatusVariant, string> = {
  success: 'Success',
  failure: 'Failed',
  pending: 'Pending',
  warning: 'Warning',
  info: 'Info',
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const v = status as StatusVariant
  const variant = variantMap[v] ?? 'secondary'
  const displayLabel = label ?? (labelMap[v] ?? status)
  return (
    <Badge variant={variant} className={cn('rounded-full', className)}>
      {displayLabel}
    </Badge>
  )
}
