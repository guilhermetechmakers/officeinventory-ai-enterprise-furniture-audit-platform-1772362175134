/**
 * AssignmentPanel - Assignee (user/team), SLA notes, due date
 */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { mockAssignees } from '@/data/review-queue-mocks'

export interface AssigneeOption {
  id: string
  name: string
  type: 'user' | 'team'
}

export interface AssignmentPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemIds: string[]
  assignees?: AssigneeOption[]
  onSubmit: (payload: {
    itemIds: string[]
    assigneeId: string
    teamId?: string
    slaNotes?: string
    dueDate?: string
  }) => Promise<{ success: boolean; message?: string }>
  onSuccess?: () => void
}

export function AssignmentPanel({
  open,
  onOpenChange,
  itemIds,
  assignees = mockAssignees,
  onSubmit,
  onSuccess,
}: AssignmentPanelProps) {
  const [assigneeId, setAssigneeId] = useState<string>('')
  const [slaNotes, setSlaNotes] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const ids = Array.isArray(itemIds) ? itemIds : []
  const hasAssignee = !!assigneeId?.trim()
  const hasSlaNotes = !!slaNotes?.trim()
  const canSubmit = hasAssignee && hasSlaNotes && ids.length > 0

  useEffect(() => {
    if (open) {
      setAssigneeId('')
      setSlaNotes('')
      setDueDate('')
      setError(null)
    }
  }, [open])

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) return
    setIsSubmitting(true)
    setError(null)
    try {
      const assignee = assignees.find((a) => a.id === assigneeId)
      const isTeam = assignee?.type === 'team'
      const result = await onSubmit({
        itemIds: ids,
        assigneeId,
        teamId: isTeam ? assigneeId : undefined,
        slaNotes: slaNotes.trim() || undefined,
        dueDate: dueDate.trim() || undefined,
      })
      if (result.success) {
        onOpenChange(false)
        onSuccess?.()
      } else {
        setError(result.message ?? 'Assignment failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Assignment failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const safeAssignees = Array.isArray(assignees) ? assignees : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showClose className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Items</DialogTitle>
          <DialogDescription>
            Assign {ids.length} item{ids.length !== 1 ? 's' : ''} to a reviewer or team. Add SLA
            notes and optional due date.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="assignee">Assignee</Label>
            <Select value={assigneeId} onValueChange={setAssigneeId}>
              <SelectTrigger
                id="assignee"
                className="rounded-xl"
                aria-label="Select assignee"
              >
                <SelectValue placeholder="Select user or team" />
              </SelectTrigger>
              <SelectContent>
                {safeAssignees.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name} ({a.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sla-notes">SLA Notes (required)</Label>
            <Textarea
              id="sla-notes"
              placeholder="Priority, special instructions..."
              value={slaNotes}
              onChange={(e) => setSlaNotes(e.target.value)}
              className="min-h-[80px] rounded-xl"
              aria-label="SLA notes"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="due-date">Due Date (optional)</Label>
            <Input
              id="due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="rounded-xl"
              aria-label="Due date"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-full">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="rounded-full"
          >
            {isSubmitting ? 'Assigning…' : 'Assign'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
