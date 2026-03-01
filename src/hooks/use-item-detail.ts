/**
 * useItemDetail - Fetches and manages item detail state
 */

import { useState, useCallback, useEffect } from 'react'
import {
  fetchItemDetail,
  confirmItem,
  updateItemAttributes,
  mergeItem,
  flagItem,
  addConfidenceCorrection,
  fetchSimilarItems,
} from '@/api/items'
import type { ItemDetail, ItemAttributes, MergeCandidate } from '@/types/item-detail'

export interface UseItemDetailResult {
  item: ItemDetail | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
  onConfirm: () => Promise<void>
  onUpdateAttributes: (attrs: Partial<ItemAttributes>) => Promise<void>
  onMerge: (targetItemId: string) => Promise<void>
  onFlag: (reason: string, notes?: string) => Promise<void>
  onAddConfidenceCorrection: (score: number, notes?: string) => Promise<void>
  fetchSimilar: (itemId: string) => Promise<MergeCandidate[]>
}

export function useItemDetail(itemId: string | undefined): UseItemDetailResult {
  const [item, setItem] = useState<ItemDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const load = useCallback(async () => {
    if (!itemId) {
      setItem(null)
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchItemDetail(itemId)
      setItem(data ?? null)
      if (!data) setError(new Error('Item not found'))
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to load item'))
      setItem(null)
    } finally {
      setIsLoading(false)
    }
  }, [itemId])

  useEffect(() => {
    load()
  }, [load])

  const onConfirm = useCallback(async () => {
    if (!itemId) return
    const ok = await confirmItem(itemId)
    if (ok) {
      setItem((prev) =>
        prev
          ? { ...prev, status: 'confirmed', confirmedAt: new Date().toISOString() }
          : null
      )
    }
  }, [itemId])

  const onUpdateAttributes = useCallback(async (attrs: Partial<ItemAttributes>) => {
    if (!itemId) return
    const ok = await updateItemAttributes(itemId, attrs)
    if (ok) {
      setItem((prev) =>
        prev
          ? {
              ...prev,
              attributes: { ...(prev.attributes ?? {}), ...attrs },
            }
          : null
      )
    }
  }, [itemId])

  const onMerge = useCallback(async (targetItemId: string) => {
    if (!itemId || targetItemId === itemId) return
    const result = await mergeItem(itemId, targetItemId)
    if (result?.mergedItemId) {
      setItem((prev) => (prev ? { ...prev, id: result.mergedItemId! } : null))
    }
  }, [itemId])

  const onFlag = useCallback(async (reason: string, notes?: string) => {
    if (!itemId) return
    const ok = await flagItem(itemId, reason, notes)
    if (ok) {
      setItem((prev) =>
        prev ? { ...prev, isException: true, status: 'flagged' } : null
      )
    }
  }, [itemId])

  const onAddConfidenceCorrection = useCallback(async (score: number, notes?: string) => {
    if (!itemId) return
    const ok = await addConfidenceCorrection(itemId, score, notes)
    if (ok) {
      const newVersion = {
        versionId: `cv-${Date.now()}`,
        score,
        changedAt: new Date().toISOString(),
        changedBy: 'Current User',
        notes,
      }
      setItem((prev) =>
        prev
          ? {
              ...prev,
              confidenceHistory: [...(prev.confidenceHistory ?? []), newVersion],
            }
          : null
      )
    }
  }, [itemId])

  const fetchSimilar = useCallback(async (id: string) => {
    return fetchSimilarItems(id)
  }, [])

  return {
    item,
    isLoading,
    error,
    refetch: load,
    onConfirm,
    onUpdateAttributes,
    onMerge,
    onFlag,
    onAddConfidenceCorrection,
    fetchSimilar,
  }
}
