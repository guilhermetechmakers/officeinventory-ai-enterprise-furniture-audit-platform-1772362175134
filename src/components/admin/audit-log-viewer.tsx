import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronDown, ChevronUp, Filter } from 'lucide-react'
import type { AuditLogEntry, Tenant, User } from '@/types/admin'

const ACTION_TYPES = [
  { value: '', label: 'All actions' },
  { value: 'login', label: 'Login' },
  { value: 'role_change', label: 'Role change' },
  { value: 'user.invited', label: 'User invited' },
  { value: 'user.deactivated', label: 'User deactivated' },
  { value: 'user.activated', label: 'User activated' },
  { value: 'tenant', label: 'Tenant' },
  { value: 'sso', label: 'SSO' },
]

export interface AuditLogViewerProps {
  logs: AuditLogEntry[]
  tenants: Tenant[]
  users: User[]
  filters: {
    tenantId?: string
    userId?: string
    startDate?: string
    endDate?: string
    action?: string
  }
  onFiltersChange: (filters: AuditLogViewerProps['filters']) => void
  isLoading?: boolean
}

export function AuditLogViewer({
  logs,
  tenants,
  users,
  filters,
  onFiltersChange,
  isLoading = false,
}: AuditLogViewerProps) {
  const safeLogs = Array.isArray(logs) ? logs : []
  const safeTenants = Array.isArray(tenants) ? tenants : []
  const safeUsers = Array.isArray(users) ? users : []

  const [expandedId, setExpandedId] = React.useState<string | null>(null)
  const [showFilters, setShowFilters] = React.useState(false)

  const updateFilter = <K extends keyof typeof filters>(key: K, value: typeof filters[K]) => {
    onFiltersChange({ ...filters, [key]: value || undefined })
  }

  return (
    <Card className="rounded-2xl shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Audit Logs</CardTitle>
          <CardDescription>
            Login history, role changes, and notable access events
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-1.5"
        >
          <Filter className="h-4 w-4" />
          Filters
          {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {showFilters && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 p-4 rounded-xl bg-muted/30 border border-border animate-fade-in">
            <div className="space-y-2">
              <Label>Tenant</Label>
              <Select
                value={filters.tenantId ?? '__all__'}
                onValueChange={(v) => updateFilter('tenantId', v === '__all__' ? undefined : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All tenants" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All tenants</SelectItem>
                  {safeTenants.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>User</Label>
              <Select
                value={filters.userId ?? '__all__'}
                onValueChange={(v) => updateFilter('userId', v === '__all__' ? undefined : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All users</SelectItem>
                  {safeUsers.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name ?? u.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Action type</Label>
              <Select
                value={filters.action ?? ''}
                onValueChange={(v) => updateFilter('action', v || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  {ACTION_TYPES.map((a) => (
                    <SelectItem key={a.value || 'all'} value={a.value}>
                      {a.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>From date</Label>
              <Input
                type="date"
                value={filters.startDate ?? ''}
                onChange={(e) => updateFilter('startDate', e.target.value || undefined)}
              />
            </div>
            <div className="space-y-2">
              <Label>To date</Label>
              <Input
                type="date"
                value={filters.endDate ?? ''}
                onChange={(e) => updateFilter('endDate', e.target.value || undefined)}
              />
            </div>
          </div>
        )}

        <ScrollArea className="rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : safeLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No audit logs found
                  </TableCell>
                </TableRow>
              ) : (
                safeLogs.map((log) => (
                  <React.Fragment key={log.id}>
                    <TableRow
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                    >
                      <TableCell className="text-sm">
                        {log.timestamp ? new Date(log.timestamp).toLocaleString() : '-'}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{log.action}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {log.actorEmail ?? log.actorId}
                      </TableCell>
                      <TableCell>
                        {log.details
                          ? typeof log.details === 'object'
                            ? JSON.stringify(log.details).slice(0, 50) + (JSON.stringify(log.details).length > 50 ? '…' : '')
                            : String(log.details)
                          : '-'}
                      </TableCell>
                    </TableRow>
                    {expandedId === log.id && log.details && (
                      <TableRow>
                        <TableCell colSpan={4} className="bg-muted/20 p-4">
                          <pre className="text-xs overflow-auto max-h-32">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
