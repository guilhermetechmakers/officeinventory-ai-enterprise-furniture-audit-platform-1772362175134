/**
 * Review Queue validation and formatting utilities
 * CRITICAL: Safe handling for runtime safety
 */

import type { ReviewItem, SiteContext } from '@/types/review-queue'
import { ensureArray, safeMap } from '@/lib/safe-array'

export function formatConfidence(conf: number | null | undefined): string {
  const val = conf ?? 0
  const pct = val > 1 ? Math.round(val) : Math.round(val * 100)
  return `${pct}%`
}

export function toDateString(ts: string | null | undefined): string {
  if (!ts) return ''
  try {
    const d = new Date(ts)
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

const DEFAULT_SITE_CONTEXT: SiteContext = {
  clientId: '',
  siteId: '',
  location: '',
  auditId: '',
}

export function sanitizeItem(item: ReviewItem | null | undefined): ReviewItem {
  if (!item || typeof item !== 'object') {
    return {
      id: '',
      aiItemId: '',
      type: 'Unknown',
      attributes: {},
      confidence: 0,
      siteContext: DEFAULT_SITE_CONTEXT,
      status: 'lowConfidence',
      createdAt: '',
      updatedAt: '',
    }
  }
  const ctx = item.siteContext ?? {}
  return {
    id: String(item.id ?? ''),
    aiItemId: String(item.aiItemId ?? ''),
    type: String(item.type ?? 'Unknown'),
    attributes: item.attributes && typeof item.attributes === 'object' ? item.attributes : {},
    confidence: typeof item.confidence === 'number' ? item.confidence : 0,
    siteContext: {
      clientId: ctx.clientId ?? '',
      siteId: ctx.siteId ?? '',
      location: ctx.location ?? '',
      auditId: ctx.auditId ?? '',
    },
    imageUrl: item.imageUrl ?? undefined,
    evidenceUrls: ensureArray(item.evidenceUrls),
    status: item.status ?? 'lowConfidence',
    assignedTo: item.assignedTo ?? undefined,
    reviewerNotes: item.reviewerNotes ?? undefined,
    createdAt: String(item.createdAt ?? ''),
    updatedAt: String(item.updatedAt ?? ''),
  }
}

/** Re-export for convenience */
export { ensureArray, safeMap }
