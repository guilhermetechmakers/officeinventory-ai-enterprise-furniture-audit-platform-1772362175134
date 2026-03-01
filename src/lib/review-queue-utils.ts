/**
 * Review Queue - Validation and formatting utilities
 * CRITICAL: Use for runtime safety
 */

import type { ReviewItem } from '@/types/review-queue'
import { ensureArray } from '@/lib/safe-array'

const DEFAULT_SITE_CONTEXT = {
  clientId: '',
  siteId: '',
  location: '',
}

/** Returns a safe ReviewItem shape with defaults for null/undefined fields */
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
  return {
    id: String(item.id ?? ''),
    aiItemId: String(item.aiItemId ?? ''),
    type: String(item.type ?? 'Unknown'),
    attributes: item.attributes && typeof item.attributes === 'object' ? item.attributes : {},
    confidence: typeof item.confidence === 'number' ? item.confidence : 0,
    siteContext:
      item.siteContext && typeof item.siteContext === 'object'
        ? { ...DEFAULT_SITE_CONTEXT, ...item.siteContext }
        : DEFAULT_SITE_CONTEXT,
    imageUrl: item.imageUrl ?? undefined,
    evidenceUrls: Array.isArray(item.evidenceUrls) ? item.evidenceUrls : [],
    status: (item.status ?? 'lowConfidence') as ReviewItem['status'],
    assignedTo: item.assignedTo ?? undefined,
    reviewerNotes: item.reviewerNotes ?? undefined,
    createdAt: String(item.createdAt ?? ''),
    updatedAt: String(item.updatedAt ?? ''),
    auditId: item.auditId ?? undefined,
  }
}

/** Format confidence as percentage string */
export function formatConfidence(conf: number | null | undefined): string {
  const val = typeof conf === 'number' ? conf : 0
  const pct = val > 1 ? val : val * 100
  return `${Math.round(pct)}%`
}

/** Format timestamp to readable date string */
export function toDateString(ts: string | number | null | undefined): string {
  if (ts == null || ts === '') return ''
  const date = typeof ts === 'number' ? new Date(ts) : new Date(ts)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Get site context display string */
export function getSiteContextDisplay(ctx: ReviewItem['siteContext']): string {
  if (!ctx || typeof ctx !== 'object') return 'Unknown location'
  const parts = [
    ctx.siteName ?? ctx.location,
    ctx.floorName,
    ctx.roomName,
  ].filter(Boolean)
  return parts.length > 0 ? parts.join(' · ') : 'Unknown location'
}

/** Get attributes display string from ReviewItem */
export function getAttributesDisplay(attrs: Record<string, unknown>): string {
  if (!attrs || typeof attrs !== 'object') return ''
  const entries = Object.entries(attrs)
    .filter(([, v]) => v != null && v !== '')
    .map(([k, v]) => `${k}: ${String(v)}`)
  return entries.join(' · ')
}

export { ensureArray }
