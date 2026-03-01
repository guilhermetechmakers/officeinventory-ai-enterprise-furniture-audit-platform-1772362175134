/**
 * Audit List / Site Manager API
 * Placeholder implementations for future REST/GraphQL wiring
 */

import {
  apiGet,
  apiPost,
  apiDelete,
  type ApiError,
} from '@/lib/api'
import type {
  Tenant,
  Site,
  Floor,
  Audit,
  SiteDetail,
  CreateAuditPayload,
} from '@/types/audit-list'

/** Validate API response is array */
function safeArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : []
}

export interface AuditsFilters {
  tenantId?: string
  siteId?: string
  floorId?: string
  zoneId?: string
}

/** GET /tenants?includeSites=true */
export async function fetchTenants(includeSites = true): Promise<Tenant[]> {
  try {
    const response = await apiGet<{ data?: Tenant[] } | Tenant[]>(
      `/tenants?includeSites=${includeSites}`
    )
    const data = response && typeof response === 'object' && 'data' in response
      ? (response as { data?: Tenant[] }).data
      : (response as Tenant[])
    return safeArray(data)
  } catch {
    return []
  }
}

/** GET /tenants/{tenantId}/sites */
export async function fetchSitesByTenant(tenantId: string): Promise<Site[]> {
  if (!tenantId) return []
  try {
    const response = await apiGet<{ data?: Site[] } | Site[]>(
      `/tenants/${tenantId}/sites`
    )
    const data = response && typeof response === 'object' && 'data' in response
      ? (response as { data?: Site[] }).data
      : (response as Site[])
    return safeArray(data)
  } catch {
    return []
  }
}

/** GET /sites/{siteId}/floors */
export async function fetchFloorsBySite(siteId: string): Promise<Floor[]> {
  if (!siteId) return []
  try {
    const response = await apiGet<{ data?: Floor[] } | Floor[]>(
      `/sites/${siteId}/floors`
    )
    const data = response && typeof response === 'object' && 'data' in response
      ? (response as { data?: Floor[] }).data
      : (response as Floor[])
    return safeArray(data)
  } catch {
    return []
  }
}

/** GET /audits?tenantId=&siteId=&floorId=&zoneId= */
export async function fetchAudits(filters: AuditsFilters = {}): Promise<Audit[]> {
  try {
    const params = new URLSearchParams()
    if (filters.tenantId) params.set('tenantId', filters.tenantId)
    if (filters.siteId) params.set('siteId', filters.siteId)
    if (filters.floorId) params.set('floorId', filters.floorId)
    if (filters.zoneId) params.set('zoneId', filters.zoneId)
    const query = params.toString()
    const response = await apiGet<{ data?: Audit[] } | Audit[]>(
      `/audits${query ? `?${query}` : ''}`
    )
    const data = response && typeof response === 'object' && 'data' in response
      ? (response as { data?: Audit[] }).data
      : (response as Audit[])
    return safeArray(data)
  } catch {
    return []
  }
}

/** POST /audits */
export async function createAudit(payload: CreateAuditPayload): Promise<Audit | null> {
  try {
    const response = await apiPost<{ data?: Audit } | Audit>('/audits', payload)
    const data = response && typeof response === 'object' && 'data' in response
      ? (response as { data?: Audit }).data
      : (response as Audit)
    return data ?? null
  } catch (err) {
    throw err as ApiError
  }
}

/** POST /audits/{auditId}/clone */
export async function cloneAudit(auditId: string): Promise<Audit | null> {
  if (!auditId) return null
  try {
    const response = await apiPost<{ data?: Audit } | Audit>(
      `/audits/${auditId}/clone`
    )
    const data = response && typeof response === 'object' && 'data' in response
      ? (response as { data?: Audit }).data
      : (response as Audit)
    return data ?? null
  } catch (err) {
    throw err as ApiError
  }
}

/** POST /audits/bulk-export */
export async function bulkExportAudits(auditIds: string[]): Promise<Blob | null> {
  const ids = auditIds ?? []
  if (ids.length === 0) return null
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL ?? '/api'}/audits/bulk-export`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ auditIds: ids }),
      }
    )
    if (!response.ok) throw new Error(response.statusText)
    return response.blob()
  } catch {
    return null
  }
}

/** POST /audits/bulk-archive */
export async function bulkArchiveAudits(auditIds: string[]): Promise<boolean> {
  const ids = auditIds ?? []
  if (ids.length === 0) return false
  try {
    await apiPost('/audits/bulk-archive', { auditIds: ids })
    return true
  } catch {
    return false
  }
}

/** DELETE /audits/bulk-delete */
export async function bulkDeleteAudits(auditIds: string[]): Promise<boolean> {
  const ids = auditIds ?? []
  if (ids.length === 0) return false
  try {
    await apiDelete(`/audits/bulk-delete?ids=${ids.join(',')}`)
    return true
  } catch {
    return false
  }
}

/** GET /sites/{siteId} */
export async function fetchSiteDetail(siteId: string): Promise<SiteDetail | null> {
  if (!siteId) return null
  try {
    const response = await apiGet<{ data?: SiteDetail } | SiteDetail>(
      `/sites/${siteId}`
    )
    const data = response && typeof response === 'object' && 'data' in response
      ? (response as { data?: SiteDetail }).data
      : (response as SiteDetail)
    return data ?? null
  } catch {
    return null
  }
}
