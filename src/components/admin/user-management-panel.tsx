import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { useUsers, useRoles, useTenants, useInviteUser, useActivateUser, useDeactivateUser } from '@/hooks/use-admin'
import { ValidationErrorTooltip } from './validation-error-tooltip'
import { GenericDataTable } from './generic-data-table'
import { ConfirmDialog } from './confirm-dialog'
import type { User } from '@/types/admin'

const inviteSchema = z.object({
  email: z.string().email('Valid email required'),
  role: z.string().min(1, 'Role is required'),
  tenantId: z.string().min(1, 'Tenant is required'),
})

type InviteFormValues = z.infer<typeof inviteSchema>

export function UserManagementPanel() {
  const { data: users = [], isLoading } = useUsers()
  const { data: roles = [] } = useRoles()
  const { data: tenants = [] } = useTenants()
  const inviteUser = useInviteUser()
  const activateUser = useActivateUser()
  const deactivateUser = useDeactivateUser()

  const [search, setSearch] = React.useState('')
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
      (u) =>
        u.email?.toLowerCase().includes(q) ||
        (u.roles ?? []).some((r) => r.toLowerCase().includes(q))
    )
  }, [safeUsers, search])

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
      role: safeRoles[0]?.name ?? '',
      tenantId: safeTenants[0]?.id ?? '',
    },
  })

  React.useEffect(() => {
    if (safeTenants.length > 0 && !form.getValues('tenantId')) {
      form.setValue('tenantId', safeTenants[0].id)
    }
    if (safeRoles.length > 0 && !form.getValues('role')) {
      form.setValue('role', safeRoles[0].name)
    }
  }, [safeTenants, safeRoles, form])

  const onSubmit = form.handleSubmit(async (values) => {
    await inviteUser.mutateAsync({
      email: values.email,
      role: values.role,
      tenantId: values.tenantId,
    })
    form.reset({ email: '', role: form.getValues('role'), tenantId: form.getValues('tenantId') })
  })

  const handleConfirm = async () => {
    const { user, action } = confirmState
    if (!user) return
    if (action === 'activate') await activateUser.mutateAsync(user.id)
    else await deactivateUser.mutateAsync(user.id)
    setConfirmState({ open: false, action: 'activate', user: undefined })
  }

  const columns = [
    { id: 'email', header: 'Email', accessorKey: 'email' as keyof User },
    {
      id: 'roles',
      header: 'Roles',
      cell: (row: User) => (row.roles ?? []).join(', ') || '-',
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row: User) => (
        <span
          className={
            row.isActive
              ? 'text-green-600 dark:text-green-400'
              : 'text-muted-foreground'
          }
        >
          {row.isActive ? 'Active' : 'Pending'}
        </span>
      ),
    },
    {
      id: 'invitedAt',
      header: 'Invited',
      cell: (row: User) =>
        row.invitedAt ? new Date(row.invitedAt).toLocaleDateString() : '-',
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
        >
          {row.isActive ? 'Deactivate' : 'Activate'}
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Users & Roles</h2>
        <p className="text-muted-foreground mt-1">
          Invite users, assign roles, and manage access
        </p>
      </div>

      <Card className="rounded-2xl shadow-card">
        <CardHeader>
          <CardTitle>Invite User</CardTitle>
          <CardDescription>
            Send an invitation to join the organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px] space-y-2">
              <Label htmlFor="email">Email</Label>
              <ValidationErrorTooltip error={form.formState.errors.email?.message}>
                <Input
                  id="email"
                  type="email"
                  {...form.register('email')}
                  placeholder="user@example.com"
                />
              </ValidationErrorTooltip>
            </div>
            <div className="w-[180px] space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={form.watch('role')}
                onValueChange={(v) => form.setValue('role', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {safeRoles.map((r) => (
                    <SelectItem key={r.id} value={r.name}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-[180px] space-y-2">
              <Label htmlFor="tenantId">Tenant</Label>
              <Select
                value={form.watch('tenantId')}
                onValueChange={(v) => form.setValue('tenantId', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tenant" />
                </SelectTrigger>
                <SelectContent>
                  {safeTenants.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={inviteUser.isPending}>
              Invite
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-card">
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage users and their roles</CardDescription>
        </CardHeader>
        <CardContent>
          <GenericDataTable
            data={filteredUsers}
            columns={columns}
            searchPlaceholder="Search by email or role…"
            searchValue={search}
            onSearchChange={setSearch}
            isLoading={isLoading}
            emptyMessage="No users found"
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmState.open}
        onOpenChange={(open) =>
          setConfirmState((s) => ({ ...s, open }))
        }
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
