/**
 * BulkActionsBar - Export, Archive, Delete with permission checks
 * Enables when one or more audits selected; confirms destructive actions
 */

import { useState } from 'react'
import { Download, Archive, Trash2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface BulkActionsBarProps {
  selectedIds: string[]
  onClearSelection: () => void
  onExport: (ids: string[]) => Promise<void>
  onArchive: (ids: string[]) => Promise<void>
  onDelete: (ids: string[]) => Promise<void>
  canExport?: boolean
  canArchive?: boolean
  canDelete?: boolean
}

export function BulkActionsBar({
  selectedIds,
  onClearSelection,
  onExport,
  onArchive,
  onDelete,
  canExport = true,
  canArchive = true,
  canDelete = true,
}: BulkActionsBarProps) {
  const [confirmAction, setConfirmAction] = useState<
    'archive' | 'delete' | null
  >(null)
  const [isLoading, setIsLoading] = useState(false)

  const ids = selectedIds ?? []
  const count = ids.length
  const hasSelection = count > 0

  if (!hasSelection) return null

  const handleExport = async () => {
    if (count === 0) return
    setIsLoading(true)
    try {
      await onExport(ids)
    } finally {
      setIsLoading(false)
    }
  }

  const handleArchive = async () => {
    if (count === 0) return
    setConfirmAction('archive')
  }

  const handleDelete = async () => {
    if (count === 0) return
    setConfirmAction('delete')
  }

  const confirmArchive = async () => {
    setIsLoading(true)
    try {
      await onArchive(ids)
      setConfirmAction(null)
      onClearSelection()
    } finally {
      setIsLoading(false)
    }
  }

  const confirmDelete = async () => {
    setIsLoading(true)
    try {
      await onDelete(ids)
      setConfirmAction(null)
      onClearSelection()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div
        className={cn(
          'flex items-center justify-between gap-4 rounded-2xl border border-border bg-card px-4 py-3 shadow-card',
          'animate-slide-up'
        )}
        role="toolbar"
        aria-label="Bulk actions"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">
            {count} audit{count !== 1 ? 's' : ''} selected
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full"
            onClick={onClearSelection}
            aria-label="Clear selection"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {canExport && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={handleExport}
              disabled={isLoading}
              aria-label="Export selected audits"
            >
              <Download className="h-4 w-4 mr-1.5" />
              Export
            </Button>
          )}
          {canArchive && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={handleArchive}
              disabled={isLoading}
              aria-label="Archive selected audits"
            >
              <Archive className="h-4 w-4 mr-1.5" />
              Archive
            </Button>
          )}
          {canDelete && (
            <Button
              variant="destructive"
              size="sm"
              className="rounded-full"
              onClick={handleDelete}
              disabled={isLoading}
              aria-label="Delete selected audits"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Delete
            </Button>
          )}
        </div>
      </div>

      <Dialog
        open={confirmAction !== null}
        onOpenChange={(open) => !open && setConfirmAction(null)}
      >
        <DialogContent showClose>
          <DialogHeader>
            <DialogTitle>
              {confirmAction === 'archive' ? 'Archive Audits' : 'Delete Audits'}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === 'archive'
                ? `Are you sure you want to archive ${count} audit${count !== 1 ? 's' : ''}? They will be moved to the archived section.`
                : `Are you sure you want to permanently delete ${count} audit${count !== 1 ? 's' : ''}? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmAction(null)}
            >
              Cancel
            </Button>
            <Button
              variant={confirmAction === 'delete' ? 'destructive' : 'default'}
              onClick={
                confirmAction === 'archive' ? confirmArchive : confirmDelete
              }
              disabled={isLoading}
              className="rounded-full"
            >
              {isLoading
                ? 'Processing…'
                : confirmAction === 'archive'
                ? 'Archive'
                : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
