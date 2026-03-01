import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useHealthOverview, useBillingOverview } from '@/hooks/use-admin'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { AdminSection } from '@/types/admin'

export interface AdminOverviewProps {
  onSectionChange?: (section: AdminSection) => void
}

export function AdminOverview({ onSectionChange }: AdminOverviewProps) {
  const { data: health } = useHealthOverview()
  const { data: billing } = useBillingOverview()
  const alerts = Array.isArray(health?.alerts) ? health.alerts : []
  const activeAlerts = alerts.filter((a) => !a.acknowledged)
  const credits = billing?.usageCredits ?? 0
  const limit = billing?.creditsLimit ?? 0
  const usagePercent = limit > 0 ? (credits / limit) * 100 : 0

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Admin Overview</h2>
        <p className="text-muted-foreground mt-1">
          Health and billing status at a glance
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="rounded-2xl shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">System Health</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSectionChange?.('health')}
              >
                View
              </Button>
            </div>
            <CardDescription>Queue, storage, and error rates</CardDescription>
          </CardHeader>
          <CardContent>
            {activeAlerts.length > 0 ? (
              <div className="flex items-center gap-2 text-warning">
                <AlertTriangle className="h-5 w-5" />
                <span>{activeAlerts.length} alert(s) need attention</span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">All systems nominal</p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Billing</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSectionChange?.('billing')}
              >
                View
              </Button>
            </div>
            <CardDescription>Subscription and usage</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              <span className="font-medium">{billing?.subscriptionTier ?? '—'}</span>
              <span className="text-muted-foreground ml-1">
                • {credits.toLocaleString()} / {limit.toLocaleString()} credits
              </span>
            </p>
            {usagePercent > 80 && (
              <p className="text-warning text-sm mt-1">Usage above 80%</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl shadow-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common admin tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => onSectionChange?.('tenants')}
            >
              Create Tenant
            </Button>
            <Button
              variant="outline"
              onClick={() => onSectionChange?.('users')}
            >
              Invite User
            </Button>
            <Button
              variant="outline"
              onClick={() => onSectionChange?.('sso')}
            >
              Configure SSO
            </Button>
            <Button
              variant="outline"
              onClick={() => onSectionChange?.('preferences')}
            >
              Settings & Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
