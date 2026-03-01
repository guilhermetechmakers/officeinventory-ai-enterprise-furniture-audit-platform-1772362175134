import { Calendar, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Schedule } from '@/types/reports-exports'
import { cn } from '@/lib/utils'

export interface ScheduleCardProps {
  schedule: Schedule
  onToggle: (schedule: Schedule, enabled: boolean) => void
  onEdit: (schedule: Schedule) => void
  onDelete: (schedule: Schedule) => void
  canEdit?: boolean
  canDelete?: boolean
  className?: string
}

function formatCronDescription(cron: string): string {
  if (cron === '0 6 * * 1') return 'Every Monday 6:00 AM'
  if (cron === '0 6 * * *') return 'Daily 6:00 AM'
  if (cron === '0 0 * * 0') return 'Weekly Sunday midnight'
  return cron
}

export function ScheduleCard({
  schedule,
  onToggle,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
  className,
}: ScheduleCardProps) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—'
    try {
      return new Date(dateStr).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <Card
      className={cn(
        'rounded-2xl border border-border shadow-card transition-all duration-300 hover:shadow-elevated',
        className
      )}
    >
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">{schedule.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatCronDescription(schedule.cronExpression)}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="rounded-full text-xs">
                {schedule.format}
              </Badge>
              {schedule.nextRunAt && (
                <span className="text-xs text-muted-foreground">
                  Next: {formatDate(schedule.nextRunAt)}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {schedule.enabled ? 'On' : 'Off'}
            </span>
            <Switch
              checked={schedule.enabled}
              onCheckedChange={(checked) => onToggle(schedule, checked)}
              aria-label={`Toggle schedule ${schedule.name}`}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="More actions">
                <span className="sr-only">More</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              {canEdit && (
                <DropdownMenuItem onClick={() => onEdit(schedule)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              {canDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(schedule)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}
