import {
  Upload,
  CheckCircle,
  AlertCircle,
  FileText,
  RefreshCw,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Activity, ActivityType } from '@/types/dashboard'
import { safeArray, safeString } from '@/hooks/use-supa-safe-data'

interface RecentActivityFeedProps {
  activities?: Activity[] | null
  isLoading?: boolean
  maxItems?: number
  className?: string
}

const ACTIVITY_ICONS: Record<ActivityType, LucideIcon> = {
  audit_created: FileText,
  audit_updated: RefreshCw,
  audit_completed: CheckCircle,
  batch_uploaded: Upload,
  review_assigned: AlertCircle,
  review_completed: CheckCircle,
  export_generated: FileText,
  status_update: RefreshCw,
}

function formatTimestamp(iso: string): string {
  try {
    const date = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hr ago`
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  } catch {
    return ''
  }
}

export function RecentActivityFeed({
  activities,
  isLoading,
  maxItems = 10,
  className,
}: RecentActivityFeedProps) {
  const list = safeArray(activities).slice(0, maxItems)

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        <h3 className="text-base font-semibold">Recent Activity</h3>
        <p className="text-sm text-muted-foreground">Latest updates</p>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                <div className="h-3 w-24 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (list.length === 0) {
    return (
      <div className={cn('rounded-2xl border border-dashed border-border bg-card/50 py-8 text-center', className)}>
        <p className="text-sm text-muted-foreground">No recent activity</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-0', className)} role="list">
      {list.map((item, idx) => {
        const type = safeString(item?.type, 'status_update') as ActivityType
        const Icon = ACTIVITY_ICONS[type] ?? RefreshCw
        const description = item?.description ?? ''
        const time = formatTimestamp(item?.timestamp ?? '')

        return (
          <div
            key={item?.id ?? idx}
            className="flex gap-4 border-b border-border py-4 last:border-0 last:pb-0 first:pt-0"
            role="listitem"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm text-foreground">{description}</p>
              <p className="text-xs text-muted-foreground">{time}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
