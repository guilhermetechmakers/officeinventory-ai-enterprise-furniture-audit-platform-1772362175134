/**
 * Items API - Fetch item detail, confirm, patch, merge, flag
 * Uses native fetch via api utilities; guards against null/undefined
 */

import { apiGet, apiPost, apiPatch } from '@/lib/api'
import type {
  ItemDetail,
  ItemAttributes,
  MergeCandidate,
  EditRecord,
} from '@/types/item-detail'
import { getMockItemDetail } from '@/data/item-detail-mocks'

function safeArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : []
}

function safeObject<T extends object>(value: T | null | undefined): T {
  return value && typeof value === 'object' ? value : ({} as T)
}

/** GET /api/items/{itemId} */
export async function fetchItemDetail(itemId: string): Promise<ItemDetail | null> {
  if (!itemId) return null
  try {
    const response = await apiGet<{ data?: ItemDetail } | ItemDetail>(
      `/items/${itemId}`
    )
    const data =
      response && typeof response === 'object' && 'data' in response
        ? (response as { data?: ItemDetail }).data
        : (response as ItemDetail)
    if (data && typeof data === 'object') {
      return normalizeItemDetail(data as unknown as Record<string, unknown>)
    }
    return null
  } catch {
    return getMockItemDetail(itemId)
  }
}

/** POST /api/items/{itemId}/confirm */
export async function confirmItem(itemId: string): Promise<boolean> {
  if (!itemId) return false
  try {
    await apiPost(`/items/${itemId}/confirm`)
    return true
  } catch {
    return false
  }
}

/** PATCH /api/items/{itemId} */
export async function updateItemAttributes(
  itemId: string,
  attributes: Partial<ItemAttributes>
): Promise<boolean> {
  if (!itemId) return false
  try {
    await apiPatch(`/items/${itemId}`, { attributes })
    return true
  } catch {
    return false
  }
}

/** POST /api/items/{itemId}/merge */
export async function mergeItem(
  itemId: string,
  targetItemId: string
): Promise<{ success: boolean; mergedItemId?: string }> {
  if (!itemId || !targetItemId || itemId === targetItemId) {
    return { success: false }
  }
  try {
    const response = await apiPost<{ mergedItemId?: string }>(
      `/items/${itemId}/merge`,
      { targetItemId }
    )
    const mergedId =
      response && typeof response === 'object' && 'mergedItemId' in response
        ? (response as { mergedItemId?: string }).mergedItemId
        : undefined
    return { success: true, mergedItemId: mergedId }
  } catch {
    return { success: false }
  }
}

/** POST /api/items/{itemId}/flag */
export async function flagItem(
  itemId: string,
  reason: string,
  notes?: string
): Promise<boolean> {
  if (!itemId || !reason || reason.trim().length < 10) return false
  try {
    await apiPost(`/items/${itemId}/flag`, { reason: reason.trim(), notes })
    return true
  } catch {
    return false
  }
}

/** POST /api/items/{itemId}/confidence-correction */
export async function addConfidenceCorrection(
  itemId: string,
  score: number,
  notes?: string
): Promise<boolean> {
  if (!itemId || typeof score !== 'number') return false
  const clamped = Math.max(0, Math.min(100, score))
  try {
    await apiPost(`/items/${itemId}/confidence-correction`, {
      score: clamped,
      notes,
    })
    return true
  } catch {
    return false
  }
}

/** GET /api/items/{itemId}/similar - similarity search for merge candidates */
export async function fetchSimilarItems(
  itemId: string
): Promise<MergeCandidate[]> {
  if (!itemId) return []
  try {
    const response = await apiGet<{ data?: MergeCandidate[] } | MergeCandidate[]>(
      `/items/${itemId}/similar`
    )
    const data =
      response && typeof response === 'object' && 'data' in response
        ? (response as { data?: MergeCandidate[] }).data
        : (response as MergeCandidate[])
    return safeArray(data)
  } catch {
    return getMockSimilarItems(itemId)
  }
}

function getMockSimilarItems(itemId: string): MergeCandidate[] {
  return [
    {
      id: 'di5',
      category: 'Office Chair',
      confidence: 0.95,
      thumbnailUrl: 'https://placehold.co/80x80/e8e9ec/6b6b6b?text=C',
      similarityScore: 0.88,
    },
    {
      id: 'di2',
      category: 'Desk',
      confidence: 0.78,
      thumbnailUrl: 'https://placehold.co/80x80/e8e9ec/6b6b6b?text=D',
      similarityScore: 0.45,
    },
  ].filter((c) => c.id !== itemId)
}

/** Normalize API response to ItemDetail with safe defaults */
export function normalizeItemDetail(raw: Record<string, unknown>): ItemDetail {
  const id = String(raw?.id ?? '')
  const auditId = String(raw?.auditId ?? '')
  const attrs = raw?.attributes
  const attributes =
    attrs && typeof attrs === 'object'
      ? (attrs as ItemAttributes)
      : ({} as ItemAttributes)

  return {
    id,
    auditId,
    croppedDetectionImageUrl:
      typeof raw?.croppedDetectionImageUrl === 'string'
        ? raw.croppedDetectionImageUrl
        : null,
    sourceImages: safeArray(raw?.sourceImages as unknown[]).map((s: unknown) => {
      const x = safeObject(s as Record<string, unknown>)
      return {
        id: String(x.id ?? ''),
        url: String(x.url ?? ''),
        thumbnailUrl: String(x.thumbnailUrl ?? x.url ?? ''),
      }
    }),
    attributes: Object.keys(attributes).length > 0 ? attributes : null,
    confidenceHistory: safeArray(raw?.confidenceHistory as unknown[]).map((c: unknown) => {
      const x = safeObject(c as Record<string, unknown>)
      return {
        versionId: String(x.versionId ?? ''),
        score: Number(x.score ?? 0),
        changedAt: String(x.changedAt ?? ''),
        changedBy: String(x.changedBy ?? ''),
        notes: x.notes != null ? String(x.notes) : undefined,
      }
    }),
    edits: (Array.isArray(raw?.edits) ? raw.edits : []) as EditRecord[],
    activityLog: safeArray(raw?.activityLog as unknown[]).map((a: unknown) => {
      const x = safeObject(a as Record<string, unknown>)
      return {
        id: String(x.id ?? ''),
        actor: String(x.actor ?? ''),
        action: String(x.action ?? ''),
        timestamp: String(x.timestamp ?? ''),
        changes: x.changes as Record<string, unknown> | undefined,
      }
    }),
    status: String(raw?.status ?? 'suspect'),
    isDuplicate: Boolean(raw?.isDuplicate),
    isException: Boolean(raw?.isException),
    detectedAt:
      typeof raw?.detectedAt === 'string' ? raw.detectedAt : undefined,
  }
}
