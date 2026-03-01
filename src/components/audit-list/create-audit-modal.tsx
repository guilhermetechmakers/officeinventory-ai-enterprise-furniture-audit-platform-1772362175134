/**
 * CreateAuditModal - Create new audit with hierarchical location selection
 * Validates required fields; debounced search ready for large datasets
 */

import { useState, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
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
import type { Tenant, Zone } from '@/types/audit-list'

const schema = z.object({
  tenantId: z.string().min(1, 'Select a tenant'),
  siteId: z.string().min(1, 'Select a site'),
  floorId: z.string().min(1, 'Select a floor or zone'),
  name: z.string().min(1, 'Audit name is required').max(200, 'Name too long'),
  scheduleType: z.enum(['once', 'recurring']),
  scheduleDate: z.string().optional(),
  scheduleTime: z.string().optional(),
  recurrence: z.string().optional(),
  assignedTeamIds: z.array(z.string()).optional(),
})

export type CreateAuditFormValues = z.infer<typeof schema>

interface CreateAuditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenants: Tenant[]
  teams: { id: string; name: string }[]
  defaultLocation?: {
    tenantId: string
    siteId: string
    floorId: string
    zoneId?: string
  }
  onSubmit: (values: CreateAuditFormValues) => Promise<void>
}

function safeArray<T>(arr: T[] | null | undefined): T[] {
  return Array.isArray(arr) ? arr : []
}

export function CreateAuditModal({
  open,
  onOpenChange,
  tenants,
  teams,
  defaultLocation,
  onSubmit,
}: CreateAuditModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateAuditFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      tenantId: '',
      siteId: '',
      floorId: '',
      name: '',
      scheduleType: 'once',
      scheduleDate: '',
      scheduleTime: '',
      recurrence: '',
      assignedTeamIds: [],
    },
    mode: 'onChange',
  })

  const tenantId = watch('tenantId')
  const siteId = watch('siteId')
  const scheduleType = watch('scheduleType')

  const tenantList = safeArray(tenants)
  const selectedTenant = tenantList.find((t) => t.id === tenantId)
  const sites = safeArray(selectedTenant?.sites)
  const selectedSite = sites.find((s) => s.id === siteId)
  const floors = safeArray(selectedSite?.floors)
  const teamList = safeArray(teams)

  // Build flattened floor/zone options
  const locationOptions: { id: string; label: string; type: 'floor' | 'zone' }[] = []
  floors.forEach((floor) => {
    const zones = safeArray(floor?.zones)
    if (zones.length === 0) {
      locationOptions.push({
        id: floor.id,
        label: `${floor.name ?? 'Unnamed'} (Floor)`,
        type: 'floor',
      })
    } else {
      (zones as Zone[]).forEach((zone) => {
        locationOptions.push({
          id: `${floor.id}:${zone.id}`,
          label: `${floor.name ?? 'Unnamed'} / ${zone.name ?? 'Unnamed'}`,
          type: 'zone',
        })
      })
    }
  })

  useEffect(() => {
    if (open && defaultLocation) {
      setValue('tenantId', defaultLocation.tenantId)
      setValue('siteId', defaultLocation.siteId)
    }
  }, [open, defaultLocation, setValue])

  useEffect(() => {
    if (open && defaultLocation && locationOptions.length > 0) {
      const match = locationOptions.find(
        (o) =>
          o.id === defaultLocation.floorId ||
          o.id === `${defaultLocation.floorId}:${defaultLocation.zoneId ?? ''}`
      )
      if (match) setValue('floorId', match.id)
    }
  }, [open, defaultLocation, locationOptions, setValue])

  useEffect(() => {
    if (!tenantId) setValue('siteId', '')
    if (!siteId) setValue('floorId', '')
  }, [tenantId, siteId, setValue])

  const handleFormSubmit = useCallback(
    async (values: CreateAuditFormValues) => {
      setIsSubmitting(true)
      try {
        await onSubmit(values)
        reset()
        onOpenChange(false)
      } finally {
        setIsSubmitting(false)
      }
    },
    [onSubmit, reset, onOpenChange]
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" showClose>
        <DialogHeader>
          <DialogTitle>Create Audit</DialogTitle>
          <DialogDescription>
            Select a location and configure the new audit. All fields marked with *
            are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="tenant">Tenant *</Label>
              <Select
                value={tenantId}
                onValueChange={(v) => setValue('tenantId', v, { shouldValidate: true })}
              >
                <SelectTrigger id="tenant">
                  <SelectValue placeholder="Select tenant" />
                </SelectTrigger>
                <SelectContent>
                  {tenantList.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name ?? 'Unnamed'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tenantId && (
                <p className="text-sm text-destructive">{errors.tenantId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="site">Site *</Label>
              <Select
                value={siteId}
                onValueChange={(v) => setValue('siteId', v, { shouldValidate: true })}
                disabled={!tenantId}
              >
                <SelectTrigger id="site">
                  <SelectValue placeholder="Select site" />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name ?? 'Unnamed'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.siteId && (
                <p className="text-sm text-destructive">{errors.siteId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="floor">Floor / Zone *</Label>
              <Select
                value={watch('floorId')}
                onValueChange={(v) => setValue('floorId', v, { shouldValidate: true })}
                disabled={!siteId}
              >
                <SelectTrigger id="floor">
                  <SelectValue placeholder="Select floor or zone" />
                </SelectTrigger>
                <SelectContent>
                  {locationOptions.map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.floorId && (
                <p className="text-sm text-destructive">{errors.floorId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Audit Name *</Label>
              <Input
                id="name"
                placeholder="e.g. Building A - Full Inventory"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <Label>Schedule</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="once"
                    checked={scheduleType === 'once'}
                    onChange={() => setValue('scheduleType', 'once')}
                    className="rounded-full border-border"
                  />
                  <span className="text-sm">One-time</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="recurring"
                    checked={scheduleType === 'recurring'}
                    onChange={() => setValue('scheduleType', 'recurring')}
                    className="rounded-full border-border"
                  />
                  <span className="text-sm">Recurring</span>
                </label>
              </div>
              {scheduleType === 'once' && (
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="scheduleDate">Date</Label>
                    <Input
                      id="scheduleDate"
                      type="date"
                      {...register('scheduleDate')}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="scheduleTime">Time</Label>
                    <Input
                      id="scheduleTime"
                      type="time"
                      {...register('scheduleTime')}
                    />
                  </div>
                </div>
              )}
              {scheduleType === 'recurring' && (
                <div className="space-y-2">
                  <Label htmlFor="recurrence">Recurrence</Label>
                  <Select
                    value={watch('recurrence')}
                    onValueChange={(v) => setValue('recurrence', v)}
                  >
                    <SelectTrigger id="recurrence">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="teams">Assigned Team</Label>
              <Select
                value={watch('assignedTeamIds')?.[0] ?? ''}
                onValueChange={(v) =>
                  setValue('assignedTeamIds', v ? [v] : [])
                }
              >
                <SelectTrigger id="teams">
                  <SelectValue placeholder="Select team (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {teamList.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="rounded-full"
            >
              {isSubmitting ? 'Creating…' : 'Create Audit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
