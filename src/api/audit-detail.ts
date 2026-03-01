/**
 * Audit Detail API
 * Fetches audit details with detected items; falls back to mock when API unavailable
 */

import { apiGet, apiPost } from '@/lib/api'
import type { AuditDetail, DetectedItem, AuditDetailFilters } from '@/types/audit-detail'
import { mockAuditDetail } from '@/data/audit-detail-mocks'

function safeArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : []
}

/** GET /audits/{auditId} */
export async function fetchAuditDetail(auditId: string): Promise<AuditDetail | null> {
  if (!auditId) return null
  try {
    const response = await apiGet<{ data?: AuditDetail } | AuditDetail>(
      `/audits/${auditId}`
    )
    const data =
      response && typeof response === 'object' && 'data' in response
        ? (response as { data?: AuditDetail }).data
        : (response as AuditDetail)
    if (data) {
      const items = Array.isArray((data as AuditDetail & { items?: DetectedItem[] }).items)
        ? (data as AuditDetail & { items?: DetectedItem[] }).items
        : []
      return { ...data, items: items ?? [] }
    }
    return null
  } catch {
    return getMockAuditDetail(auditId)
  }
}

/** POST /audits/{auditId}/review/assign */
export async function assignReviewer(
  auditId: string,
  reviewerId: string
): Promise<boolean> {
  if (!auditId || !reviewerId) return false
  try {
    await apiPost(`/audits/${auditId}/review/assign`, { reviewerId })
    return true
  } catch {
    return false
  }
}

/** POST /audits/{auditId}/export */
export async function exportAudit(
  auditId: string,
  format: 'csv' | 'pdf'
): Promise<Blob | null> {
  if (!auditId) return null
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL ?? '/api'}/audits/${auditId}/export`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ format }),
      }
    )
    if (!response.ok) throw new Error(response.statusText)
    return response.blob()
  } catch {
    return null
  }
}

/** GET /audits/{auditId}/items?filters=params */
export async function fetchAuditItems(
  auditId: string,
  _filters?: AuditDetailFilters
): Promise<DetectedItem[]> {
  if (!auditId) return []
  try {
    const response = await apiGet<{ data?: DetectedItem[] } | DetectedItem[]>(
      `/audits/${auditId}/items`
    )
    const data =
      response && typeof response === 'object' && 'data' in response
        ? (response as { data?: DetectedItem[] }).data
        : (response as DetectedItem[])
    return safeArray(data)
  } catch {
    const audit = await getMockAuditDetail(auditId)
    return audit?.items ?? []
  }
}

function getMockAuditDetail(auditId: string): AuditDetail | null {
  const mock = { ...mockAuditDetail, id: auditId }
  return mock
}
