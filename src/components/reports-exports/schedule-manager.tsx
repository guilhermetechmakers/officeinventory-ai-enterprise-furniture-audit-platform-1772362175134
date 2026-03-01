import { useState } from 'react'
import { Calendar, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScheduleCard } from './schedule-card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Schedule } from '@/types/reports-exports'
import { ensureArray } from '@/lib/safe-array'
import { cn } from '@/lib/utils'

const PRESET_CRON = [
  { value: '0 6 * * 1', label: 'Every Monday 6:00 AM' },
  { value: '0 6 * * *', label: 'Daily 6:00 AM' },
  { value: '0 0 * * 0', label: 'Weekly Sunday midnight' },
  { value: '0 0 1 * *', label: 'Monthly 1st midnight' },
]

export interface ScheduleManagerProps {
  schedules: Schedule[]
  isLoading?: boolean
  onToggle: (schedule: Schedule, enabled: boolean) => void
  onEdit: (schedule: Schedule) => void
  onDelete: (schedule: Schedule) => void
  onCreate: (payload: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt' | 'lastRunAt' | 'nextRunAt'>) => void
  canManageSchedules?: boolean
  className?: string
}

export function ScheduleManager({
  schedules,
  isLoading = false,
  onToggle,
  onEdit,
  onDelete,
  onCreate,
  canManageSchedules = true,
  className,
}: ScheduleManagerProps) {
  const [showCreate, setShowCreate] = useState(false)
  const [createName, setCreateName] = useState('')
  const [createCron, setCreateCron] = useState('0 6 * * 1')
  const [createFormat, setCreateFormat] = useState<'CSV' | 'PDF'>('CSV')
  const [createRetention, setCreateRetention] = useState(90)

  const safeSchedules = ensureArray(schedules)

  const handleCreate = () => {
    if (!createName.trim()) return
    onCreate({
      name: createName.trim(),
      cronExpression: createCron,
      format: createFormat,
      recipients: [],
      enabled: true,
      retentionDays: createRetention,
    })
    setShowCreate(false)
    setCreateName('')
    setCreateCron('0 6 * * 1')
    setCreateFormat('CSV')
    setCreateRetention(90)
  }

  return (
    <>
      <Card className={cn('rounded-2xl border border-border shadow-card transition-all duration-300 hover:shadow-elevated animate-fade-in', className)}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Scheduled Reports
            </CardTitle>
            <CardDescription>
              Recurring exports with delivery and retention
            </CardDescription>
          </div>
          {canManageSchedules && (
            <Button
              size="sm"
              onClick={() => setShowCreate(true)}
              className="rounded-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Schedule
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </div>
          ) : safeSchedules.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-12 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground font-medium">No scheduled reports</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create a schedule to run exports automatically
              </p>
              {canManageSchedules && (
                <Button
                  variant="outline"
                  className="mt-4 rounded-full"
                  onClick={() => setShowCreate(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Schedule
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {safeSchedules.map((schedule) => (
                <ScheduleCard
                  key={schedule.id}
                  schedule={schedule}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle>New Schedule</DialogTitle>
            <DialogDescription>
              Configure a recurring export schedule
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="e.g. Weekly Inventory"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Schedule</Label>
              <Select value={createCron} onValueChange={setCreateCron}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRESET_CRON.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Format</Label>
                <Select value={createFormat} onValueChange={(v) => setCreateFormat(v as 'CSV' | 'PDF')}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSV">CSV</SelectItem>
                    <SelectItem value="PDF">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Retention (days)</Label>
                <Select
                  value={String(createRetention)}
                  onValueChange={(v) => setCreateRetention(Number(v))}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">365 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)} className="rounded-full">
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!createName.trim()} className="rounded-full">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
