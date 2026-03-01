/**
 * SiteDetailPanel - Detail view for site/floor with metadata, items, queues
 * Null-safe data handling; navigates from tree or audit card
 */

import { Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Layers, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ActivityLogPanel } from './activity-log-panel'
import type { SiteDetail } from '@/types/audit-list'

function safeArray<T>(arr: T[] | null | undefined): T[] {
  return Array.isArray(arr) ? arr : []
}

interface SiteDetailPanelProps {
  site: SiteDetail | null
  floorId?: string
  isLoading?: boolean
}

export function SiteDetailPanel({
  site,
  floorId,
  isLoading = false,
}: SiteDetailPanelProps) {
  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/audits">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Audits
          </Link>
        </Button>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!site) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/audits">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Audits
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

  const audits = safeArray(site.audits)
  const floors = safeArray(site.floors)
  const items = safeArray(site.items)
  const activityLog = safeArray(site.activityLog)

  const filteredAudits = floorId
    ? audits.filter((a) => a.floorId === floorId)
    : audits

  return (
    <div className="space-y-6 animate-fade-in">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/dashboard/audits">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Audits
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <CardTitle>{site.name ?? 'Unnamed Site'}</CardTitle>
          </div>
          {site.tenantName && (
            <CardDescription className="flex items-center gap-1">
              {site.tenantName}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">Floors</p>
              <p className="text-2xl font-bold">{floors.length}</p>
            </div>
            <div className="rounded-xl bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">Active Audits</p>
              <p className="text-2xl font-bold">{filteredAudits.length}</p>
            </div>
            <div className="rounded-xl bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">Items Detected</p>
              <p className="text-2xl font-bold">{items.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {floors.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Floors & Zones</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {floors.map((floor) => {
                const zones = safeArray(floor?.zones)
                return (
                  <div
                    key={floor.id}
                    className="rounded-xl border border-border p-4"
                  >
                    <p className="font-medium">{floor.name ?? 'Unnamed'}</p>
                    {zones.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {zones.map((z) => (
                          <span
                            key={z.id}
                            className="rounded-full bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground"
                          >
                            {z.name ?? 'Unnamed'}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {filteredAudits.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Audits</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredAudits.map((audit) => (
                <Link
                  key={audit.id}
                  to={`/dashboard/audits/${audit.id}`}
                  className="block rounded-xl border border-border p-4 transition-colors hover:bg-muted/30 hover:border-primary/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{audit.name ?? 'Unnamed'}</p>
                      <p className="text-sm text-muted-foreground">
                        {audit.itemCount ?? 0} items · {audit.status}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activityLog.length > 0 && (
        <ActivityLogPanel entries={activityLog} />
      )}
    </div>
  )
}
