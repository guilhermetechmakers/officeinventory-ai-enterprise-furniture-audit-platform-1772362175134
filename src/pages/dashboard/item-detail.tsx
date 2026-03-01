/**
 * Item Detail & Evidence - Full detail view for a single detected item
 */

import { useState, useCallback, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import {
  EvidenceView,
  AttributeEditor,
  ConfidenceTimeline,
  MergeDeduplicationPanel,
  FlagExceptionModal,
  ActivityLogPanel,
  ConfirmationButtonGroup,
} from '@/components/item-detail'
import { useItemDetail } from '@/hooks/use-item-detail'
import { ensureArray } from '@/lib/safe-array'

export function ItemDetailPage() {
  const { auditId, itemId } = useParams<{ auditId: string; itemId: string }>()
  const navigate = useNavigate()
  const {
    item,
    isLoading,
    error,
    refetch,
    onConfirm,
    onUpdateAttributes,
    onMerge,
    onFlag,
    onAddConfidenceCorrection,
    fetchSimilar,
  } = useItemDetail(itemId)

  const [flagModalOpen, setFlagModalOpen] = useState(false)
  const mergePanelRef = useRef<HTMLDivElement>(null)
  const [isConfirming, setIsConfirming] = useState(false)

  const handleConfirm = useCallback(async () => {
    setIsConfirming(true)
    try {
      await onConfirm()
      toast.success('Item confirmed')
    } catch {
      toast.error('Failed to confirm item')
    } finally {
      setIsConfirming(false)
    }
  }, [onConfirm])

  const handleMerge = useCallback(
    async (targetId: string) => {
      if (!itemId) return
      try {
        await onMerge(targetId)
        toast.success('Items merged successfully')
        const target = `/dashboard/audits/${auditId ?? ''}`
        navigate(target)
      } catch {
        toast.error('Failed to merge items')
      }
    },
    [itemId, auditId, onMerge, navigate]
  )

  const handleFlag = useCallback(
    async (reason: string, notes?: string) => {
      try {
        await onFlag(reason, notes)
        toast.success('Item flagged')
        setFlagModalOpen(false)
      } catch {
        toast.error('Failed to flag item')
      }
    },
    [onFlag]
  )

  const handleAttributeSave = useCallback(
    async (attrs: Parameters<typeof onUpdateAttributes>[0]) => {
      try {
        await onUpdateAttributes(attrs)
        toast.success('Attributes updated')
      } catch {
        toast.error('Failed to update attributes')
      }
    },
    [onUpdateAttributes]
  )

  const handleConfidenceCorrection = useCallback(
    async (score: number, notes?: string) => {
      try {
        await onAddConfidenceCorrection(score, notes)
        toast.success('Confidence correction added')
      } catch {
        toast.error('Failed to add correction')
      }
    },
    [onAddConfidenceCorrection]
  )

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <Button variant="ghost" size="sm" asChild>
          <Link to={auditId ? `/dashboard/audits/${auditId}` : '/dashboard/audits'}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Audit
          </Link>
        </Button>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-96 rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Button variant="ghost" size="sm" asChild>
          <Link to={auditId ? `/dashboard/audits/${auditId}` : '/dashboard/audits'}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Audit
          </Link>
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground">
              {error?.message ?? 'Item not found'}
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

  const category = item?.attributes?.category ?? 'Item'
  const isConfirmed = item?.status === 'confirmed'
  const isFlagged = item?.isException === true

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link to={auditId ? `/dashboard/audits/${auditId}` : '/dashboard/audits'}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Audit
          </Link>
        </Button>
        <ConfirmationButtonGroup
          onConfirm={handleConfirm}
          onMerge={() => mergePanelRef.current?.scrollIntoView({ behavior: 'smooth' })}
          onFlag={() => setFlagModalOpen(true)}
          isConfirmed={isConfirmed}
          isFlagged={isFlagged}
          isConfirming={isConfirming}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <EvidenceView
            croppedDetectionImageUrl={item?.croppedDetectionImageUrl ?? null}
            sourceImages={ensureArray(item?.sourceImages)}
            itemCategory={category}
          />

          <AttributeEditor
            attributes={item?.attributes ?? null}
            onSave={handleAttributeSave}
          />

          <ConfidenceTimeline
            confidenceHistory={ensureArray(item?.confidenceHistory)}
            onAddCorrection={handleConfidenceCorrection}
          />

          <div ref={mergePanelRef}>
            <MergeDeduplicationPanel
              itemId={item?.id ?? ''}
              fetchSimilar={fetchSimilar}
              onMerge={handleMerge}
            />
          </div>
        </div>

        <div className="space-y-6">
          <ActivityLogPanel
            entries={ensureArray(item?.activityLog)}
            maxItems={20}
          />
        </div>
      </div>

      <FlagExceptionModal
        open={flagModalOpen}
        onOpenChange={setFlagModalOpen}
        onFlag={handleFlag}
        itemCategory={category}
      />
    </div>
  )
}
