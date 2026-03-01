import { useState, useEffect, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import { fetchBatches, getSitesFromBatches, retryBatch, cancelBatch } from '@/api/batches'
import { BulkUploadStatusPageView } from './bulk-upload-status-page-view'
import type { Batch, BatchFilter } from '@/types/bulk-upload'

const DEBOUNCE_MS = 300

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

export function BulkUploadStatusPage() {
  const [batches, setBatches] = useState<Batch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<BatchFilter>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null)
  const [retryingId, setRetryingId] = useState<string | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  const debouncedQuery = useDebounce(searchQuery, DEBOUNCE_MS)

  const effectiveFilter: BatchFilter = useMemo(
    () => ({
      ...filter,
      query: debouncedQuery.trim() || undefined,
    }),
    [filter, debouncedQuery]
  )

  const loadBatches = useCallback(async () => {
    setIsLoading(true)
    try {
      const list = await fetchBatches(effectiveFilter)
      setBatches(Array.isArray(list) ? list : [])
    } catch {
      setBatches([])
      toast.error('Failed to load batches')
    } finally {
      setIsLoading(false)
    }
  }, [effectiveFilter])

  useEffect(() => {
    loadBatches()
  }, [loadBatches])

  const sites = useMemo(() => getSitesFromBatches(batches), [batches])

  const selectedBatch = useMemo(
    () => (batches ?? []).find((b) => b.id === selectedBatchId) ?? null,
    [batches, selectedBatchId]
  )

  const handleFilterChange = useCallback((newFilter: BatchFilter) => {
    setFilter(newFilter)
  }, [])

  const handleClearFilters = useCallback(() => {
    setFilter({})
    setSearchQuery('')
  }, [])

  const handleViewDetails = useCallback((batch: Batch) => {
    setSelectedBatchId(batch.id)
  }, [])

  const handleCloseDrawer = useCallback(() => {
    setSelectedBatchId(null)
  }, [])

  const handleRetry = useCallback(async (batch: Batch) => {
    setRetryingId(batch.id)
    try {
      const res = await retryBatch(batch.id)
      if (res.success && res.batch) {
        setBatches((prev) => {
          const list = prev ?? []
          const idx = list.findIndex((b) => b.id === batch.id)
          if (idx < 0) return list
          const next = [...list]
          next[idx] = res.batch!
          return next
        })
        setSelectedBatchId((id) => (id === batch.id ? batch.id : id))
        toast.success('Retry started for batch')
      } else {
        toast.error('Failed to retry batch')
      }
    } catch {
      toast.error('Failed to retry batch')
    } finally {
      setRetryingId(null)
    }
  }, [])

  const handleCancel = useCallback(async (batch: Batch) => {
    setCancellingId(batch.id)
    try {
      const res = await cancelBatch(batch.id)
      if (res.success) {
        setBatches((prev) => {
          const list = prev ?? []
          const idx = list.findIndex((b) => b.id === batch.id)
          if (idx < 0) return list
          const next = [...list]
          next[idx] = { ...next[idx], status: 'failed' as const, progress: 0 }
          return next
        })
        toast.success('Batch cancelled')
        handleCloseDrawer()
      } else {
        toast.error('Failed to cancel batch')
      }
    } catch {
      toast.error('Failed to cancel batch')
    } finally {
      setCancellingId(null)
    }
  }, [handleCloseDrawer])

  const handleMarkReview = useCallback((_batch: Batch) => {
    toast.success('Batch marked for review')
  }, [])

  return (
    <BulkUploadStatusPageView
      batches={batches}
      isLoading={isLoading}
      filter={filter}
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      sites={sites}
      onFilterChange={handleFilterChange}
      onClearFilters={handleClearFilters}
      selectedBatch={selectedBatch}
      isDrawerOpen={selectedBatchId !== null}
      onViewDetails={handleViewDetails}
      onCloseDrawer={handleCloseDrawer}
      onRetry={handleRetry}
      onCancel={handleCancel}
      onMarkReview={handleMarkReview}
      retryingId={retryingId}
      cancellingId={cancellingId}
    />
  )
}
