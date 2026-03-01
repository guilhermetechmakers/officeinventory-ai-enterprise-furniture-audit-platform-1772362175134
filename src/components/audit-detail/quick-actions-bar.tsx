/**
 * QuickActionsBar - Export, Start Review, Assign Reviewer actions
 */

import { useState } from 'react'
import {
  Download,
  Play,
  UserPlus,
  FileText,
  FileSpreadsheet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { assignReviewer, exportAudit } from '@/api/audit-detail'
import { mockReviewers } from '@/data/audit-detail-mocks'

export interface Reviewer {
  id: string
  name: string
  email?: string
}

export interface QuickActionsBarProps {
  auditId: string
  reviewers?: Reviewer[]
  onAssignReviewer?: () => void
  onStartReview?: () => void
  className?: string
}

export function QuickActionsBar({
  auditId,
  reviewers = mockReviewers,
  onAssignReviewer,
  onStartReview,
  className,
}: QuickActionsBarProps) {
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [selectedReviewerId, setSelectedReviewerId] = useState<string>('')
  const [isExporting, setIsExporting] = useState(false)
  const [isAssigning, setIsAssigning] = useState(false)

  const safeReviewers = Array.isArray(reviewers) ? reviewers : mockReviewers

  const handleExport = async (format: 'csv' | 'pdf') => {
    if (!auditId) return
    setIsExporting(true)
    try {
      const blob = await exportAudit(auditId, format)
      if (blob) {
        const ext = format === 'pdf' ? 'pdf' : 'csv'
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `audit-${auditId}.${ext}`
        a.click()
        URL.revokeObjectURL(url)
        toast.success(`Exported as ${format.toUpperCase()}`)
      } else {
        toast.info('Export will be available when the API is connected')
      }
    } catch {
      toast.error('Export failed')
    } finally {
      setIsExporting(false)
    }
  }

  const handleAssignReviewer = async () => {
    if (!auditId || !selectedReviewerId) {
      toast.error('Please select a reviewer')
      return
    }
    setIsAssigning(true)
    try {
      const ok = await assignReviewer(auditId, selectedReviewerId)
      if (ok) {
        toast.success('Reviewer assigned')
        setAssignModalOpen(false)
        setSelectedReviewerId('')
        onAssignReviewer?.()
      } else {
        toast.info('Assignment will be saved when the API is connected')
        setAssignModalOpen(false)
      }
    } catch {
      toast.error('Failed to assign reviewer')
    } finally {
      setIsAssigning(false)
    }
  }

  return (
    <div
      className={cn('flex flex-wrap items-center gap-2', className)}
      role="toolbar"
      aria-label="Quick actions"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="default"
            size="sm"
            className="rounded-full"
            disabled={isExporting}
            aria-label="Export audit"
          >
            <Download className="mr-1.5 h-4 w-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="rounded-xl">
          <DropdownMenuItem
            onClick={() => handleExport('csv')}
            className="rounded-lg"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export CSV
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleExport('pdf')}
            className="rounded-lg"
          >
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        size="sm"
        className="rounded-full"
        onClick={onStartReview}
        aria-label="Start review"
      >
        <Play className="mr-1.5 h-4 w-4" />
        Start Review
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="rounded-full"
        onClick={() => setAssignModalOpen(true)}
        aria-label="Assign reviewer"
      >
        <UserPlus className="mr-1.5 h-4 w-4" />
        Assign Reviewer
      </Button>

      <Dialog open={assignModalOpen} onOpenChange={setAssignModalOpen}>
        <DialogContent aria-label="Assign reviewer">
          <DialogHeader>
            <DialogTitle>Assign Reviewer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reviewer-select">Select reviewer</Label>
              <Select
                value={selectedReviewerId}
                onValueChange={setSelectedReviewerId}
              >
                <SelectTrigger
                  id="reviewer-select"
                  className="rounded-xl"
                  aria-label="Choose reviewer"
                >
                  <SelectValue placeholder="Choose a reviewer" />
                </SelectTrigger>
                <SelectContent>
                  {safeReviewers.map((r: Reviewer) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name} {r.email ? `(${r.email})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setAssignModalOpen(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleAssignReviewer}
              disabled={!selectedReviewerId || isAssigning}
              className="rounded-full"
            >
              {isAssigning ? 'Assigning…' : 'Assign'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
