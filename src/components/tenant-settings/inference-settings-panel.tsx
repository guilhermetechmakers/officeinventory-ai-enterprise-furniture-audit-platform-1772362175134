import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useTenantSettings, usePatchInferenceSettings } from '@/hooks/use-tenant-settings'
import { LoadingState } from './loading-state'
import { ErrorState } from './error-state'

export function InferenceSettingsPanel() {
  const { data: settings, isLoading, error, refetch } = useTenantSettings()
  const patchInference = usePatchInferenceSettings()

  const inference = settings?.inferenceSettings
  const [threshold, setThreshold] = React.useState(inference?.threshold ?? 0.85)
  const [autoAccept, setAutoAccept] = React.useState(inference?.autoAccept ?? true)
  const [maxAutoAcceptPerBatch, setMaxAutoAcceptPerBatch] = React.useState(
    inference?.maxAutoAcceptPerBatch ?? 50
  )
  const [queueLowConfidence, setQueueLowConfidence] = React.useState(
    inference?.queueLowConfidence ?? true
  )

  React.useEffect(() => {
    if (inference) {
      setThreshold(inference.threshold ?? 0.85)
      setAutoAccept(inference.autoAccept ?? true)
      setMaxAutoAcceptPerBatch(inference.maxAutoAcceptPerBatch ?? 50)
      setQueueLowConfidence(inference.queueLowConfidence ?? true)
    }
  }, [inference?.updatedAt, inference?.threshold, inference?.autoAccept, inference?.maxAutoAcceptPerBatch, inference?.queueLowConfidence])

  const handleSave = () => {
    patchInference.mutate({
      threshold: Math.max(0, Math.min(1, threshold)),
      autoAccept,
      maxAutoAcceptPerBatch: Math.max(1, Math.min(500, maxAutoAcceptPerBatch)),
      queueLowConfidence,
    })
  }

  const hasChanges =
    threshold !== (inference?.threshold ?? 0.85) ||
    autoAccept !== (inference?.autoAccept ?? true) ||
    maxAutoAcceptPerBatch !== (inference?.maxAutoAcceptPerBatch ?? 50) ||
    queueLowConfidence !== (inference?.queueLowConfidence ?? true)

  if (isLoading) return <LoadingState lines={5} />
  if (error) return <ErrorState message={String(error)} onRetry={() => refetch()} />

  return (
    <Card className="rounded-2xl shadow-card">
      <CardHeader>
        <CardTitle>Inference Thresholds</CardTitle>
        <CardDescription>
          Global confidence thresholds, auto-accept rules, and human-review queuing logic
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="threshold">Confidence threshold (0–1)</Label>
            <Input
              id="threshold"
              type="number"
              min={0}
              max={1}
              step={0.05}
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value) || 0)}
              className="max-w-[140px]"
            />
            <p className="text-xs text-muted-foreground">
              Items below this threshold require human review
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxBatch">Max auto-accept per batch</Label>
            <Input
              id="maxBatch"
              type="number"
              min={1}
              max={500}
              value={maxAutoAcceptPerBatch}
              onChange={(e) => setMaxAutoAcceptPerBatch(parseInt(e.target.value, 10) || 1)}
              className="max-w-[140px]"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div>
              <p className="font-medium">Auto-accept deterministic rules</p>
              <p className="text-sm text-muted-foreground">
                Automatically accept items above threshold
              </p>
            </div>
            <Switch checked={autoAccept} onCheckedChange={setAutoAccept} aria-label="Auto-accept" />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div>
              <p className="font-medium">Queue low-confidence items</p>
              <p className="text-sm text-muted-foreground">
                Send items below threshold to review queue
              </p>
            </div>
            <Switch
              checked={queueLowConfidence}
              onCheckedChange={setQueueLowConfidence}
              aria-label="Queue low confidence"
            />
          </div>
        </div>

        {hasChanges && (
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={patchInference.isPending}>
              Save changes
            </Button>
          </div>
        )}

        {inference?.updatedAt && (
          <p className="text-xs text-muted-foreground">
            Last updated: {new Date(inference.updatedAt).toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
