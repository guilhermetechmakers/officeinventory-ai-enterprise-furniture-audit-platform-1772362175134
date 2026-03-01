import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTenantSettings, usePatchStoragePolicies } from '@/hooks/use-tenant-settings'
import { LoadingState } from './loading-state'
import { ErrorState } from './error-state'
import type { LifecycleTier } from '@/types/tenant-settings'

const ASSET_TYPES = [
  { value: 'images', label: 'Images' },
  { value: 'reports', label: 'Reports' },
  { value: 'logs', label: 'Logs' },
] as const

export function StorageLifecyclePanel() {
  const { data: settings, isLoading, error, refetch } = useTenantSettings()
  const patchPolicies = usePatchStoragePolicies()

  const policies = (settings?.storagePolicies?.policies ?? []) as LifecycleTier[]
  const [localPolicies, setLocalPolicies] = React.useState<LifecycleTier[]>([])

  React.useEffect(() => {
    const p = Array.isArray(policies) ? policies : []
    if (p.length > 0) setLocalPolicies([...p])
  }, [settings?.storagePolicies?.updatedAt, settings?.storagePolicies?.policies?.length])

  const displayPolicies = localPolicies.length > 0 ? localPolicies : policies

  const updatePolicy = (id: string, updates: Partial<LifecycleTier>) => {
    setLocalPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    )
  }

  const addPolicy = () => {
    const type = ASSET_TYPES.find((t) => !displayPolicies.some((p) => p.type === t.value))?.value ?? 'images'
    setLocalPolicies((prev) => [
      ...prev,
      {
        id: `p${Date.now()}`,
        type,
        retentionDays: 90,
        archiveAfterDays: 30,
        purgeAfterDays: 365,
      },
    ])
  }

  const removePolicy = (id: string) => {
    setLocalPolicies((prev) => prev.filter((p) => p.id !== id))
  }

  const handleSave = () => {
    patchPolicies.mutate({
      policies: displayPolicies.length > 0 ? displayPolicies : policies,
    })
  }

  const hasChanges = JSON.stringify(displayPolicies) !== JSON.stringify(policies)

  if (isLoading) return <LoadingState lines={5} />
  if (error) return <ErrorState message={String(error)} onRetry={() => refetch()} />

  return (
    <Card className="rounded-2xl shadow-card">
      <CardHeader>
        <CardTitle>Storage & Retention</CardTitle>
        <CardDescription>
          Lifecycle policies for uploaded images and audit artifacts (retention, archiving, purge)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {(displayPolicies ?? []).map((policy) => (
            <div
              key={policy.id}
              className="rounded-xl border border-border p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium capitalize">{policy.type}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removePolicy(policy.id)}
                  aria-label={`Remove ${policy.type} policy`}
                >
                  Remove
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Retention (days)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={policy.retentionDays}
                    onChange={(e) =>
                      updatePolicy(policy.id, { retentionDays: parseInt(e.target.value, 10) || 0 })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Archive after (days)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={policy.archiveAfterDays}
                    onChange={(e) =>
                      updatePolicy(policy.id, { archiveAfterDays: parseInt(e.target.value, 10) || 0 })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Purge after (days)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={policy.purgeAfterDays}
                    onChange={(e) =>
                      updatePolicy(policy.id, { purgeAfterDays: parseInt(e.target.value, 10) || 0 })
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {ASSET_TYPES.some((t) => !displayPolicies.some((p) => p.type === t.value)) && (
          <Button variant="outline" size="sm" onClick={addPolicy}>
            Add policy
          </Button>
        )}

        {hasChanges && (
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={patchPolicies.isPending}>
              Save changes
            </Button>
          </div>
        )}

        {settings?.storagePolicies?.updatedAt && (
          <p className="text-xs text-muted-foreground">
            Last updated: {new Date(settings.storagePolicies.updatedAt).toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
