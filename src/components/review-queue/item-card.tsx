/**
 * ItemCard - Thumbnail, inferred attributes, confidence, site context, jump-to-detail CTA
 */

import { Link } from 'react-router-dom'
import { ImageIcon, ImageOff } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import type { ReviewItem } from '@/types/review-queue'
import { formatConfidence } from '@/lib/review-queue-utils'
import { ItemDetailLink } from './item-detail-link'

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
    case 'approved':
      return 'success'
    case 'exception':
      return 'warning'
    case 'duplicate':
      return 'info'
    case 'inReview':
      return 'info'
    default:
      return 'secondary'
  }
}

function formatStatus(status: string | null | undefined): string {
  if (!status) return 'Unknown'
  const map: Record<string, string> = {
    lowConfidence: 'Low Confidence',
    exception: 'Exception',
    duplicate: 'Duplicate',
    inReview: 'In Review',
    approved: 'Approved',
  }
  return map[status] ?? status
}

function getAttributeStrings(attrs: Record<string, unknown>): string[] {
  if (!attrs || typeof attrs !== 'object') return []
  return Object.entries(attrs)
    .filter(([, v]) => v != null && v !== '')
    .map(([k, v]) => `${k}: ${String(v)}`)
}

export interface ItemCardProps {
  item: ReviewItem
  selected?: boolean
  onSelect?: (id: string, selected: boolean) => void
  showCheckbox?: boolean
  className?: string
}

export function ItemCard({
  item,
  selected = false,
  onSelect,
  showCheckbox = true,
  className,
}: ItemCardProps) {
  const thumbnailUrl = item?.imageUrl ?? (item?.evidenceUrls ?? [])[0] ?? null
  const rawConf = item?.confidence ?? 0
  const confidencePct = rawConf > 1 ? Math.round(rawConf) : Math.round(rawConf * 100)
  const typeLabel = item?.type ?? 'Unknown'
  const attrs = getAttributeStrings(item?.attributes ?? {})
  const location = item?.siteContext?.location ?? item?.siteContext?.siteId ?? 'Unknown location'
  const auditId = item?.siteContext?.auditId

  const handleCheckboxChange = (checked: boolean | 'indeterminate') => {
    onSelect?.(item?.id ?? '', checked === true)
  }

  return (
    <div
      className={cn(
        'group flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-card transition-all duration-200',
        'hover:shadow-elevated hover:border-primary/20',
        selected && 'ring-2 ring-primary border-primary/40',
        className
      )}
      role="article"
      aria-label={`Review item: ${typeLabel}, ${confidencePct}% confidence`}
    >
      <div className="flex gap-4 sm:flex-row sm:items-start">
        {showCheckbox && onSelect && (
          <div className="flex shrink-0 pt-1">
            <Checkbox
              checked={selected}
              onCheckedChange={handleCheckboxChange}
              aria-label={`Select ${typeLabel}`}
            />
          </div>
        )}
        <Link
          to={`/dashboard/audits/${auditId || 'aud-1'}/items/${item?.id ?? ''}`}
          className="relative block h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-muted transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label={`View ${typeLabel} details`}
        >
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={`Evidence for ${typeLabel}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ImageOff className="h-10 w-10" aria-hidden />
            </div>
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity group-hover:bg-black/20 group-hover:opacity-100">
            <ImageIcon className="h-6 w-6 text-white" aria-hidden />
          </span>
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <ItemDetailLink auditId={auditId} itemId={item?.id ?? ''}>
              {typeLabel}
            </ItemDetailLink>
            <Badge variant={getStatusVariant(item?.status ?? '')}>
              {formatStatus(item?.status)}
            </Badge>
            <Badge variant={getConfidenceVariant(confidencePct)}>
              {formatConfidence(item?.confidence)}
            </Badge>
          </div>
          {attrs.length > 0 && (
            <p className="mt-1 text-sm text-muted-foreground">
              {attrs.slice(0, 4).join(' · ')}
            </p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">{location}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <ItemDetailLink
            auditId={auditId}
            itemId={item?.id ?? ''}
            className="inline-flex items-center justify-center h-9 rounded-full border-2 border-primary bg-transparent px-4 text-xs font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Jump to Detail
          </ItemDetailLink>
        </div>
      </div>
    </div>
  )
}
