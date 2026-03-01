import { Link } from 'react-router-dom'
import { MapPin, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from './empty-state'
import type { Site } from '@/types/dashboard'
import { safeArray, safeNumber } from '@/hooks/use-supa-safe-data'

interface SitesOverviewProps {
  sites?: Site[] | null
  isLoading?: boolean
  className?: string
}

export function SitesOverview({ sites, isLoading, className }: SitesOverviewProps) {
  const list = safeArray(sites)

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        <h3 className="text-base font-semibold">Sites Overview</h3>
        <p className="text-sm text-muted-foreground">Per-site metrics</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-muted/50" />
          ))}
        </div>
      </div>
    )
  }

  if (list.length === 0) {
    return (
      <EmptyState
        icon={<MapPin className="h-7 w-7" />}
        title="No sites"
        description="Add sites to organize your audits and inventory."
        className={className}
      />
    )
  }

  return (
    <div className={cn('grid gap-4 sm:grid-cols-2', className)}>
      {list.map((site) => {
        const metrics = site?.metrics
        const activeAudits = safeNumber(metrics?.activeAudits, 0)
        const itemsToday = safeNumber(metrics?.itemsToday, 0)
        const pendingReviews = safeNumber(metrics?.pendingReviews, 0)

        return (
          <Card
            key={site?.id ?? ''}
            className="transition-all duration-300 hover:shadow-elevated hover:-translate-y-0.5 hover:border-primary/30"
          >
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="font-semibold text-foreground">{site?.name ?? 'Unnamed site'}</h3>
                  {site?.location && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {site.location}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span>{activeAudits} active audits</span>
                  <span>·</span>
                  <span>{itemsToday} items today</span>
                  <span>·</span>
                  <span>{pendingReviews} pending reviews</span>
                </div>
                <Button asChild variant="outline" size="sm" className="w-fit rounded-full">
                  <Link to={`/dashboard/sites/${site?.id ?? ''}`}>
                    Open Site
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
