/**
 * DetectedItemCard - Thumbnail, category, attributes, confidence, evidence link, status, inline actions
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Check,
  Flag,
  Merge,
  ImageIcon,
  ImageOff,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { DetectedItem } from '@/types/audit-detail'
import { EvidenceModal } from './evidence-modal'

function getConfidenceVariant(
  confidencePct: number
): 'success' | 'info' | 'warning' | 'destructive' {
  if (confidencePct >= 80) return 'success'
  if (confidencePct >= 50) return 'info'
  if (confidencePct >= 30) return 'warning'
  return 'destructive'
}

function getStatusVariant(
  status: string
): 'success' | 'info' | 'warning' | 'secondary' {
  switch (status) {
    case 'confirmed':
      return 'success'
    case 'flagged':
      return 'warning'
    case 'suspect':
      return 'info'
    default:
      return 'secondary'
  }
}

function formatItemStatus(status: string | null | undefined): string {
  if (!status) return 'Unknown'
  const map: Record<string, string> = {
    confirmed: 'Confirmed',
    flagged: 'Flagged',
    suspect: 'Suspect',
  }
  return map[status] ?? status.charAt(0).toUpperCase() + status.slice(1)
}

export interface DetectedItemCardProps {
  item: DetectedItem
  auditId?: string
  onConfirm?: (id: string) => void
  onFlag?: (id: string) => void
  onMerge?: (id: string) => void
  className?: string
}

export function DetectedItemCard({
  item,
  auditId,
  onConfirm,
  onFlag,
  onMerge,
  className,
}: DetectedItemCardProps) {
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false)

  const thumbnailUrl = item?.thumbnailUrl ?? item?.evidenceUrl ?? null
  const rawConf = item?.confidence ?? 0
  const confidencePct = Math.round(rawConf > 1 ? rawConf : rawConf * 100)
  const category = item?.category ?? 'Unknown'
  const attributes: string[] = [
    item?.material,
    item?.finish,
    item?.condition,
    item?.brandModel ?? null,
  ].filter(Boolean) as string[]

  return (
    <>
      <div
        className={cn(
          'group flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-card transition-all duration-200 hover:shadow-elevated hover:border-primary/20 sm:flex-row sm:items-center',
          className
        )}
        role="article"
        aria-label={`Detection: ${category}, ${confidencePct}% confidence`}
      >
        <button
          type="button"
          onClick={() => setEvidenceModalOpen(true)}
          className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-muted transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="View evidence"
        >
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={`Evidence for ${category}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ImageOff className="h-8 w-8" aria-hidden />
            </div>
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity group-hover:bg-black/20 group-hover:opacity-100">
            <ImageIcon className="h-6 w-6 text-white" aria-hidden />
          </span>
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {auditId && item?.id ? (
              <Link
                to={`/dashboard/audits/${auditId}/items/${item.id}`}
                className="font-semibold text-foreground hover:text-primary hover:underline flex items-center gap-1"
              >
                {category}
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <h3 className="font-semibold text-foreground">{category}</h3>
            )}
            <Badge variant={getStatusVariant(item?.status ?? '')}>
              {formatItemStatus(item?.status)}
            </Badge>
            {item?.isException && (
              <Badge variant="warning">Exception</Badge>
            )}
            {item?.isDuplicate && (
              <Badge variant="info">Duplicate</Badge>
            )}
          </div>
          {attributes.length > 0 && (
            <p className="mt-1 text-sm text-muted-foreground">
              {attributes.join(' · ')}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
          <Badge variant={getConfidenceVariant(confidencePct)}>
            {confidencePct}%
          </Badge>
          <div className="flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onConfirm?.(item?.id)}
              aria-label="Confirm item"
              title="Confirm"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onFlag?.(item?.id)}
              aria-label="Flag as exception"
              title="Flag"
            >
              <Flag className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onMerge?.(item?.id)}
              aria-label="Merge duplicate"
              title="Merge"
            >
              <Merge className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <EvidenceModal
        open={evidenceModalOpen}
        onOpenChange={setEvidenceModalOpen}
        evidenceUrl={item?.evidenceUrl ?? null}
        sourceImageUrl={item?.sourceImageUrl ?? null}
        itemCategory={category}
      />
    </>
  )
}
