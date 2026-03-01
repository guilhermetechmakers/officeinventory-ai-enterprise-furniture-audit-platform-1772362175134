import { apiGet } from '@/lib/api'
import type { DashboardData, DashboardApiResponse } from '@/types/dashboard'
import { MOCK_DASHBOARD_DATA } from '@/data/dashboard-mock'

/** Normalize API response to safe DashboardData shape */
function normalizeDashboardResponse(raw: unknown): DashboardData {
  const data = raw as DashboardApiResponse | null | undefined
  const audits = Array.isArray(data?.audits) ? data.audits : []
  const recentActivities = Array.isArray(data?.recentActivities) ? data.recentActivities : []
  const sites = Array.isArray(data?.sites) ? data.sites : []
  const kpis = data?.kpis ?? {}

  return {
    audits,
    recentActivities,
    sites,
    kpis: {
      activeAudits: typeof kpis.activeAudits === 'number' ? kpis.activeAudits : 0,
      itemsToday: typeof kpis.itemsToday === 'number' ? kpis.itemsToday : 0,
      pendingReviews: typeof kpis.pendingReviews === 'number' ? kpis.pendingReviews : 0,
      exportCreditsUsed: typeof kpis.exportCreditsUsed === 'number' ? kpis.exportCreditsUsed : 0,
    },
  }
}

/** Fetch dashboard data - uses mock when API unavailable */
export async function fetchDashboardData(): Promise<DashboardData> {
  try {
    const response = await apiGet<DashboardApiResponse | DashboardData>('/dashboard')
    return normalizeDashboardResponse(response)
  } catch {
    return MOCK_DASHBOARD_DATA
  }
}
