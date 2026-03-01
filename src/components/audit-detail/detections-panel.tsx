/**
 * DetectionsPanel - List/grid of DetectedItemCard components with per-item actions
 */

import { useMemo } from 'react'
import { ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'
import { safeFilter, safeMap, ensureArray } from '@/lib/safe-array'
import type { DetectedItem, AuditDetailFilters } from '@/types/audit-detail'
import { DetectedItemCard } from './detected-item-card'

export interface DetectionsPanelProps {
  items: DetectedItem[]
  filters: AuditDetailFilters
  auditId?: string
  onConfirm?: (id: string) => void
  onFlag?: (id: string) => void
  onMerge?: (id: string) => void
  className?: string
}

function applyFiltersAndSort(
  items: DetectedItem[],
  filters: AuditDetailFilters
): DetectedItem[] {
  let result = ensureArray(items)

  const minConf = filters.minConfidence ?? 0
  const maxConf = filters.maxConfidence ?? 100
  result = safeFilter(result, (item: DetectedItem) => {
    const raw = item?.confidence ?? 0
    const pct = raw > 1 ? raw : raw * 100
    return pct >= minConf && pct <= maxConf
  })

  if (filters.category && filters.category !== 'all') {
    result = safeFilter(
      result,
      (item: DetectedItem) => (item?.category ?? 'Unknown') === filters.category
    )
  }

  if (filters.condition && filters.condition !== 'all') {
    result = safeFilter(
      result,
      (item: DetectedItem) => (item?.condition ?? '') === filters.condition
    )
  }

  if (filters.onlyFlagged) {
    result = safeFilter(result, (item: DetectedItem) => item?.isException === true)
  }

  const sortBy = filters.sortBy ?? 'confidence-desc'
  result = [...result].sort((a: DetectedItem, b: DetectedItem) => {
    switch (sortBy) {
      case 'confidence-desc':
        return (b?.confidence ?? 0) - (a?.confidence ?? 0)
      case 'confidence-asc':
        return (a?.confidence ?? 0) - (b?.confidence ?? 0)
      case 'category':
        return (a?.category ?? '').localeCompare(b?.category ?? '')
      case 'date':
        return (
          new Date(b?.detectedAt ?? 0).getTime() -
          new Date(a?.detectedAt ?? 0).getTime()
        )
      default:
        return 0
    }
  })

  return result
}

export function DetectionsPanel({
  items,
  filters,
  auditId,
  onConfirm,
  onFlag,
  onMerge,
  className,
}: DetectionsPanelProps) {
  const filteredItems = useMemo(
    () => applyFiltersAndSort(items, filters),
    [items, filters]
  )

  if (filteredItems.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 py-16',
          className
        )}
        role="status"
        aria-label="No detections"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
          <ClipboardList className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          No detections match filters
        </h3>
        <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
          Try adjusting your filters or reset to see all detected items.
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn('space-y-4', className)}
      role="list"
      aria-label="Detected items"
    >
      {safeMap(filteredItems, (item) => (
        <DetectedItemCard
          key={item?.id ?? ''}
          item={item}
          auditId={auditId}
          onConfirm={onConfirm}
          onFlag={onFlag}
          onMerge={onMerge}
        />
      ))}
    </div>
  )
}
