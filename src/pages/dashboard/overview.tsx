import { ClipboardList, TrendingUp, FileCheck, CreditCard } from 'lucide-react'
import { useFetchDashboardData } from '@/hooks/use-fetch-dashboard-data'
import {
  KPIPanel,
  DataCard,
  QuickActionsBar,
  ActiveAuditsGrid,
  RecentActivityFeed,
  SitesOverview,
  RoleGuard,
} from '@/components/dashboard'
import { Skeleton } from '@/components/ui/skeleton'

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>
      <div className="flex flex-wrap gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 w-32 rounded-full" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-64 rounded-2xl lg:col-span-2" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
      <div>
        <Skeleton className="mb-4 h-6 w-32" />
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function DashboardOverview() {
  const { isLoading, audits, kpis, recentActivities, sites } = useFetchDashboardData()

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Operational visibility and quick navigation
        </p>
      </div>

      <QuickActionsBar />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPIPanel
          title="Active Audits"
          value={kpis?.activeAudits ?? 0}
          icon={ClipboardList}
        />
        <KPIPanel
          title="Items Detected Today"
          value={kpis?.itemsToday ?? 0}
          icon={TrendingUp}
        />
        <KPIPanel
          title="Pending Reviews"
          value={kpis?.pendingReviews ?? 0}
          icon={FileCheck}
        />
        <KPIPanel
          title="Export Credits Used"
          value={kpis?.exportCreditsUsed ?? 0}
          icon={CreditCard}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DataCard title="Active Audits" description="Current audits in progress">
            <ActiveAuditsGrid audits={audits} />
          </DataCard>
        </div>

        <DataCard
          title="Recent Activity"
          description="Latest updates across your organization"
        >
          <RecentActivityFeed activities={recentActivities} maxItems={8} />
        </DataCard>
      </div>

      <RoleGuard roles={['admin', 'field_user']}>
        <DataCard
          title="Sites Overview"
          description="Per-site metrics and quick access"
        >
          <SitesOverview sites={sites} />
        </DataCard>
      </RoleGuard>
    </div>
  )
}
