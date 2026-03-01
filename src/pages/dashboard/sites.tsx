import { useParams, Link } from 'react-router-dom'
import { MapPin, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useFetchDashboardData } from '@/hooks/use-fetch-dashboard-data'
import { safeArray, safeNumber } from '@/hooks/use-supa-safe-data'
import type { SiteMetrics } from '@/types/dashboard'

export function SitesPage() {
  const { id } = useParams<{ id: string }>()
  const { sites } = useFetchDashboardData()
  const list = safeArray(sites)
  const site = id ? list.find((s) => s?.id === id) : null

  if (id && !site) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Site not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (id && site) {
    const metrics = site?.metrics as SiteMetrics | undefined
    const activeAudits = safeNumber(metrics?.activeAudits)
    const itemsToday = safeNumber(metrics?.itemsToday)
    const pendingReviews = safeNumber(metrics?.pendingReviews)
    return (
      <div className="space-y-6 animate-fade-in">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>{site.name ?? 'Unnamed Site'}</CardTitle>
            {site.location && (
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {site.location}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">Active Audits</p>
                <p className="text-2xl font-bold">{activeAudits}</p>
              </div>
              <div className="rounded-xl bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">Items Today</p>
                <p className="text-2xl font-bold">{itemsToday}</p>
              </div>
              <div className="rounded-xl bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">Pending Reviews</p>
                <p className="text-2xl font-bold">{pendingReviews}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Sites</h1>
        <p className="text-muted-foreground mt-1">Manage your sites and locations</p>
      </div>
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Select a site from the dashboard to view details.</p>
          <Button asChild className="mt-4">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
