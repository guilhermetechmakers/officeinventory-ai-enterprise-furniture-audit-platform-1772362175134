/**
 * MergeConfirmationModal - Final confirmation with audit note
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { ensureArray } from '@/lib/safe-array'
import type { Group, MergePayload } from '@/types/merge'

export interface MergeConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedGroup: Group | null
  canonicalCandidateId: string | null
  mergedAttributes: Record<string, unknown>
  auditNote: string
  onAuditNoteChange: (note: string) => void
  onConfirm: (payload: MergePayload) => void | Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function MergeConfirmationModal({
  open,
  onOpenChange,
  selectedGroup,
  canonicalCandidateId,
  mergedAttributes,
  auditNote,
  onAuditNoteChange,
  onConfirm,
  onCancel,
  isSubmitting = false,
}: MergeConfirmationModalProps) {
  const itemIds = ensureArray(selectedGroup?.itemIds ?? [])
  const canConfirm =
    auditNote.trim().length > 0 &&
    canonicalCandidateId &&
    selectedGroup &&
    !isSubmitting

  const handleConfirm = async () => {
    if (!canConfirm) return
    await onConfirm({
      canonicalItemId: canonicalCandidateId,
      mergedAttributes: mergedAttributes ?? {},
      evidenceReferences: itemIds,
      auditNote: auditNote.trim(),
      sourceGroupIds: [selectedGroup?.id ?? ''],
    })
    // Parent closes modal on success via onOpenChange
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md"
        aria-describedby="merge-confirm-desc"
      >
        <DialogHeader>
          <DialogTitle>Confirm Merge</DialogTitle>
          <DialogDescription id="merge-confirm-desc">
            You are about to merge {itemIds.length} duplicate item{itemIds.length !== 1 ? 's' : ''}{' '}
            into a single canonical record. This action will be recorded in the audit log.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            {isSubmitting && (
              <p className="text-sm text-primary mb-2 font-medium">Merging…</p>
            )}
            <p className="text-sm font-medium text-foreground">Canonical item</p>
            <p className="text-sm text-muted-foreground mt-1 font-mono">
              {canonicalCandidateId ?? '—'}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Items to merge: {itemIds.join(', ')}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-audit-note">
              Audit note <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="confirm-audit-note"
              value={auditNote}
              onChange={(e) => onAuditNoteChange(e.target.value)}
              placeholder="Required: Describe why this merge was performed"
              className="rounded-xl min-h-[80px]"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={cn(
              'rounded-full',
              canConfirm && 'bg-primary text-primary-foreground'
            )}
          >
            {isSubmitting ? 'Merging…' : 'Confirm Merge'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
