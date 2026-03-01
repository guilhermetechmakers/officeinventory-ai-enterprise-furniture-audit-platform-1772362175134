import { useQuery } from '@tanstack/react-query'
import { fetchDashboardData } from '@/api/dashboard'
import { safeArray } from './use-supa-safe-data'
import type { DashboardData } from '@/types/dashboard'

const DASHBOARD_QUERY_KEY = ['dashboard'] as const

/** Fetch dashboard data with React Query - all arrays guarded against null/undefined */
export function useFetchDashboardData() {
  const query = useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: async (): Promise<DashboardData> => {
      const data = await fetchDashboardData()
      return {
        audits: safeArray(data?.audits),
        kpis: data?.kpis ?? {
          activeAudits: 0,
          itemsToday: 0,
          pendingReviews: 0,
          exportCreditsUsed: 0,
        },
        recentActivities: safeArray(data?.recentActivities),
        sites: safeArray(data?.sites),
      }
    },
  })

  const audits = safeArray(query.data?.audits)
  const kpis = query.data?.kpis ?? {
    activeAudits: 0,
    itemsToday: 0,
    pendingReviews: 0,
    exportCreditsUsed: 0,
  }
  const recentActivities = safeArray(query.data?.recentActivities)
  const sites = safeArray(query.data?.sites)

  return {
    ...query,
    data: query.data,
    audits,
    kpis,
    recentActivities,
    sites,
  }
}
