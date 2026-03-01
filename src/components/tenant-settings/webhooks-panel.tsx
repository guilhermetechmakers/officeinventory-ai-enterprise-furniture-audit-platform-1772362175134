import * as React from 'react'
import { Plus, Trash2, Play, Pencil } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useTenantSettings, useCreateWebhook, useUpdateWebhook, useDeleteWebhook, useTestWebhook } from '@/hooks/use-tenant-settings'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { EmptyState } from './empty-state'
import { LoadingState } from './loading-state'
import { ErrorState } from './error-state'
import { StatusBadge } from './status-badge'
import { TestEndpointModal } from './test-endpoint-modal'
import { InlineValidation } from './inline-validation'
import type { Webhook, CreateWebhookInput, RetryPolicy } from '@/types/tenant-settings'
import { cn } from '@/lib/utils'

const URL_REGEX = /^https?:\/\/.{3,}/

function isValidUrl(url: string): boolean {
  if (!url?.trim()) return false
  try {
    new URL(url.trim())
    return URL_REGEX.test(url.trim())
  } catch {
    return false
  }
}

const AUTH_TYPES = [
  { value: 'none', label: 'None' },
  { value: 'bearer', label: 'Bearer token' },
  { value: 'header', label: 'Custom header' },
  { value: 'hmac', label: 'HMAC signing' },
] as const

const DEFAULT_RETRY: RetryPolicy = { maxAttempts: 3, backoffMs: 1000, timeoutMs: 10000 }

export function WebhooksPanel() {
  const { data: settings, isLoading, error, refetch } = useTenantSettings()
  const createWebhook = useCreateWebhook()
  const updateWebhook = useUpdateWebhook()
  const deleteWebhook = useDeleteWebhook()
  const testWebhook = useTestWebhook()

  const webhooks = (settings?.webhooks ?? []) as Webhook[]
  const safeWebhooks = Array.isArray(webhooks) ? webhooks : []

  const [editOpen, setEditOpen] = React.useState(false)
  const [editingWebhook, setEditingWebhook] = React.useState<Webhook | null>(null)
  const [deleteConfirm, setDeleteConfirm] = React.useState<Webhook | null>(null)
  const [testModal, setTestModal] = React.useState<Webhook | null>(null)
  const [testResult, setTestResult] = React.useState<{ success: boolean; statusCode?: number; message?: string; durationMs?: number } | null>(null)

  const [formName, setFormName] = React.useState('')
  const [formUrl, setFormUrl] = React.useState('')
  const [formMethod, setFormMethod] = React.useState<'POST' | 'PUT'>('POST')
  const [formAuthType, setFormAuthType] = React.useState<CreateWebhookInput['authType']>('none')
  const [formEnabled, setFormEnabled] = React.useState(true)
  const [formSecret, setFormSecret] = React.useState('')
  const [formRetryPolicy, setFormRetryPolicy] = React.useState<RetryPolicy>(DEFAULT_RETRY)

  const resetForm = () => {
    setFormName('')
    setFormUrl('')
    setFormMethod('POST')
    setFormAuthType('none')
    setFormEnabled(true)
    setFormSecret('')
    setFormRetryPolicy(DEFAULT_RETRY)
    setEditingWebhook(null)
  }

  const openCreate = () => {
    resetForm()
    setEditOpen(true)
  }

  const openEdit = (wh: Webhook) => {
    setEditingWebhook(wh)
    setFormName(wh.name)
    setFormUrl(wh.url)
    setFormMethod(wh.method)
    setFormAuthType(wh.authType)
    setFormEnabled(wh.enabled)
    setFormSecret('')
    setFormRetryPolicy(wh.retryPolicyJson ?? DEFAULT_RETRY)
    setEditOpen(true)
  }

  const handleSave = () => {
    const payload: CreateWebhookInput = {
      name: formName.trim(),
      url: formUrl.trim(),
      method: formMethod,
      authType: formAuthType,
      enabled: formEnabled,
      retryPolicy: formRetryPolicy,
    }
    if (formAuthType !== 'none' && formSecret.trim()) {
      payload.secret = formSecret.trim()
    }
    if (editingWebhook) {
      updateWebhook.mutate(
        { ...payload, webhookId: editingWebhook.webhookId },
        { onSuccess: () => { setEditOpen(false); resetForm(); } }
      )
    } else {
      createWebhook.mutate(payload, { onSuccess: () => { setEditOpen(false); resetForm(); } })
    }
  }

  const handleDelete = (wh: Webhook) => {
    deleteWebhook.mutate(wh.webhookId, {
      onSuccess: () => setDeleteConfirm(null),
    })
  }

  const handleTest = (wh: Webhook) => {
    setTestModal(wh)
    setTestResult(null)
  }

  const runTest = () => {
    if (!testModal) return
    testWebhook.mutate(testModal.webhookId, {
      onSuccess: (res) => {
        setTestResult(res)
      },
    })
  }

  const urlValidation = formUrl.trim() ? (isValidUrl(formUrl) ? null : 'Enter a valid URL (e.g. https://api.example.com/webhooks)') : 'URL is required'
  const isValid = formName.trim().length > 0 && formUrl.trim().length > 0 && isValidUrl(formUrl)

  if (isLoading) return <LoadingState lines={5} />
  if (error) return <ErrorState message={String(error)} onRetry={() => refetch()} />

  return (
    <Card className="rounded-2xl shadow-card">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Webhooks & Integrations</CardTitle>
            <CardDescription>
              Manage endpoint URLs, authentication, and retry policies for event notifications
            </CardDescription>
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add webhook
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {safeWebhooks.length === 0 ? (
          <EmptyState
            icon={Plus}
            title="No webhooks configured"
            description="Add a webhook endpoint to receive audit events and notifications."
            action={<Button onClick={openCreate}>Add webhook</Button>}
          />
        ) : (
          <div className="space-y-3">
            {safeWebhooks.map((wh) => (
              <div
                key={wh.webhookId}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border p-4 transition-all hover:shadow-md"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{wh.name}</span>
                    <StatusBadge
                      status={
                        wh.lastTestStatus === 'success'
                          ? 'success'
                          : wh.lastTestStatus === 'failure'
                            ? 'failure'
                            : 'pending'
                      }
                      label={
                        wh.lastTestStatus === 'success'
                          ? 'OK'
                          : wh.lastTestStatus === 'failure'
                            ? 'Failed'
                            : 'Not tested'
                      }
                    />
                    {!wh.enabled && (
                      <span className="text-xs text-muted-foreground">(disabled)</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-0.5">{wh.url}</p>
                  {wh.lastTestAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Last test: {new Date(wh.lastTestAt).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleTest(wh)}>
                    <Play className="h-4 w-4 mr-1" />
                    Test
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openEdit(wh)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleteConfirm(wh)}
                    aria-label={`Delete ${wh.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <ConfirmDialog
          open={!!deleteConfirm}
          onOpenChange={(o) => !o && setDeleteConfirm(null)}
          title="Delete webhook"
          description={`Are you sure you want to delete "${deleteConfirm?.name}"? This cannot be undone.`}
          confirmLabel="Delete"
          variant="destructive"
          onConfirm={() => { if (deleteConfirm) handleDelete(deleteConfirm) }}
          loading={deleteWebhook.isPending}
        />

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingWebhook ? 'Edit webhook' : 'Add webhook'}</DialogTitle>
              <DialogDescription>
                Configure the endpoint URL, method, and authentication.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-name">Name</Label>
                <Input
                  id="webhook-name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Audit Events"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhook-url">URL</Label>
                <Input
                  id="webhook-url"
                  type="url"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://api.example.com/webhooks"
                  className={cn(!isValidUrl(formUrl) && formUrl.trim() && 'border-destructive focus-visible:ring-destructive')}
                />
                <InlineValidation message={urlValidation} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Method</Label>
                  <Select value={formMethod} onValueChange={(v) => setFormMethod(v as 'POST' | 'PUT')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Auth type</Label>
                  <Select value={formAuthType} onValueChange={(v) => { setFormAuthType(v as CreateWebhookInput['authType']); setFormSecret(''); }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AUTH_TYPES.map((a) => (
                        <SelectItem key={a.value} value={a.value}>
                          {a.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {(formAuthType === 'bearer' || formAuthType === 'header' || formAuthType === 'hmac') && (
                <div className="space-y-2">
                  <Label htmlFor="webhook-secret">
                    {formAuthType === 'bearer' ? 'Bearer token' : formAuthType === 'hmac' ? 'Signing secret' : 'Auth header value'}
                  </Label>
                  <Input
                    id="webhook-secret"
                    type="password"
                    value={formSecret}
                    onChange={(e) => setFormSecret(e.target.value)}
                    placeholder={editingWebhook?.secretMasked ? '•••••••• (leave blank to keep current)' : 'Enter secret'}
                    autoComplete="off"
                    aria-label="Authentication secret (masked)"
                  />
                </div>
              )}
              <div className="rounded-xl border border-border p-4 space-y-3">
                <p className="font-medium">Retry policy</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="retry-max" className="text-xs">Max attempts</Label>
                    <Input
                      id="retry-max"
                      type="number"
                      min={1}
                      max={10}
                      value={formRetryPolicy.maxAttempts}
                      onChange={(e) => setFormRetryPolicy((p) => ({ ...p, maxAttempts: Math.max(1, parseInt(e.target.value, 10) || 1) }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="retry-backoff" className="text-xs">Backoff (ms)</Label>
                    <Input
                      id="retry-backoff"
                      type="number"
                      min={100}
                      value={formRetryPolicy.backoffMs}
                      onChange={(e) => setFormRetryPolicy((p) => ({ ...p, backoffMs: Math.max(100, parseInt(e.target.value, 10) || 1000) }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="retry-timeout" className="text-xs">Timeout (ms)</Label>
                    <Input
                      id="retry-timeout"
                      type="number"
                      min={1000}
                      value={formRetryPolicy.timeoutMs}
                      onChange={(e) => setFormRetryPolicy((p) => ({ ...p, timeoutMs: Math.max(1000, parseInt(e.target.value, 10) || 10000) }))}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border p-4">
                <div>
                  <p className="font-medium">Enabled</p>
                  <p className="text-sm text-muted-foreground">Receive events when enabled</p>
                </div>
                <Switch checked={formEnabled} onCheckedChange={setFormEnabled} aria-label="Enabled" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!isValid || (createWebhook.isPending || updateWebhook.isPending)}>
                {editingWebhook ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <TestEndpointModal
          open={!!testModal}
          onOpenChange={(o) => !o && setTestModal(null)}
          webhookName={testModal?.name ?? ''}
          result={testResult}
          isLoading={testWebhook.isPending}
          onTest={runTest}
        />
      </CardContent>
    </Card>
  )
}
