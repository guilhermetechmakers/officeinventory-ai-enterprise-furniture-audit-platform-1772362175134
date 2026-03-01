import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTenants, useCreateTenant, useUpdateTenant } from '@/hooks/use-admin'
import { ValidationErrorTooltip } from './validation-error-tooltip'
import { GenericDataTable } from './generic-data-table'
import type { Tenant, CreateTenantInput } from '@/types/admin'

const tenantSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  domain: z.string().min(1, 'Domain is required').regex(/^[a-z0-9.-]+\.[a-z]{2,}$/i, 'Invalid domain format'),
  defaultLocale: z.string().optional(),
  maxSites: z.coerce.number().min(0).optional(),
  maxUsers: z.coerce.number().min(0).optional(),
  storageGB: z.coerce.number().min(0).optional(),
})

type TenantFormValues = z.infer<typeof tenantSchema>

export function TenantSettingsPanel() {
  const { data: tenants = [], isLoading } = useTenants()
  const createTenant = useCreateTenant()
  const updateTenant = useUpdateTenant()
  const [editingId, setEditingId] = React.useState<string | null>(null)

  const safeTenants = Array.isArray(tenants) ? tenants : []

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      name: '',
      domain: '',
      defaultLocale: 'en-US',
      maxSites: 10,
      maxUsers: 50,
      storageGB: 100,
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    const input: CreateTenantInput = {
      name: values.name,
      domain: values.domain,
      settings: {
        defaultLocale: values.defaultLocale,
        quotas: {
          maxSites: values.maxSites,
          maxUsers: values.maxUsers,
          storageGB: values.storageGB,
        },
      },
    }
    if (editingId) {
      await updateTenant.mutateAsync({ id: editingId, input: { ...input, id: editingId } })
      setEditingId(null)
    } else {
      await createTenant.mutateAsync(input)
    }
    form.reset()
  })

  const startEdit = (t: Tenant) => {
    setEditingId(t.id)
    form.reset({
      name: t.name,
      domain: t.domain,
      defaultLocale: t.settings?.defaultLocale ?? 'en-US',
      maxSites: t.settings?.quotas?.maxSites ?? 10,
      maxUsers: t.settings?.quotas?.maxUsers ?? 50,
      storageGB: t.settings?.quotas?.storageGB ?? 100,
    })
  }

  const columns = [
    { id: 'name', header: 'Name', accessorKey: 'name' as keyof Tenant },
    { id: 'domain', header: 'Domain', accessorKey: 'domain' as keyof Tenant },
    {
      id: 'created',
      header: 'Created',
      cell: (row: Tenant) =>
        row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (row: Tenant) => (
        <Button variant="outline" size="sm" onClick={() => startEdit(row)}>
          Edit
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Tenant Settings</h2>
        <p className="text-muted-foreground mt-1">
          Create and manage tenants, sites, and quotas
        </p>
      </div>

      <Card className="rounded-2xl shadow-card">
        <CardHeader>
          <CardTitle>{editingId ? 'Update Tenant' : 'Create Tenant'}</CardTitle>
          <CardDescription>
            Configure tenant name, domain, and resource quotas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <ValidationErrorTooltip error={form.formState.errors.name?.message}>
                <Input
                  id="name"
                  {...form.register('name')}
                  placeholder="Acme Corp"
                />
              </ValidationErrorTooltip>
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain">Domain</Label>
              <ValidationErrorTooltip error={form.formState.errors.domain?.message}>
                <Input
                  id="domain"
                  {...form.register('domain')}
                  placeholder="acme.example.com"
                />
              </ValidationErrorTooltip>
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultLocale">Default Locale</Label>
              <Input
                id="defaultLocale"
                {...form.register('defaultLocale')}
                placeholder="en-US"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxSites">Max Sites</Label>
              <Input
                id="maxSites"
                type="number"
                {...form.register('maxSites')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxUsers">Max Users</Label>
              <Input
                id="maxUsers"
                type="number"
                {...form.register('maxUsers')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storageGB">Storage (GB)</Label>
              <Input
                id="storageGB"
                type="number"
                {...form.register('storageGB')}
              />
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <Button
                type="submit"
                disabled={createTenant.isPending || updateTenant.isPending}
              >
                {editingId ? 'Update' : 'Create'} Tenant
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null)
                    form.reset()
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-card">
        <CardHeader>
          <CardTitle>Tenants</CardTitle>
          <CardDescription>Existing tenants and their configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <GenericDataTable
            data={safeTenants}
            columns={columns}
            isLoading={isLoading}
            emptyMessage="No tenants yet. Create one above."
          />
        </CardContent>
      </Card>
    </div>
  )
}
