/**
 * HierarchyTree - Renders Tenant → Site → Floor/Zone with expand/collapse
 * Null-safe at every level; inline action pills per node
 */

import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  ChevronDown,
  MapPin,
  Building2,
  Layers,
  Square,
  Plus,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { Tenant, Site, Floor, Zone } from '@/types/audit-list'

interface HierarchyTreeProps {
  tenants: Tenant[]
  selectedSiteId?: string
  selectedFloorId?: string
  onSelectLocation?: (params: {
    tenantId: string
    siteId: string
    floorId: string
    zoneId?: string
  }) => void
  onCreateAudit?: (params: {
    tenantId: string
    siteId: string
    floorId: string
    zoneId?: string
  }) => void
}

function safeArray<T>(arr: T[] | null | undefined): T[] {
  return Array.isArray(arr) ? arr : []
}

export function HierarchyTree({
  tenants,
  selectedSiteId,
  selectedFloorId,
  onSelectLocation,
  onCreateAudit,
}: HierarchyTreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const navigate = useNavigate()

  const toggle = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const tenantList = safeArray(tenants)
  if (tenantList.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
        No tenants found
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl border border-border bg-card shadow-card"
      role="tree"
      aria-label="Location hierarchy"
    >
      <div className="border-b border-border px-4 py-3">
        <h3 className="font-semibold text-foreground">Locations</h3>
        <p className="text-xs text-muted-foreground">Tenant → Site → Floor → Zone</p>
      </div>
      <nav className="max-h-[calc(100vh-280px)] overflow-y-auto p-2">
        {tenantList.map((tenant) => (
          <TenantNode
            key={tenant.id}
            tenant={tenant}
            expanded={expanded}
            toggle={toggle}
            selectedSiteId={selectedSiteId}
            selectedFloorId={selectedFloorId}
            onSelectLocation={onSelectLocation}
            onCreateAudit={onCreateAudit}
            onViewSite={(id) => navigate(`/dashboard/audits/sites/${id}`)}
            onViewFloor={(siteId, floorId) =>
              navigate(`/dashboard/audits/sites/${siteId}/floors/${floorId}`)
            }
          />
        ))}
      </nav>
    </div>
  )
}

interface TenantNodeProps {
  tenant: Tenant
  expanded: Set<string>
  toggle: (id: string) => void
  selectedSiteId?: string
  selectedFloorId?: string
  onSelectLocation?: HierarchyTreeProps['onSelectLocation']
  onCreateAudit?: HierarchyTreeProps['onCreateAudit']
  onViewSite: (siteId: string) => void
  onViewFloor: (siteId: string, floorId: string) => void
}

function TenantNode({
  tenant,
  expanded,
  toggle,
  selectedSiteId,
  selectedFloorId,
  onSelectLocation,
  onCreateAudit,
  onViewSite,
  onViewFloor,
}: TenantNodeProps) {
  const sites = safeArray(tenant?.sites)
  const isExpanded = expanded.has(tenant.id)
  const hasChildren = sites.length > 0

  return (
    <div role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined}>
      <div
        className={cn(
          'group flex items-center gap-2 rounded-xl px-3 py-2 transition-colors',
          'hover:bg-muted/50'
        )}
      >
        <button
          type="button"
          onClick={() => hasChildren && toggle(tenant.id)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          ) : (
            <span className="w-4" />
          )}
        </button>
        <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="flex-1 truncate text-sm font-medium">{tenant.name ?? 'Unnamed'}</span>
      </div>

      {isExpanded && hasChildren && (
        <div className="ml-4 border-l border-border pl-2">
          {sites.map((site) => (
            <SiteNode
              key={site.id}
              site={site}
              tenantId={tenant.id}
              expanded={expanded}
              toggle={toggle}
              selectedSiteId={selectedSiteId}
              selectedFloorId={selectedFloorId}
              onSelectLocation={onSelectLocation}
              onCreateAudit={onCreateAudit}
              onViewSite={onViewSite}
              onViewFloor={onViewFloor}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface SiteNodeProps {
  site: Site
  tenantId: string
  expanded: Set<string>
  toggle: (id: string) => void
  selectedSiteId?: string
  selectedFloorId?: string
  onSelectLocation?: HierarchyTreeProps['onSelectLocation']
  onCreateAudit?: HierarchyTreeProps['onCreateAudit']
  onViewSite: (siteId: string) => void
  onViewFloor: (siteId: string, floorId: string) => void
}

function SiteNode({
  site,
  tenantId,
  expanded,
  toggle,
  selectedSiteId,
  selectedFloorId,
  onSelectLocation,
  onCreateAudit,
  onViewSite,
  onViewFloor,
}: SiteNodeProps) {
  const floors = safeArray(site?.floors)
  const isExpanded = expanded.has(site.id)
  const hasChildren = floors.length > 0
  const isSelected = selectedSiteId === site.id

  return (
    <div role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined}>
      <div
        className={cn(
          'group flex items-center gap-2 rounded-xl px-3 py-2 transition-colors',
          isSelected ? 'bg-primary/10' : 'hover:bg-muted/50'
        )}
      >
        <button
          type="button"
          onClick={() => hasChildren && toggle(site.id)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          ) : (
            <span className="w-4" />
          )}
        </button>
        <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="flex-1 truncate text-sm">{site.name ?? 'Unnamed'}</span>
        <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-7 w-7 rounded-full"
            onClick={() => onViewSite(site.id)}
            aria-label="View site"
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-7 w-7 rounded-full"
            onClick={() => {
              const firstFloor = floors[0]
              if (firstFloor) {
                onCreateAudit?.({
                  tenantId,
                  siteId: site.id,
                  floorId: firstFloor.id,
                })
              }
            }}
            aria-label="Create audit"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {isExpanded && hasChildren && (
        <div className="ml-4 border-l border-border pl-2">
          {floors.map((floor) => (
            <FloorNode
              key={floor.id}
              floor={floor}
              siteId={site.id}
              tenantId={tenantId}
              expanded={expanded}
              toggle={toggle}
              selectedSiteId={selectedSiteId}
              selectedFloorId={selectedFloorId}
              onSelectLocation={onSelectLocation}
              onCreateAudit={onCreateAudit}
              onViewFloor={onViewFloor}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface FloorNodeProps {
  floor: Floor
  siteId: string
  tenantId: string
  expanded: Set<string>
  toggle: (id: string) => void
  selectedSiteId?: string
  selectedFloorId?: string
  onSelectLocation?: HierarchyTreeProps['onSelectLocation']
  onCreateAudit?: HierarchyTreeProps['onCreateAudit']
  onViewFloor: (siteId: string, floorId: string) => void
}

function FloorNode({
  floor,
  siteId,
  tenantId,
  expanded,
  toggle,
  selectedSiteId,
  selectedFloorId,
  onSelectLocation,
  onCreateAudit,
  onViewFloor,
}: FloorNodeProps) {
  const zones = safeArray(floor?.zones)
  const isExpanded = expanded.has(floor.id)
  const hasChildren = zones.length > 0
  const isSelected = selectedSiteId === siteId && selectedFloorId === floor.id

  return (
    <div role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined}>
      <div
        className={cn(
          'group flex items-center gap-2 rounded-xl px-3 py-2 transition-colors',
          isSelected ? 'bg-primary/10' : 'hover:bg-muted/50'
        )}
      >
        <button
          type="button"
          onClick={() => hasChildren && toggle(floor.id)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          ) : (
            <span className="w-4" />
          )}
        </button>
        <Layers className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="flex-1 truncate text-sm">{floor.name ?? 'Unnamed'}</span>
        <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-7 w-7 rounded-full"
            onClick={() => onViewFloor(siteId, floor.id)}
            aria-label="View floor"
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-7 w-7 rounded-full"
            onClick={() =>
              onSelectLocation?.({
                tenantId,
                siteId,
                floorId: floor.id,
              })
            }
            aria-label="Select location"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {isExpanded && hasChildren && (
        <div className="ml-4 border-l border-border pl-2">
          {(zones as Zone[]).map((zone) => (
            <ZoneNode
              key={zone.id}
              zone={zone}
              floorId={floor.id}
              siteId={siteId}
              tenantId={tenantId}
              selectedSiteId={selectedSiteId}
              selectedFloorId={selectedFloorId}
              onSelectLocation={onSelectLocation}
              onCreateAudit={onCreateAudit}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface ZoneNodeProps {
  zone: Zone
  floorId: string
  siteId: string
  tenantId: string
  selectedSiteId?: string
  selectedFloorId?: string
  onSelectLocation?: HierarchyTreeProps['onSelectLocation']
  onCreateAudit?: HierarchyTreeProps['onCreateAudit']
}

function ZoneNode({
  zone,
  floorId,
  siteId,
  tenantId,
  selectedSiteId,
  selectedFloorId,
  onSelectLocation,
  onCreateAudit,
}: ZoneNodeProps) {
  const isSelected =
    selectedSiteId === siteId && selectedFloorId === floorId

  return (
    <div
      role="treeitem"
      className={cn(
        'group flex items-center gap-2 rounded-xl px-3 py-2 transition-colors',
        isSelected ? 'bg-primary/10' : 'hover:bg-muted/50'
      )}
    >
      <span className="w-8" />
      <Square className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <button
        type="button"
        className="flex-1 truncate text-left text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg px-1 -mx-1"
        onClick={() =>
          onSelectLocation?.({
            tenantId,
            siteId,
            floorId,
            zoneId: zone.id,
          })
        }
      >
        {zone.name ?? 'Unnamed'}
      </button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="h-7 w-7 shrink-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
        onClick={() =>
          onCreateAudit?.({
            tenantId,
            siteId,
            floorId,
            zoneId: zone.id,
          })
        }
        aria-label="Create audit"
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
