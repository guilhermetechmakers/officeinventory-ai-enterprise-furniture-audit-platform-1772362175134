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
import { useTenantSettings, usePatchReviewSLA } from '@/hooks/use-tenant-settings'
import { LoadingState } from './loading-state'
import { ErrorState } from './error-state'
import type { AutoAssignRule, EscalationTimeline } from '@/types/tenant-settings'

const REVIEWER_POOLS = [
  { id: 'pool-default', name: 'Default pool' },
  { id: 'pool-qa', name: 'QA team' },
  { id: 'pool-furniture', name: 'Furniture specialists' },
  { id: 'pool-senior', name: 'Senior reviewers' },
]

const ESCALATION_ACTIONS = [
  { value: 'notify', label: 'Notify' },
  { value: 'reassign', label: 'Reassign' },
  { value: 'escalate', label: 'Escalate' },
] as const

export function ReviewSLAPanel() {
  const { data: settings, isLoading, error, refetch } = useTenantSettings()
  const patchSLA = usePatchReviewSLA()

  const sla = settings?.reviewSla
  const rules = (sla?.rules ?? []) as AutoAssignRule[]
  const escalationTimes = (sla?.escalationTimes ?? []) as EscalationTimeline[]

  const [localRules, setLocalRules] = React.useState<AutoAssignRule[]>([])
  const [localEscalation, setLocalEscalation] = React.useState<EscalationTimeline[]>([])
  const [slaHours, setSlaHours] = React.useState(sla?.slaHours ?? 48)
  const [defaultPoolId, setDefaultPoolId] = React.useState(sla?.defaultReviewerPoolId ?? '')

  React.useEffect(() => {
    const r = Array.isArray(rules) ? rules : []
    const e = Array.isArray(escalationTimes) ? escalationTimes : []
    if (r.length > 0) setLocalRules([...r])
    if (e.length > 0) setLocalEscalation([...e])
    if (sla?.slaHours != null) setSlaHours(sla.slaHours)
    setDefaultPoolId(sla?.defaultReviewerPoolId ?? '')
  }, [sla?.updatedAt, sla?.slaHours, sla?.defaultReviewerPoolId, rules?.length, escalationTimes?.length])

  const addRule = () => {
    setLocalRules((prev) => [
      ...prev,
      {
        id: `r${Date.now()}`,
        condition: 'confidence < 0.7',
        reviewerPoolId: 'pool-default',
        priority: prev.length + 1,
      },
    ])
  }

  const updateRule = (id: string, updates: Partial<AutoAssignRule>) => {
    setLocalRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    )
  }

  const removeRule = (id: string) => {
    setLocalRules((prev) => prev.filter((r) => r.id !== id))
  }

  const addEscalation = () => {
    setLocalEscalation((prev) => [
      ...prev,
      { hours: 24, action: 'notify' },
    ])
  }

  const updateEscalation = (index: number, updates: Partial<EscalationTimeline>) => {
    setLocalEscalation((prev) =>
      prev.map((e, i) => (i === index ? { ...e, ...updates } : e))
    )
  }

  const removeEscalation = (index: number) => {
    setLocalEscalation((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    patchSLA.mutate({
      rules: localRules.length > 0 ? localRules : rules,
      escalationTimes: localEscalation.length > 0 ? localEscalation : escalationTimes,
      slaHours,
      defaultReviewerPoolId: defaultPoolId || null,
    })
  }

  const displayRules = localRules.length > 0 ? localRules : rules
  const displayEscalation = localEscalation.length > 0 ? localEscalation : escalationTimes
  const hasChanges =
    JSON.stringify(displayRules) !== JSON.stringify(rules) ||
    JSON.stringify(displayEscalation) !== JSON.stringify(escalationTimes) ||
    slaHours !== (sla?.slaHours ?? 48) ||
    (defaultPoolId || null) !== (sla?.defaultReviewerPoolId ?? null)

  if (isLoading) return <LoadingState lines={6} />
  if (error) return <ErrorState message={String(error)} onRetry={() => refetch()} />

  return (
    <Card className="rounded-2xl shadow-card">
      <CardHeader>
        <CardTitle>Review SLA Settings</CardTitle>
        <CardDescription>
          Auto-assignment rules, escalation timelines, and reviewer pools for quality assurance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="slaHours">SLA (hours)</Label>
          <Input
            id="slaHours"
            type="number"
            min={1}
            max={168}
            value={slaHours}
            onChange={(e) => setSlaHours(parseInt(e.target.value, 10) || 24)}
            className="max-w-[120px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Default reviewer pool</Label>
          <Select value={defaultPoolId} onValueChange={setDefaultPoolId}>
            <SelectTrigger className="max-w-[240px]">
              <SelectValue placeholder="Select pool" />
            </SelectTrigger>
            <SelectContent>
              {REVIEWER_POOLS.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Auto-assign rules</Label>
            <Button variant="outline" size="sm" onClick={addRule}>
              Add rule
            </Button>
          </div>
          <div className="space-y-2">
            {(displayRules ?? []).map((rule) => (
              <div
                key={rule.id}
                className="flex flex-wrap items-center gap-2 rounded-xl border border-border p-3"
              >
                <Input
                  value={rule.condition}
                  onChange={(e) => updateRule(rule.id, { condition: e.target.value })}
                  placeholder="Condition"
                  className="flex-1 min-w-[160px]"
                />
                <Select
                  value={rule.reviewerPoolId}
                  onValueChange={(v) => updateRule(rule.id, { reviewerPoolId: v })}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REVIEWER_POOLS.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeRule(rule.id)}
                  aria-label="Remove rule"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Escalation timelines</Label>
            <Button variant="outline" size="sm" onClick={addEscalation}>
              Add escalation
            </Button>
          </div>
          <div className="space-y-2">
            {(displayEscalation ?? []).map((esc, i) => (
              <div
                key={i}
                className="flex flex-wrap items-center gap-2 rounded-xl border border-border p-3"
              >
                <Input
                  type="number"
                  min={1}
                  value={esc.hours}
                  onChange={(e) => updateEscalation(i, { hours: parseInt(e.target.value, 10) || 0 })}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">hours →</span>
                <Select
                  value={esc.action}
                  onValueChange={(v) => updateEscalation(i, { action: v as EscalationTimeline['action'] })}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ESCALATION_ACTIONS.map((a) => (
                      <SelectItem key={a.value} value={a.value}>
                        {a.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeEscalation(i)}
                  aria-label="Remove escalation"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>

        {hasChanges && (
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={patchSLA.isPending}>
              Save changes
            </Button>
          </div>
        )}

        {sla?.updatedAt && (
          <p className="text-xs text-muted-foreground">
            Last updated: {new Date(sla.updatedAt).toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
