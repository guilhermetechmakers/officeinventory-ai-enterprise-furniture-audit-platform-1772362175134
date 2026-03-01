import { Link, useNavigate } from 'react-router-dom'
import { ClipboardList, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from './empty-state'
import type { Audit } from '@/types/dashboard'
import { safeArray, safeString } from '@/hooks/use-supa-safe-data'

interface ActiveAuditsGridProps {
  audits?: Audit[] | null
  isLoading?: boolean
  className?: string
}

const STATUS_VARIANT: Record<string, 'default' | 'info' | 'success' | 'secondary'> = {
  completed: 'success',
  complete: 'success',
  in_progress: 'info',
  'in-progress': 'info',
  pending_review: 'info',
  draft: 'secondary',
  archived: 'secondary',
}

function formatRelativeTime(iso: string): string {
  try {
    const date = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hr ago`
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  } catch {
    return ''
  }
}

export function ActiveAuditsGrid({ audits, isLoading, className }: ActiveAuditsGridProps) {
  const navigate = useNavigate()
  const list = safeArray(audits)

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        <h3 className="text-base font-semibold">Active Audits</h3>
        <p className="text-sm text-muted-foreground">Current audits in progress</p>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-muted/50" />
          ))}
        </div>
      </div>
    )
  }

  if (list.length === 0) {
    return (
      <EmptyState
        icon={<ClipboardList className="h-7 w-7" />}
        title="No active audits"
        description="Start a new capture or create an audit to get started."
        actionLabel="Start Capture"
        onAction={() => navigate('/dashboard/capture')}
        className={className}
      />
    )
  }

  return (
    <div className={cn('grid gap-4', className)}>
      {list.map((audit) => {
        const status = safeString(audit?.status, 'draft')
        const variant = STATUS_VARIANT[status] ?? 'secondary'
        const siteName = audit?.siteName ?? audit?.location ?? 'Unknown site'
        const items = audit?.itemsDetected ?? 0

        return (
          <Link key={audit?.id ?? ''} to={`/dashboard/audits/${audit?.id ?? ''}`}>
            <Card className="group cursor-pointer transition-all duration-300 hover:shadow-elevated hover:-translate-y-0.5 hover:border-primary/30">
              <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/20">
                    <ClipboardList className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{audit?.name ?? 'Untitled'}</p>
                    <p className="text-sm text-muted-foreground">
                      {siteName} · {items} items
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <Badge variant={variant}>{status}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatRelativeTime(audit?.lastUpdated ?? '')}
                  </span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
