import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface NotificationBannerProps {
  type?: NotificationType
  variant?: NotificationType
  title: string
  message?: string
  onDismiss?: () => void
  className?: string
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: AlertCircle,
}

const styleMap = {
  success: 'bg-primary/10 border-primary/30 text-primary-foreground',
  error: 'bg-destructive/10 border-destructive/30 text-destructive',
  warning: 'bg-warning/10 border-warning/30 text-foreground',
  info: 'bg-info/10 border-info/30 text-foreground',
}

export function NotificationBanner({
  type,
  variant,
  title,
  message,
  onDismiss,
  className,
}: NotificationBannerProps) {
  const notificationType = type ?? variant ?? 'info'
  const Icon = iconMap[notificationType]
  const styles = styleMap[notificationType]

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4 animate-fade-in',
        styles,
        className
      )}
    >
      <Icon className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="font-medium">{title}</p>
        {message && (
          <p className="text-sm mt-1 opacity-90">{message}</p>
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-full p-1 hover:opacity-80 transition-opacity"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
