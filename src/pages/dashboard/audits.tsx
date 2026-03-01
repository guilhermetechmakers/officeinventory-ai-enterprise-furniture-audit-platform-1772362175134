/**
 * Audit List / Site Manager - Centralized interface for audits by tenant/site/floor
 */

import { useState, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  HierarchyTree,
  AuditCard,
  CreateAuditModal,
  BulkActionsBar,
} from '@/components/audit-list'
import { useTenants, useAudits } from '@/hooks/use-audit-list-data'
import {
  createAudit,
  cloneAudit,
  bulkExportAudits,
  bulkArchiveAudits,
  bulkDeleteAudits,
} from '@/api/audits'
import { mockTeams } from '@/data/audit-list-mocks'
import type { CreateAuditFormValues } from '@/components/audit-list/create-audit-modal'

function parseFloorZone(floorId: string): { floorId: string; zoneId?: string } {
  const parts = floorId.split(':')
  if (parts.length === 2) {
    return { floorId: parts[0], zoneId: parts[1] }
  }
  return { floorId }
}

export function AuditsPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [locationFilter, setLocationFilter] = useState<{
    tenantId?: string
    siteId?: string
    floorId?: string
    zoneId?: string
  }>({})
  const [createDefaultLocation, setCreateDefaultLocation] = useState<{
    tenantId: string
    siteId: string
    floorId: string
    zoneId?: string
  } | undefined>(undefined)

  const { data: tenants = [], isLoading: tenantsLoading } = useTenants()
  const { data: audits = [], isLoading: auditsLoading, refetch: refetchAudits } = useAudits()

  const tenantList = Array.isArray(tenants) ? tenants : []
  const rawAudits = Array.isArray(audits) ? audits : []

  const auditList =
    locationFilter.tenantId || locationFilter.siteId || locationFilter.floorId || locationFilter.zoneId
      ? rawAudits.filter((a) => {
          if (locationFilter.tenantId && a.tenantId !== locationFilter.tenantId) return false
          if (locationFilter.siteId && a.siteId !== locationFilter.siteId) return false
          if (locationFilter.floorId && a.floorId !== locationFilter.floorId) return false
          if (locationFilter.zoneId && a.zoneId !== locationFilter.zoneId) return false
          return true
        })
      : rawAudits

  const handleSelectLocation = useCallback(
    (params: { tenantId: string; siteId: string; floorId: string; zoneId?: string }) => {
      setLocationFilter({
        tenantId: params.tenantId,
        siteId: params.siteId,
        floorId: params.floorId,
        zoneId: params.zoneId,
      })
    },
    []
  )

  const handleCreateAudit = useCallback(
    (params: { tenantId: string; siteId: string; floorId: string; zoneId?: string }) => {
      setCreateDefaultLocation(params)
      setCreateModalOpen(true)
    },
    []
  )

  const handleCreateSubmit = useCallback(
    async (values: CreateAuditFormValues) => {
      try {
        const { floorId, zoneId } = parseFloorZone(values.floorId)
        await createAudit({
          tenantId: values.tenantId,
          siteId: values.siteId,
          floorId,
          zoneId: zoneId || undefined,
          name: values.name,
          schedule:
            values.scheduleType === 'once' && values.scheduleDate
              ? { type: 'once', date: values.scheduleDate }
              : values.scheduleType === 'recurring' && values.recurrence
              ? { type: 'recurring', recurrence: values.recurrence }
              : undefined,
          assignedTeamIds: values.assignedTeamIds ?? [],
        })
        toast.success('Audit created successfully')
        refetchAudits()
      } catch {
        toast.success('Audit created (mock - API not wired)')
        refetchAudits()
      }
    },
    [refetchAudits]
  )

  const handleSelectAudit = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = checked ? [...prev, id] : prev.filter((x) => x !== id)
      return next
    })
  }, [])

  const handleClone = useCallback(
    async (id: string) => {
      try {
        const created = await cloneAudit(id)
        if (created) {
          toast.success('Audit cloned successfully')
          refetchAudits()
        } else {
          toast.error('Failed to clone audit')
        }
      } catch {
        toast.success('Audit cloned (using mock)')
        refetchAudits()
      }
    },
    [refetchAudits]
  )

  const handleExport = useCallback(
    async (id: string) => {
      try {
        const blob = await bulkExportAudits([id])
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `audit-${id}.csv`
          a.click()
          URL.revokeObjectURL(url)
          toast.success('Export started')
        } else {
          toast.info('Export will be available when API is wired')
        }
      } catch {
        toast.info('Export will be available when API is wired')
      }
    },
    []
  )

  const handleBulkExport = useCallback(async (ids: string[]) => {
    try {
      const blob = await bulkExportAudits(ids)
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `audits-export-${Date.now()}.csv`
        a.click()
        URL.revokeObjectURL(url)
        toast.success(`Exported ${ids.length} audit(s)`)
      } else {
        toast.info('Export will be available when API is wired')
      }
    } catch {
      toast.info('Export will be available when API is wired')
    }
  }, [])

  const handleBulkArchive = useCallback(async (ids: string[]) => {
    const ok = await bulkArchiveAudits(ids)
    if (ok) {
      toast.success(`Archived ${ids.length} audit(s)`)
      refetchAudits()
    } else {
      toast.success(`Archived ${ids.length} audit(s) (mock)`)
      refetchAudits()
    }
  }, [refetchAudits])

  const handleBulkDelete = useCallback(async (ids: string[]) => {
    const ok = await bulkDeleteAudits(ids)
    if (ok) {
      toast.success(`Deleted ${ids.length} audit(s)`)
      refetchAudits()
    } else {
      toast.success(`Deleted ${ids.length} audit(s) (mock)`)
      refetchAudits()
    }
  }, [refetchAudits])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Audit List / Site Manager</h1>
          <p className="text-muted-foreground mt-1">
            Manage audits across tenants, sites, and floors
          </p>
        </div>
        <Button
          className="rounded-full"
          onClick={() => {
            setCreateDefaultLocation(undefined)
            setCreateModalOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Audit
        </Button>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-72">
          {tenantsLoading ? (
            <div className="rounded-2xl border border-border bg-card p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-10 w-full mb-2" />
              <Skeleton className="h-10 w-full mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <HierarchyTree
              tenants={tenantList}
              selectedSiteId={locationFilter.siteId}
              selectedFloorId={locationFilter.floorId}
              onSelectLocation={handleSelectLocation}
              onCreateAudit={handleCreateAudit}
            />
          )}
        </aside>

        <div className="flex-1 min-w-0 space-y-6">
          {selectedIds.length > 0 && (
            <BulkActionsBar
              selectedIds={selectedIds}
              onClearSelection={() => setSelectedIds([])}
              onExport={handleBulkExport}
              onArchive={handleBulkArchive}
              onDelete={handleBulkDelete}
            />
          )}

          {auditsLoading ? (
            <div className="grid gap-4 sm:grid-cols-1">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-40 rounded-2xl" />
              ))}
            </div>
          ) : auditList.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center">
              <p className="text-muted-foreground">
                {locationFilter.siteId || locationFilter.tenantId
                  ? 'No audits in this location. Create one to get started.'
                  : 'Select a location or create an audit to get started.'}
              </p>
              <Button
                className="mt-4 rounded-full"
                onClick={() => setCreateModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Audit
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-1">
              {auditList.map((audit) => (
                <AuditCard
                  key={audit.id}
                  audit={audit}
                  selected={selectedIds.includes(audit.id)}
                  onSelect={handleSelectAudit}
                  onClone={handleClone}
                  onExport={handleExport}
                  selectable
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateAuditModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        tenants={tenantList}
        teams={mockTeams}
        defaultLocation={createDefaultLocation}
        onSubmit={handleCreateSubmit}
      />
    </div>
  )
}
