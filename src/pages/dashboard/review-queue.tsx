/**
 * Review Queue - Worklist for AI-detected items needing human validation
 */

import { useState, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, Copy, User, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { toast } from 'sonner'
import {
  ItemCard,
  BulkActionsBar,
  AssignmentPanel,
  FiltersPanel,
  MetricsPanel,
} from '@/components/review-queue'
import type { ReviewQueueMetrics } from '@/types/review-queue'
import { useReviewQueueData, useReviewQueueMetrics } from '@/hooks/use-review-queue-data'
import { useBulkExport } from '@/hooks/use-bulk-export'
import { assignReviewItems, bulkAcceptItems } from '@/api/review-queue'
import type { ReviewQueueTab, ReviewQueueFilters } from '@/types/review-queue'
import { ensureArray } from '@/lib/safe-array'

const TABS: { value: ReviewQueueTab; label: string; icon: typeof AlertTriangle }[] = [
  { value: 'low', label: 'Low Confidence', icon: AlertTriangle },
  { value: 'exceptions', label: 'Exceptions', icon: AlertTriangle },
  { value: 'duplicates', label: 'Duplicates', icon: Copy },
  { value: 'assigned', label: 'Assigned to Me', icon: User },
]

export function ReviewQueuePage() {
  const queryClient = useQueryClient()

  const [activeTab, setActiveTab] = useState<ReviewQueueTab>('low')
  const [filters, setFilters] = useState<ReviewQueueFilters>({})
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [assignmentPanelOpen, setAssignmentPanelOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const { items, isLoading, error, refetch } = useReviewQueueData(
    activeTab,
    filters,
    1,
    50
  )
  const { metrics = {} as ReviewQueueMetrics, isLoading: metricsLoading } = useReviewQueueMetrics()
  const { exportItems, isExporting } = useBulkExport()

  const safeItems = ensureArray(items)

  const assignMutation = useMutation({
    mutationFn: assignReviewItems,
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Items assigned successfully')
        setSelectedItems([])
        setAssignmentPanelOpen(false)
        queryClient.invalidateQueries({ queryKey: ['review-queue'] })
        queryClient.invalidateQueries({ queryKey: ['review-queue-metrics'] })
      } else {
        toast.error(data.message ?? 'Assignment failed')
      }
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Assignment failed')
    },
  })

  const acceptMutation = useMutation({
    mutationFn: bulkAcceptItems,
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Items accepted')
        setSelectedItems([])
        queryClient.invalidateQueries({ queryKey: ['review-queue'] })
        queryClient.invalidateQueries({ queryKey: ['review-queue-metrics'] })
      } else {
        toast.error(data.message ?? 'Accept failed')
      }
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Accept failed')
    },
  })

  const handleSelectItem = useCallback((id: string, selected: boolean) => {
    setSelectedItems((prev) => {
      const list = prev ?? []
      if (selected) return list.includes(id) ? list : [...list, id]
      return list.filter((x) => x !== id)
    })
  }, [])

  const handleAccept = useCallback(
    async (ids: string[]) => {
      await acceptMutation.mutateAsync({ itemIds: ids, action: 'accept' })
    },
    [acceptMutation]
  )

  const handleAssign = useCallback((ids: string[]) => {
    setSelectedItems(ids)
    setAssignmentPanelOpen(true)
  }, [])

  const handleExport = useCallback(
    async (ids: string[], format: 'csv' | 'pdf') => {
      await exportItems(ids, format)
    },
    [exportItems]
  )

  const handleAssignmentSubmit = useCallback(
    async (payload: {
      itemIds: string[]
      assigneeId: string
      teamId?: string
      slaNotes?: string
      dueDate?: string
    }) => {
      return assignMutation.mutateAsync(payload)
    },
    [assignMutation]
  )

  const isAccepting = acceptMutation.isPending

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Review Queue</h1>
          <p className="text-muted-foreground mt-1">
            Worklist for human-in-the-loop validation of AI-detected items
          </p>
        </div>
        <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-full" aria-label="Open filters">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Narrow down the review queue</SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <FiltersPanel filters={filters} onFiltersChange={setFilters} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          className="cursor-pointer transition-all hover:shadow-elevated"
          onClick={() => setActiveTab('low')}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" aria-hidden />
              <span className="text-sm font-medium">Low Confidence</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {metricsLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                metrics?.lowConfidenceCount ?? 0
              )}
            </p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer transition-all hover:shadow-elevated"
          onClick={() => setActiveTab('exceptions')}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" aria-hidden />
              <span className="text-sm font-medium">Exceptions</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {metricsLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                metrics?.exceptionsCount ?? 0
              )}
            </p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer transition-all hover:shadow-elevated"
          onClick={() => setActiveTab('duplicates')}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Copy className="h-5 w-5 text-info" aria-hidden />
              <span className="text-sm font-medium">Duplicates</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {metricsLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                metrics?.duplicatesCount ?? 0
              )}
            </p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer transition-all hover:shadow-elevated"
          onClick={() => setActiveTab('assigned')}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" aria-hidden />
              <span className="text-sm font-medium">Assigned to Me</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {metricsLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                metrics?.assignedToMeCount ?? 0
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="order-2 lg:order-1">
          <MetricsPanel metrics={metrics} isLoading={metricsLoading} />
        </aside>

        <div className="space-y-4 order-1 lg:order-2">
          <BulkActionsBar
            selectedIds={selectedItems}
            onClearSelection={() => setSelectedItems([])}
            onAccept={handleAccept}
            onAssign={handleAssign}
            onExport={handleExport}
            isAccepting={isAccepting}
            isExporting={isExporting}
          />

          <Card>
            <CardHeader>
              <CardTitle>Queue Items</CardTitle>
              <CardDescription>
                Review and validate AI detections. Select items for bulk actions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ReviewQueueTab)}>
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 rounded-xl bg-[rgb(var(--primary-foreground))] p-1">
                  {TABS.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {TABS.map((tab) => (
                  <TabsContent key={tab.value} value={tab.value} className="mt-6">
                    {isLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                          <Skeleton key={i} className="h-32 rounded-2xl" />
                        ))}
                      </div>
                    ) : error ? (
                      <div
                        className="rounded-2xl border border-destructive/50 bg-destructive/10 p-6 text-center"
                        role="alert"
                      >
                        <p className="text-destructive font-medium">
                          {error?.message ?? 'Failed to load queue'}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4 rounded-full"
                          onClick={() => refetch()}
                        >
                          Retry
                        </Button>
                      </div>
                    ) : safeItems.length === 0 ? (
                      <div
                        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center"
                        role="status"
                      >
                        <tab.icon className="h-12 w-12 text-muted-foreground mb-4" aria-hidden />
                        <p className="font-medium text-foreground">No items in this queue</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Adjust filters or check back later
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {safeItems.map((item) => (
                          <ItemCard
                            key={item?.id ?? ''}
                            item={item}
                            selected={selectedItems.includes(item?.id ?? '')}
                            onSelect={handleSelectItem}
                            showCheckbox
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <AssignmentPanel
        open={assignmentPanelOpen}
        onOpenChange={setAssignmentPanelOpen}
        itemIds={selectedItems}
        onSubmit={handleAssignmentSubmit}
        onSuccess={() => refetch()}
      />
    </div>
  )
}
