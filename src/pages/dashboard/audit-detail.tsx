/**
 * Audit Detail - Full audit detail view with items, filters, and quick actions
 */

import { useState, useCallback, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import {
  AuditHeader,
  SummaryTiles,
  FiltersBar,
  DetectionsPanel,
  QuickActionsBar,
} from '@/components/audit-detail'
import { useAuditDetail } from '@/hooks/use-audit-detail'
import type { AuditDetailFilters, DetectedItem } from '@/types/audit-detail'

const defaultFilters: AuditDetailFilters = {
  sortBy: 'confidence-desc',
}

export function AuditDetailPage() {
  const { auditId } = useParams<{ auditId: string }>()
  const {
    audit,
    items,
    isLoading,
    error,
    totalItems,
    lowConfidenceCount,
    exceptionsCount,
    duplicatesCount,
    categories,
    conditions,
    refetch,
  } = useAuditDetail(auditId)

  const [filters, setFilters] = useState<AuditDetailFilters>(defaultFilters)
  const [localItems, setLocalItems] = useState<DetectedItem[]>([])

  const safeItems = items ?? []

  useEffect(() => {
    setLocalItems(Array.isArray(items) ? items : [])
  }, [auditId, items])

  const handleItemConfirm = useCallback((id: string) => {
    setLocalItems((prev) =>
      (prev ?? []).map((i) =>
        i?.id === id ? { ...i, status: 'confirmed' as const } : i
      )
    )
    toast.success('Item confirmed')
  }, [])

  const handleItemFlag = useCallback((id: string) => {
    setLocalItems((prev) =>
      (prev ?? []).map((i) =>
        i?.id === id ? { ...i, isException: true, status: 'flagged' as const } : i
      )
    )
    toast.success('Item flagged')
  }, [])

  const handleItemMerge = useCallback((id: string) => {
    setLocalItems((prev) =>
      (prev ?? []).map((i) =>
        i?.id === id ? { ...i, isDuplicate: false } : i
      )
    )
    toast.success('Duplicate merged')
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/audits">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Audits
          </Link>
        </Button>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="mt-2 h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))}
            </div>
            <div className="space-y-4">
              <Skeleton className="h-12 w-full rounded-xl" />
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-20 rounded-2xl" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !audit) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/audits">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Audits
          </Link>
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground">
              {error?.message ?? 'Audit not found'}
            </p>
            <Button
              variant="outline"
              className="mt-4 rounded-full"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const effectiveItems = (localItems ?? []).length > 0 ? (localItems ?? []) : safeItems

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/audits">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Audits
          </Link>
        </Button>
        <QuickActionsBar
          auditId={audit?.id ?? ''}
          onStartReview={() => toast.info('Review workflow will open when connected')}
        />
      </div>

      <AuditHeader audit={audit} />

      <section aria-label="Summary metrics">
        <SummaryTiles
          totalItems={totalItems}
          lowConfidenceCount={lowConfidenceCount}
          exceptionsCount={exceptionsCount}
          duplicatesCount={duplicatesCount}
        />
      </section>

      <Card>
        <CardHeader className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-lg font-semibold">Detected Items</h2>
            <FiltersBar
              filters={filters}
              onFiltersChange={setFilters}
              categories={categories}
              conditions={conditions}
            />
          </div>
        </CardHeader>
        <CardContent>
          <DetectionsPanel
            items={effectiveItems}
            filters={filters}
            onConfirm={handleItemConfirm}
            onFlag={handleItemFlag}
            onMerge={handleItemMerge}
          />
        </CardContent>
      </Card>
    </div>
  )
}
