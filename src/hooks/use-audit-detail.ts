/**
 * useAuditDetail - Fetches audit detail data with safe handling
 */

import { useState, useEffect, useCallback } from 'react'
import { fetchAuditDetail } from '@/api/audit-detail'
import type { AuditDetail, DetectedItem } from '@/types/audit-detail'
import { ensureArray } from '@/lib/safe-array'

const LOW_CONFIDENCE_THRESHOLD = 0.5

export interface UseAuditDetailResult {
  audit: AuditDetail | null
  items: DetectedItem[]
  isLoading: boolean
  error: Error | null
  totalItems: number
  lowConfidenceCount: number
  exceptionsCount: number
  duplicatesCount: number
  categories: string[]
  conditions: string[]
  refetch: () => Promise<void>
}

export function useAuditDetail(auditId: string | undefined): UseAuditDetailResult {
  const [audit, setAudit] = useState<AuditDetail | null>(null)
  const [items, setItems] = useState<DetectedItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    if (!auditId) {
      setAudit(null)
      setItems([])
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchAuditDetail(auditId)
      const safeItems = Array.isArray(data?.items) ? data.items : []
      setAudit(data ?? null)
      setItems(safeItems)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load audit'))
      setAudit(null)
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }, [auditId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const safeItems = ensureArray(items)
  const totalItems = safeItems.length
  const lowConfidenceCount = safeItems.filter(
    (i: DetectedItem) => (i?.confidence ?? 0) < LOW_CONFIDENCE_THRESHOLD
  ).length
  const exceptionsCount = safeItems.filter((i: DetectedItem) => i?.isException === true).length
  const duplicatesCount = safeItems.filter((i: DetectedItem) => i?.isDuplicate === true).length

  const categories = Array.from(
    new Set(safeItems.map((i: DetectedItem) => i?.category ?? 'Unknown').filter(Boolean))
  ).sort() as string[]

  const conditions = Array.from(
    new Set(safeItems.map((i: DetectedItem) => i?.condition ?? '').filter(Boolean))
  ).sort() as string[]

  return {
    audit,
    items: safeItems,
    isLoading,
    error,
    totalItems,
    lowConfidenceCount,
    exceptionsCount,
    duplicatesCount,
    categories,
    conditions,
    refetch: fetchData,
  }
}
