/**
 * useAuditListData - Fetches tenants and audits for Audit List / Site Manager
 * Falls back to mock data when API is not yet wired
 */

import { useQuery } from '@tanstack/react-query'
import {
  fetchTenants,
  fetchAudits,
  fetchSiteDetail,
  type AuditsFilters,
} from '@/api/audits'
import {
  mockTenants,
  mockAudits,
  mockSiteDetail,
} from '@/data/audit-list-mocks'

const TENANTS_KEY = ['audit-list', 'tenants']
const AUDITS_KEY = ['audit-list', 'audits']
const SITE_DETAIL_KEY = ['audit-list', 'site-detail']

export function useTenants() {
  return useQuery({
    queryKey: TENANTS_KEY,
    queryFn: async () => {
      const data = await fetchTenants(true)
      return data.length > 0 ? data : mockTenants
    },
  })
}

export function useAudits(filters: AuditsFilters = {}) {
  return useQuery({
    queryKey: [...AUDITS_KEY, filters],
    queryFn: async () => {
      const data = await fetchAudits(filters)
      return data.length > 0 ? data : mockAudits
    },
  })
}

export function useSiteDetail(siteId: string | undefined) {
  return useQuery({
    queryKey: [...SITE_DETAIL_KEY, siteId],
    queryFn: async () => {
      if (!siteId) return null
      const data = await fetchSiteDetail(siteId)
      return data ?? mockSiteDetail
    },
    enabled: !!siteId,
  })
}
