/**
 * BatchMetadataForm: Batch name, inspector, timestamp, tags, notes.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Batch } from '@/types/capture'

const NOTES_MAX_LENGTH = 500

export interface BatchMetadataFormProps {
  batch: Partial<Batch>
  onBatchChange: (updates: Partial<Batch>) => void
  disabled?: boolean
}

export function BatchMetadataForm({ batch, onBatchChange, disabled }: BatchMetadataFormProps) {
  const notes = batch.notes ?? ''
  const notesLength = notes.length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Batch details</CardTitle>
        <CardDescription>Add batch name, inspector, and notes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="batch-name">Batch name</Label>
          <Input
            id="batch-name"
            placeholder="e.g. Floor 2 Audit - March 2025"
            value={batch.batchName ?? ''}
            onChange={(e) => onBatchChange({ batchName: e.target.value })}
            disabled={disabled}
            className="min-h-[48px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="inspector">Inspector</Label>
          <Input
            id="inspector"
            placeholder="Your name"
            value={batch.inspector ?? ''}
            onChange={(e) => onBatchChange({ inspector: e.target.value })}
            disabled={disabled}
            className="min-h-[48px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Optional notes about this batch..."
            value={notes}
            onChange={(e) => onBatchChange({ notes: e.target.value.slice(0, NOTES_MAX_LENGTH) })}
            disabled={disabled}
            rows={3}
            className="min-h-[80px]"
          />
          <p className="text-xs text-muted-foreground">
            {notesLength}/{NOTES_MAX_LENGTH} characters
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
