/**
 * Site/Floor Detail - Detail view when navigating from hierarchy tree
 */

import { useParams } from 'react-router-dom'
import { SiteDetailPanel } from '@/components/audit-list'
import { useSiteDetail } from '@/hooks/use-audit-list-data'

export function AuditsSiteDetailPage() {
  const { siteId, floorId } = useParams<{ siteId: string; floorId?: string }>()
  const { data: site, isLoading } = useSiteDetail(siteId)

  return (
    <SiteDetailPanel
      site={site ?? null}
      floorId={floorId}
      isLoading={isLoading}
    />
  )
}
