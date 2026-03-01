import { useState } from 'react'
import { History, Search, Filter } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ExportCard } from './export-card'
import { cn } from '@/lib/utils'
import { ensureArray } from '@/lib/safe-array'
import type { ExportJob, ExportJobStatus } from '@/types/reports-exports'

export interface ExportHistoryPanelProps {
  history: ExportJob[]
  onDownload?: (job: ExportJob) => void
  onRetry?: (job: ExportJob) => void | Promise<void>
  isLoading?: boolean
  statusFilter?: ExportJobStatus | 'all'
  onStatusFilterChange?: (value: ExportJobStatus | 'all') => void
  canViewHistory?: boolean
  className?: string
}

const STATUS_OPTIONS: { value: ExportJobStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Failed', label: 'Failed' },
  { value: 'InProgress', label: 'In progress' },
  { value: 'Queued', label: 'Queued' },
]

export function ExportHistoryPanel({
  history = [],
  onDownload,
  onRetry,
  isLoading = false,
  statusFilter: controlledStatus,
  onStatusFilterChange,
  canViewHistory = true,
  className,
}: ExportHistoryPanelProps) {
  const [search, setSearch] = useState('')
  const [internalStatus, setInternalStatus] = useState<ExportJobStatus | 'all'>('all')
  const statusFilter = controlledStatus ?? internalStatus
  const setStatusFilter = onStatusFilterChange ?? setInternalStatus

  const safeHistory = ensureArray(history)
  const filtered = safeHistory.filter((job) => {
    const matchStatus =
      statusFilter === 'all' || job.status === statusFilter
    const matchSearch =
      !search ||
      job.format?.toLowerCase().includes(search.toLowerCase()) ||
      job.id?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const handleDownload = (job: ExportJob) => {
    if (job.downloadUrl && onDownload) {
      onDownload(job)
    } else if (job.downloadUrl) {
      window.open(job.downloadUrl, '_blank')
    }
  }

  return (
    <Card className={cn('rounded-2xl border border-border shadow-card transition-all duration-300 hover:shadow-elevated', className)}>
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Export History
            </CardTitle>
            <CardDescription>
              Status, download links, and retry options
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by format or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v: ExportJobStatus | 'all') => setStatusFilter(v)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!canViewHistory ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
            <p>You don&apos;t have permission to view export history.</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-20 rounded-xl bg-muted/50 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((job) => (
              <ExportCard
                key={job.id}
                job={job}
                onDownload={handleDownload}
                onRetry={onRetry}
              />
            ))}
            {filtered.length === 0 && (
              <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No exports yet</p>
                <p className="text-sm mt-1">
                  Run an export from the Export Builder to see it here
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
