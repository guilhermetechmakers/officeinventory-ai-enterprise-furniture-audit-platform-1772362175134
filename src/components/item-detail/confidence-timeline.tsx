/**
 * ConfidenceTimeline - Versioned list of confidence scores with timestamps
 * Supports adding a correction entry
 */

import { useState } from 'react'
import { TrendingUp, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { ensureArray } from '@/lib/safe-array'
import type { ConfidenceVersion } from '@/types/item-detail'

export interface ConfidenceTimelineProps {
  confidenceHistory: ConfidenceVersion[]
  onAddCorrection?: (score: number, notes?: string) => void | Promise<void>
  className?: string
}

function formatTimestamp(ts: string | null | undefined): string {
  if (!ts) return '—'
  try {
    return new Date(ts).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return '—'
  }
}

function getScoreVariant(score: number): 'success' | 'info' | 'warning' | 'destructive' {
  if (score >= 80) return 'success'
  if (score >= 50) return 'info'
  if (score >= 30) return 'warning'
  return 'destructive'
}

export function ConfidenceTimeline({
  confidenceHistory,
  onAddCorrection,
  className,
}: ConfidenceTimelineProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [score, setScore] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const history = ensureArray(confidenceHistory)
  const latest = history.length > 0 ? history[0] : null
  const latestScore = latest?.score ?? 0

  const handleOpenModal = () => {
    setScore(String(latestScore))
    setNotes('')
    setError(null)
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    const num = parseInt(score, 10)
    if (isNaN(num) || num < 0 || num > 100) {
      setError('Score must be between 0 and 100')
      return
    }
    setIsSubmitting(true)
    setError(null)
    try {
      await onAddCorrection?.(num, notes.trim() || undefined)
      setModalOpen(false)
    } catch {
      setError('Failed to add correction')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-card p-6 shadow-card',
        className
      )}
      role="region"
      aria-label="Confidence history"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          Confidence Score & History
        </h3>
        {onAddCorrection && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleOpenModal}
            className="rounded-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add correction
          </Button>
        )}
      </div>

      {history.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span
              className={cn(
                'inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium',
                getScoreVariant(latestScore) === 'success' &&
                  'border-primary/30 bg-primary/10 text-primary-foreground',
                getScoreVariant(latestScore) === 'info' &&
                  'border-info/30 bg-info/10 text-foreground',
                getScoreVariant(latestScore) === 'warning' &&
                  'border-warning/30 bg-warning/10 text-foreground',
                getScoreVariant(latestScore) === 'destructive' &&
                  'border-destructive/30 bg-destructive/10 text-destructive'
              )}
            >
              Current: {latestScore}%
            </span>
          </div>

          <ul className="space-y-3" role="list">
            {history.map((entry, i) => (
              <li
                key={entry?.versionId ?? i}
                className="flex items-start gap-4 rounded-xl border border-border/50 p-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <span className="text-xs font-medium text-muted-foreground">
                    {entry?.score ?? 0}%
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {entry?.changedBy ?? 'Unknown'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatTimestamp(entry?.changedAt)}
                  </p>
                  {entry?.notes && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {entry.notes}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground py-4">
          No confidence history yet.
        </p>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md" aria-label="Add confidence correction">
          <DialogHeader>
            <DialogTitle>Add Confidence Correction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="score" className="text-sm font-medium text-foreground">
                Adjusted score (0–100)
              </label>
              <Input
                id="score"
                type="number"
                min={0}
                max={100}
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <label htmlFor="notes" className="text-sm font-medium text-foreground">
                Notes (optional)
              </label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Reason for correction"
                className="mt-2"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setModalOpen(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rounded-full"
            >
              {isSubmitting ? 'Saving…' : 'Save correction'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
