import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useUsers,
  useRoles,
  useTenants,
  useInviteUser,
  useInviteUsersBulk,
  useCreateRole,
  useActivateUser,
  useDeactivateUser,
  useAuditLogs,
} from '@/hooks/use-admin'
import { GenericDataTable } from './generic-data-table'
import { ConfirmDialog } from './confirm-dialog'
import { InviteForm } from './invite-form'
import { RoleTemplatesPanel } from './role-templates-panel'
import { AuditLogViewer } from './audit-log-viewer'
import { Users, UserCheck, UserX } from 'lucide-react'
import type { User } from '@/types/admin'

type InviteFormValues = {
  name: string
  email: string
  tenantId: string
  role: string
}

export function UserManagementPanel() {
  const [selectedTenantId, setSelectedTenantId] = React.useState<string | undefined>(undefined)
  const [search, setSearch] = React.useState('')
  const [auditFilters, setAuditFilters] = React.useState<{
    tenantId?: string
    userId?: string
    startDate?: string
    endDate?: string
    action?: string
  }>({})

  const { data: users = [], isLoading } = useUsers(selectedTenantId)
  const { data: roles = [] } = useRoles()
  const { data: tenants = [] } = useTenants()
  const { data: auditLogs = [], isLoading: auditLoading } = useAuditLogs(auditFilters)

  const inviteUser = useInviteUser()
  const inviteBulk = useInviteUsersBulk()
  const createRole = useCreateRole()
  const activateUser = useActivateUser()
  const deactivateUser = useDeactivateUser()

  const [confirmState, setConfirmState] = React.useState<{
    open: boolean
    action: 'activate' | 'deactivate'
    user: User | undefined
  }>({ open: false, action: 'activate', user: undefined })

  const safeUsers = Array.isArray(users) ? users : []
  const safeRoles = Array.isArray(roles) ? roles : []
  const safeTenants = Array.isArray(tenants) ? tenants : []

  const filteredUsers = React.useMemo(() => {
    if (!search.trim()) return safeUsers
    const q = search.toLowerCase()
    return safeUsers.filter(
      (u: User) =>
        u.email?.toLowerCase().includes(q) ||
        u.name?.toLowerCase().includes(q) ||
        (u.roles ?? []).some((r: string) => r.toLowerCase().includes(q))
    )
  }, [safeUsers, search])

  const activeCount = safeUsers.filter((u: User) => u.isActive).length
  const inactiveCount = safeUsers.filter((u: User) => !u.isActive).length

  const handleSingleInvite = async (values: InviteFormValues) => {
    await inviteUser.mutateAsync({
      name: values.name,
      email: values.email,
      role: values.role,
      tenantId: values.tenantId,
    })
  }

  const handleBulkInvite = async (
    invites: Array<{ name: string; email: string; tenantId: string; role: string }>
  ) => {
    await inviteBulk.mutateAsync({ invites })
  }

  const handleCreateRole = async (input: {
    name: string
    description?: string
    permissions: string[]
    tenantId?: string
  }) => {
    await createRole.mutateAsync(input)
  }

  const handleConfirm = async () => {
    const { user, action } = confirmState
    if (!user) return
    if (action === 'activate') await activateUser.mutateAsync(user.id)
    else await deactivateUser.mutateAsync(user.id)
    setConfirmState({ open: false, action: 'activate', user: undefined })
  }

  const columns = [
    {
      id: 'name',
      header: 'Name',
      cell: (row: User) => row.name ?? row.email?.split('@')[0] ?? '-',
    },
    { id: 'email', header: 'Email', accessorKey: 'email' as keyof User },
    {
      id: 'role',
      header: 'Role',
      cell: (row: User) => (row.roles ?? []).join(', ') || '-',
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row: User) => (
        <span
          className={
            row.isActive
              ? 'text-green-600 dark:text-green-400 font-medium'
              : 'text-muted-foreground'
          }
        >
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      id: 'lastActive',
      header: 'Last Active',
      cell: (row: User) =>
        row.lastActive ? new Date(row.lastActive).toLocaleDateString() : '-',
    },
    {
      id: 'tenant',
      header: 'Tenant',
      cell: (row: User) => {
        const t = safeTenants.find((f: { id: string }) => f.id === row.tenantId)
        return t?.name ?? row.tenantId ?? '-'
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (row: User) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setConfirmState({
              open: true,
              action: row.isActive ? 'deactivate' : 'activate',
              user: row,
            })
          }
          aria-label={row.isActive ? 'Deactivate user' : 'Activate user'}
        >
          {row.isActive ? (
            <>
              <UserX className="h-4 w-4 mr-1" />
              Deactivate
            </>
          ) : (
            <>
              <UserCheck className="h-4 w-4 mr-1" />
              Activate
            </>
          )}
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">User Management</h2>
        <p className="text-muted-foreground mt-1">
          Invite users, assign roles, manage access, and view audit logs
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="rounded-2xl shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeUsers.length}</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active
            </CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inactive
            </CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Invite form */}
      <InviteForm
        tenants={safeTenants}
        roles={safeRoles}
        onSingleInvite={handleSingleInvite}
        onBulkInvite={handleBulkInvite}
        isSinglePending={inviteUser.isPending}
        isBulkPending={inviteBulk.isPending}
      />

      {/* Role templates */}
      <RoleTemplatesPanel
        roles={safeRoles}
        tenants={safeTenants}
        onCreateRole={handleCreateRole}
        isPending={createRole.isPending}
      />

      {/* Users table */}
      <Card className="rounded-2xl shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage users and their roles</CardDescription>
          </div>
          <div className="w-[200px]">
            <Select
              value={selectedTenantId ?? '__all__'}
              onValueChange={(v) => setSelectedTenantId(v === '__all__' ? undefined : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All tenants" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All tenants</SelectItem>
                {safeTenants.map((t: { id: string; name: string }) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <GenericDataTable
            data={filteredUsers}
            columns={columns}
            searchPlaceholder="Search by name, email or role…"
            searchValue={search}
            onSearchChange={setSearch}
            isLoading={isLoading}
            emptyMessage="No users found"
          />
        </CardContent>
      </Card>

      {/* Audit logs */}
      <AuditLogViewer
        logs={auditLogs}
        tenants={safeTenants}
        users={safeUsers}
        filters={auditFilters}
        onFiltersChange={setAuditFilters}
        isLoading={auditLoading}
      />

      <ConfirmDialog
        open={confirmState.open}
        onOpenChange={(open) => setConfirmState((s) => ({ ...s, open }))}
        title={
          confirmState.action === 'activate'
            ? 'Activate user?'
            : 'Deactivate user?'
        }
        description={
          confirmState.user &&
          (confirmState.action === 'activate'
            ? `${confirmState.user.email} will be able to sign in.`
            : `${confirmState.user.email} will no longer be able to sign in.`)
        }
        confirmLabel={confirmState.action === 'activate' ? 'Activate' : 'Deactivate'}
        variant={confirmState.action === 'deactivate' ? 'destructive' : 'default'}
        onConfirm={handleConfirm}
      />
    </div>
  )
}
