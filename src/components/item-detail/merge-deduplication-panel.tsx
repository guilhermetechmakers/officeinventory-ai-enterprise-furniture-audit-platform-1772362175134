/**
 * MergeDeduplicationPanel - Similarity search, candidate duplicates, merge workflow
 * Ensures only valid merge targets are selectable
 */

import { useState, useCallback } from 'react'
import { Merge, Search, ImageOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ensureArray } from '@/lib/safe-array'
import type { MergeCandidate } from '@/types/item-detail'

export interface MergeDeduplicationPanelProps {
  itemId: string
  onMerge: (targetItemId: string) => void | Promise<void>
  fetchSimilar?: (itemId: string) => Promise<MergeCandidate[]>
  className?: string
}

export function MergeDeduplicationPanel({
  itemId,
  onMerge,
  fetchSimilar,
  className,
}: MergeDeduplicationPanelProps) {
  const [candidates, setCandidates] = useState<MergeCandidate[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const loadCandidates = useCallback(async () => {
    if (!itemId || !fetchSimilar) return
    setIsLoading(true)
    setHasSearched(true)
    try {
      const list = await fetchSimilar(itemId)
      const safe = ensureArray(list).filter(
        (c) => c?.id && c.id !== itemId
      ) as MergeCandidate[]
      setCandidates(safe)
      setSelectedId(null)
    } catch {
      setCandidates([])
    } finally {
      setIsLoading(false)
    }
  }, [itemId, fetchSimilar])

  const handleMerge = async () => {
    if (!selectedId || selectedId === itemId) return
    await onMerge(selectedId)
  }

  const safeCandidates = ensureArray(candidates)

  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-card p-6 shadow-card',
        className
      )}
      role="region"
      aria-label="Merge duplicates"
    >
      <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
        <Merge className="h-4 w-4 text-muted-foreground" />
        Merge Duplicate
      </h3>

      {!hasSearched ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Search for similar items that may be duplicates of this one.
          </p>
          <Button
            variant="outline"
            onClick={loadCandidates}
            disabled={!fetchSimilar || isLoading}
            className="rounded-full"
          >
            <Search className="h-4 w-4 mr-2" />
            {isLoading ? 'Searching…' : 'Find similar items'}
          </Button>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
        </div>
      ) : safeCandidates.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">
          No similar items found.
        </p>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select an item to merge with:
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {safeCandidates.map((c) => (
              <button
                key={c?.id ?? ''}
                type="button"
                onClick={() => setSelectedId(c?.id ?? null)}
                className={cn(
                  'flex items-center gap-4 rounded-xl border p-3 text-left transition-all duration-200',
                  selectedId === c?.id
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                    : 'border-border hover:border-primary/30 hover:bg-muted/30'
                )}
                aria-pressed={selectedId === c?.id}
                aria-label={`Select ${c?.category ?? 'item'} for merge`}
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                  {c?.thumbnailUrl ? (
                    <img
                      src={c.thumbnailUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageOff className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground truncate">
                    {c?.category ?? 'Unknown'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(c?.confidence ?? 0) > 1
                      ? `${c.confidence}%`
                      : `${Math.round((c?.confidence ?? 0) * 100)}%`}{' '}
                    confidence
                    {(c?.similarity ?? c?.similarityScore) != null &&
                      ` · ${Math.round(c.similarity != null ? c.similarity : (c.similarityScore ?? 0) * 100)}% similar`}
                  </p>
                </div>
              </button>
            ))}
          </div>
          <Button
            onClick={handleMerge}
            disabled={!selectedId}
            className="rounded-full"
          >
            <Merge className="h-4 w-4 mr-2" />
            Merge with selected
          </Button>
        </div>
      )}
    </div>
  )
}
