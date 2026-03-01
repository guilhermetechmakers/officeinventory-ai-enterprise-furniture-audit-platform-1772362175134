import { FileText, Download, RefreshCw, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { ExportJob } from '@/types/reports-exports'
import { cn } from '@/lib/utils'

export interface ExportCardProps {
  job: ExportJob
  onDownload?: (job: ExportJob) => void
  onRetry?: (job: ExportJob) => void | Promise<void>
  onRunExport?: () => void
  isRunning?: boolean
  className?: string
}

const statusVariant: Record<
  ExportJob['status'],
  'default' | 'secondary' | 'warning' | 'destructive'
> = {
  Queued: 'secondary',
  InProgress: 'warning',
  Completed: 'default',
  Failed: 'destructive',
}

export function ExportCard({
  job,
  onDownload,
  onRetry,
  onRunExport,
  isRunning = false,
  className,
}: ExportCardProps) {
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

  const canDownload = job.status === 'Completed' && !!job.downloadUrl
  const canRetry = job.status === 'Failed'
  const isInProgress = job.status === 'InProgress' || isRunning

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
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">
              Export {job.id.slice(-6)} · {job.format}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={statusVariant[job.status]} className="rounded-full text-xs">
                {job.status}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDate((job.generatedAt ?? job.createdAt) || null)}
              </span>
            </div>
            {job.errorMessage && (
              <p className="text-xs text-destructive mt-1 truncate max-w-[200px]">
                {job.errorMessage}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {canDownload && onDownload && (
            <Button
              size="sm"
              onClick={() => onDownload(job)}
              asChild
              className="rounded-full"
            >
              <a
                href={job.downloadUrl ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </a>
            </Button>
          )}
          {canRetry && onRetry && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRetry(job)}
              className="rounded-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          )}
          {onRunExport && !isInProgress && (
            <Button size="sm" onClick={onRunExport} className="rounded-full">
              Run Export
            </Button>
          )}
          {isInProgress && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-pulse" />
              Processing...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
