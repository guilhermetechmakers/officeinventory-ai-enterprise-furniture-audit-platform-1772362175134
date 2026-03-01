import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ShieldPlus, Check } from 'lucide-react'
import { ValidationErrorTooltip } from './validation-error-tooltip'
import type { Role, Tenant } from '@/types/admin'

const createRoleSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  description: z.string().optional(),
  permissions: z.string().optional(),
  tenantId: z.string().optional(),
})

type CreateRoleFormValues = z.infer<typeof createRoleSchema>

const PERMISSION_OPTIONS = [
  'admin:*',
  'users:*',
  'tenants:*',
  'audits:read',
  'audits:write',
  'reports:read',
  'reports:write',
]

export interface RoleTemplatesPanelProps {
  roles: Role[]
  tenants: Tenant[]
  onCreateRole: (input: { name: string; description?: string; permissions: string[]; tenantId?: string }) => Promise<void>
  onAssignRole?: (userId: string, roleId: string) => void
  isPending?: boolean
}

export function RoleTemplatesPanel({
  roles,
  tenants,
  onCreateRole,
  isPending = false,
}: RoleTemplatesPanelProps) {
  const safeRoles = Array.isArray(roles) ? roles : []
  const safeTenants = Array.isArray(tenants) ? tenants : []
  const [open, setOpen] = React.useState(false)

  const form = useForm<CreateRoleFormValues>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: '',
      description: '',
      permissions: '',
      tenantId: safeTenants[0]?.id ?? '',
    },
  })

  const [selectedPermissions, setSelectedPermissions] = React.useState<string[]>([])

  const togglePermission = (perm: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    )
  }

  const handleSubmit = form.handleSubmit(async (values) => {
    const perms = selectedPermissions.length > 0 ? selectedPermissions : (values.permissions ? values.permissions.split(',').map((p) => p.trim()).filter(Boolean) : [])
    if (perms.length === 0) {
      form.setError('permissions', { message: 'At least one permission is required' })
      return
    }
    await onCreateRole({
      name: values.name,
      description: values.description || undefined,
      permissions: perms,
      tenantId: values.tenantId || undefined,
    })
    setOpen(false)
    form.reset({ name: '', description: '', permissions: '', tenantId: safeTenants[0]?.id ?? '' })
    setSelectedPermissions([])
  })

  return (
    <Card className="rounded-2xl shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Role Templates</CardTitle>
          <CardDescription>
            Predefined roles and custom roles scoped per tenant
          </CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <ShieldPlus className="h-4 w-4" />
              Create Custom Role
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl max-w-md">
            <DialogHeader>
              <DialogTitle>Create Custom Role</DialogTitle>
              <DialogDescription>
                Define a new role with specific permissions. Optionally scope to a tenant.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role-name">Name</Label>
                <ValidationErrorTooltip error={form.formState.errors.name?.message}>
                  <Input
                    id="role-name"
                    {...form.register('name')}
                    placeholder="e.g. Auditor"
                  />
                </ValidationErrorTooltip>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role-desc">Description (optional)</Label>
                <Input
                  id="role-desc"
                  {...form.register('description')}
                  placeholder="Brief description of this role"
                />
              </div>
              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="flex flex-wrap gap-2">
                  {PERMISSION_OPTIONS.map((perm) => (
                    <Badge
                      key={perm}
                      variant={selectedPermissions.includes(perm) ? 'default' : 'outline'}
                      className="cursor-pointer transition-all hover:scale-105"
                      onClick={() => togglePermission(perm)}
                    >
                      {selectedPermissions.includes(perm) && <Check className="h-3 w-3 mr-1" />}
                      {perm}
                    </Badge>
                  ))}
                </div>
                <ValidationErrorTooltip error={form.formState.errors.permissions?.message}>
                  <Input
                    {...form.register('permissions')}
                    placeholder="Or type comma-separated permissions"
                    className="mt-2"
                  />
                </ValidationErrorTooltip>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role-tenant">Tenant (optional)</Label>
                <Select
                  value={form.watch('tenantId') ?? '__all__'}
                  onValueChange={(v) => form.setValue('tenantId', v === '__all__' ? undefined : v)}
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
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Creating…' : 'Create Role'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(safeRoles ?? []).map((role) => (
            <div
              key={role.id}
              className="rounded-xl border border-border bg-card p-4 shadow-card transition-all hover:shadow-elevated hover:border-primary/30"
            >
              <div className="font-medium text-foreground">{role.name}</div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {role.description ?? 'No description'}
              </p>
              <div className="flex flex-wrap gap-1 mt-3">
                {(role.permissions ?? []).slice(0, 3).map((p) => (
                  <Badge key={p} variant="secondary" className="text-xs">
                    {p}
                  </Badge>
                ))}
                {(role.permissions ?? []).length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{(role.permissions ?? []).length - 3}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
