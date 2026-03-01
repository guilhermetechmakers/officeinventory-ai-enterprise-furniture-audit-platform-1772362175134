import { Upload } from 'lucide-react'
import { FiltersBar } from './filters-bar'
import { BatchCard } from './batch-card'
import { BatchDetailDrawer } from './batch-detail-drawer'
import { EmptyState } from '@/components/dashboard/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import type { Batch, BatchFilter } from '@/types/bulk-upload'

interface BulkUploadStatusPageViewProps {
  batches: Batch[]
  isLoading: boolean
  filter: BatchFilter
  searchValue: string
  onSearchChange: (value: string) => void
  sites: string[]
  onFilterChange: (filter: BatchFilter) => void
  onClearFilters: () => void
  selectedBatch: Batch | null
  isDrawerOpen: boolean
  onViewDetails: (batch: Batch) => void
  onCloseDrawer: () => void
  onRetry?: (batch: Batch) => void
  onCancel?: (batch: Batch) => void
  onMarkReview?: (batch: Batch) => void
  retryingId: string | null
  cancellingId: string | null
}

function BatchListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-32 rounded-2xl" />
      ))}
    </div>
  )
}

export function BulkUploadStatusPageView({
  batches,
  isLoading,
  filter,
  searchValue,
  onSearchChange,
  sites,
  onFilterChange,
  onClearFilters,
  selectedBatch,
  isDrawerOpen,
  onViewDetails,
  onCloseDrawer,
  onRetry,
  onCancel,
  onMarkReview,
  retryingId,
  cancellingId,
}: BulkUploadStatusPageViewProps) {
  const safeBatches = batches ?? []

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bulk Upload Status</h1>
        <p className="mt-1 text-muted-foreground">
          Monitor status of uploaded batches and AI inference jobs
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-card">
        <FiltersBar
          filter={filter}
          sites={sites}
          onFilterChange={onFilterChange}
          onClear={onClearFilters}
          onSearchChange={onSearchChange}
          searchValue={searchValue}
        />
      </div>

      {isLoading ? (
        <BatchListSkeleton />
      ) : safeBatches.length === 0 ? (
        <EmptyState
          icon={<Upload className="h-7 w-7" />}
          title="No batches found"
          description="Upload batches will appear here. Try adjusting your filters or search query."
          actionLabel="Clear filters"
          onAction={onClearFilters}
        />
      ) : (
        <div className="space-y-4" role="list" aria-label="Batch list">
          {safeBatches.map((batch) => (
            <BatchCard
              key={batch.id}
              batch={batch}
              onViewDetails={onViewDetails}
              onRetry={onRetry}
              onCancel={onCancel}
              isRetrying={retryingId === batch.id}
              isCancelling={cancellingId === batch.id}
            />
          ))}
        </div>
      )}

      <BatchDetailDrawer
        batch={selectedBatch}
        isOpen={isDrawerOpen}
        onClose={onCloseDrawer}
        onRetry={onRetry}
        onCancel={onCancel}
        onMarkReview={onMarkReview}
        isRetrying={selectedBatch ? retryingId === selectedBatch.id : false}
        isCancelling={selectedBatch ? cancellingId === selectedBatch.id : false}
      />
    </div>
  )
}
