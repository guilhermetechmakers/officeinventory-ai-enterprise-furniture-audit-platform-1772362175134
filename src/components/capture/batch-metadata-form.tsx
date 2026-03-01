/**
 * BatchMetadataForm - Batch name, inspector, timestamp, tags, notes
 */

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const NOTES_MAX_LENGTH = 500

export interface BatchMetadata {
  batchName: string
  inspector: string
  timestamp: string
  notes: string
  tags: string[]
}

interface BatchMetadataFormProps {
  value: BatchMetadata
  onChange: (metadata: BatchMetadata) => void
  disabled?: boolean
}

export function BatchMetadataForm({
  value,
  onChange,
  disabled = false,
}: BatchMetadataFormProps) {
  const [tagInput, setTagInput] = useState('')

  const handleChange = (updates: Partial<BatchMetadata>) => {
    onChange({ ...value, ...updates })
  }

  const addTag = () => {
    const trimmed = tagInput.trim()
    if (!trimmed) return
    const tags = value.tags ?? []
    if (tags.includes(trimmed)) return
    handleChange({ tags: [...tags, trimmed] })
    setTagInput('')
  }

  const removeTag = (index: number) => {
    const tags = (value.tags ?? []).filter((_, i) => i !== index)
    handleChange({ tags })
  }

  const notesLength = (value.notes ?? '').length
  const notesOverLimit = notesLength > NOTES_MAX_LENGTH

  return (
    <Card>
      <CardHeader>
        <CardTitle>Batch Details</CardTitle>
        <CardDescription>
          Add batch name, inspector, and optional notes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="batch-name">Batch name</Label>
          <Input
            id="batch-name"
            placeholder="e.g. Building A Floor 2 Audit"
            value={value.batchName}
            onChange={(e) => handleChange({ batchName: e.target.value })}
            disabled={disabled}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="inspector">Inspector</Label>
          <Input
            id="inspector"
            placeholder="Your name"
            value={value.inspector}
            onChange={(e) => handleChange({ inspector: e.target.value })}
            disabled={disabled}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="timestamp">Date & time</Label>
          <Input
            id="timestamp"
            type="datetime-local"
            value={value.timestamp}
            onChange={(e) => handleChange({ timestamp: e.target.value })}
            disabled={disabled}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <textarea
            id="notes"
            placeholder="Optional notes about this batch..."
            value={value.notes}
            onChange={(e) => handleChange({ notes: e.target.value.slice(0, NOTES_MAX_LENGTH) })}
            disabled={disabled}
            rows={3}
            className={cn(
              'flex w-full rounded-xl border border-border bg-secondary px-4 py-2 text-sm shadow-sm transition-colors',
              'placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              notesOverLimit && 'border-destructive'
            )}
            maxLength={NOTES_MAX_LENGTH}
            aria-invalid={notesOverLimit}
          />
          <p className="text-xs text-muted-foreground">
            {notesLength} / {NOTES_MAX_LENGTH} characters
          </p>
        </div>

        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              disabled={disabled}
              className="rounded-xl flex-1"
            />
            <button
              type="button"
              onClick={addTag}
              disabled={disabled || !tagInput.trim()}
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              Add
            </button>
          </div>
          {(value.tags ?? []).length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {(value.tags ?? []).map((tag, i) => (
                <span
                  key={`${tag}-${i}`}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-3 py-1 text-xs font-medium"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(i)}
                    disabled={disabled}
                    className="hover:text-destructive focus:ring-2 focus:ring-ring rounded-full p-0.5"
                    aria-label={`Remove tag ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
