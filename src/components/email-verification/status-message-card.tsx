import { Mail, CheckCircle2, AlertCircle } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { VerificationStatus } from '@/types/auth'

export interface StatusMessageCardProps {
  status?: VerificationStatus | string | null
  message: string
  subtext?: string | null
  email?: string | null
  className?: string
}

function maskEmail(email: string): string {
  const trimmed = email?.trim() ?? ''
  if (!trimmed) return ''
  const [local, domain] = trimmed.split('@')
  if (!local || !domain) return trimmed
  const maskedLocal =
    local.length <= 2 ? local + '***' : local.slice(0, 2) + '***' + local.slice(-1)
  return `${maskedLocal}@${domain}`
}

export function StatusMessageCard({
  status = 'pending',
  message,
  subtext,
  email,
  className,
}: StatusMessageCardProps) {
  const normalizedStatus = (status ?? 'pending') as VerificationStatus

  const iconConfig = {
    pending: {
      icon: Mail,
      iconClass: 'text-primary',
      bgClass: 'bg-primary/10',
    },
    verified: {
      icon: CheckCircle2,
      iconClass: 'text-primary',
      bgClass: 'bg-primary/10',
    },
    failed: {
      icon: AlertCircle,
      iconClass: 'text-destructive',
      bgClass: 'bg-destructive/10',
    },
  }

  const config = iconConfig[normalizedStatus] ?? iconConfig.pending
  const Icon = config.icon

  return (
    <Card
      className={cn(
        'rounded-2xl border border-border bg-card shadow-card transition-all duration-300',
        className
      )}
    >
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
              config.bgClass
            )}
          >
            <Icon className={cn('h-6 w-6', config.iconClass)} aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg">{message}</CardTitle>
            {email && normalizedStatus === 'pending' && (
              <CardDescription className="mt-1 break-all">
                A verification email has been sent to <strong>{maskEmail(email)}</strong>
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      {subtext && (
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground">{subtext}</p>
        </CardContent>
      )}
    </Card>
  )
}
