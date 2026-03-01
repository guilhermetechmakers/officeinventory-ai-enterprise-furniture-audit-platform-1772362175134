/**
 * BulkActionsBar - Accept, Assign, Export with selection count
 */

import { Download, UserPlus, CheckCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface BulkActionsBarProps {
  selectedIds: string[]
  onClearSelection: () => void
  onAccept: (ids: string[]) => Promise<void>
  onAssign: (ids: string[]) => void
  onExport: (ids: string[], format: 'csv' | 'pdf') => Promise<void>
  isAccepting?: boolean
  isExporting?: boolean
  className?: string
}

export function BulkActionsBar({
  selectedIds,
  onClearSelection,
  onAccept,
  onAssign,
  onExport,
  isAccepting = false,
  isExporting = false,
  className,
}: BulkActionsBarProps) {
  const ids = selectedIds ?? []
  const count = ids.length
  const hasSelection = count > 0

  if (!hasSelection) return null

  const handleAccept = async () => {
    if (count === 0) return
    await onAccept(ids)
  }

  const handleAssign = () => {
    if (count === 0) return
    onAssign(ids)
  }

  const handleExportCsv = async () => {
    if (count === 0) return
    await onExport(ids, 'csv')
  }

  const handleExportPdf = async () => {
    if (count === 0) return
    await onExport(ids, 'pdf')
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-[rgb(var(--primary-foreground))] px-4 py-3 text-white shadow-elevated animate-slide-up',
        className
      )}
      role="toolbar"
      aria-label="Bulk actions"
    >
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">
          {count} item{count !== 1 ? 's' : ''} selected
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full text-white hover:bg-white/20"
          onClick={onClearSelection}
          aria-label="Clear selection"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handleAccept}
          disabled={isAccepting}
          aria-label="Accept selected items"
        >
          <CheckCircle className="h-4 w-4 mr-1.5" />
          {isAccepting ? 'Accepting…' : 'Accept'}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="rounded-full border-white/30 bg-transparent text-white hover:bg-white/20"
          onClick={handleAssign}
          aria-label="Assign selected items"
        >
          <UserPlus className="h-4 w-4 mr-1.5" />
          Assign
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="rounded-full border-white/30 bg-transparent text-white hover:bg-white/20"
          onClick={handleExportCsv}
          disabled={isExporting}
          aria-label="Export as CSV"
        >
          <Download className="h-4 w-4 mr-1.5" />
          CSV
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="rounded-full border-white/30 bg-transparent text-white hover:bg-white/20"
          onClick={handleExportPdf}
          disabled={isExporting}
          aria-label="Export as PDF"
        >
          <Download className="h-4 w-4 mr-1.5" />
          PDF
        </Button>
      </div>
    </div>
  )
}
