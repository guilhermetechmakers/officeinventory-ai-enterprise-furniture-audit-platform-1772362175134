import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuditLogs } from '@/hooks/use-admin'
import { GenericDataTable } from './generic-data-table'
import type { AuditLogEntry } from '@/types/admin'

export function AuditLogPanel() {
  const { data: logs = [], isLoading } = useAuditLogs()
  const [search, setSearch] = React.useState('')

  const safeLogs = Array.isArray(logs) ? logs : []
  const filteredLogs = React.useMemo(() => {
    if (!search.trim()) return safeLogs
    const q = search.toLowerCase()
    return safeLogs.filter(
      (l) =>
        l.action?.toLowerCase().includes(q) ||
        l.actorEmail?.toLowerCase().includes(q)
    )
  }, [safeLogs, search])

  const columns = [
    { id: 'action', header: 'Action', accessorKey: 'action' as keyof AuditLogEntry },
    {
      id: 'actor',
      header: 'Actor',
      cell: (row: AuditLogEntry) => row.actorEmail ?? row.actorId,
    },
    {
      id: 'timestamp',
      header: 'Timestamp',
      cell: (row: AuditLogEntry) =>
        row.timestamp ? new Date(row.timestamp).toLocaleString() : '-',
    },
    {
      id: 'details',
      header: 'Details',
      cell: (row: AuditLogEntry) =>
        row.details
          ? JSON.stringify(row.details).slice(0, 60) + (JSON.stringify(row.details).length > 60 ? '…' : '')
          : '-',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Audit Log</h2>
        <p className="text-muted-foreground mt-1">
          Review admin actions and changes
        </p>
      </div>

      <Card className="rounded-2xl shadow-card">
        <CardHeader>
          <CardTitle>Admin Actions</CardTitle>
          <CardDescription>
            Tenant creation, SSO config, user invites, role changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GenericDataTable
            data={filteredLogs}
            columns={columns}
            searchPlaceholder="Search by action or actor…"
            searchValue={search}
            onSearchChange={setSearch}
            isLoading={isLoading}
            emptyMessage="No audit logs"
          />
        </CardContent>
      </Card>
    </div>
  )
}
