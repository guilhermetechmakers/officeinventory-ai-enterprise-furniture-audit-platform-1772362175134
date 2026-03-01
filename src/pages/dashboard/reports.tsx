import { useState, useCallback, useMemo } from 'react'
import { FileText, Calendar, History } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import {
  ExportBuilderPanel,
  TemplateManager,
  ScheduleManager,
  ExportHistoryPanel,
  NotificationBanner,
} from '@/components/reports-exports'
import {
  useTemplates,
  useExportConfigs,
  useSchedules,
  useExportHistory,
  useBuildExport,
  useCreateTemplate,
  useDeleteTemplate,
  useUpdateSchedule,
  useDeleteSchedule,
  useCreateSchedule,
  useRetryExportJob,
} from '@/hooks/use-reports-exports'
import type { ExportTemplate, Schedule, ExportJob, UserPermissions } from '@/types/reports-exports'
import { ensureArray } from '@/lib/safe-array'

const DEFAULT_PERMISSIONS: UserPermissions = {
  canCreateExport: true,
  canEditTemplate: true,
  canManageSchedules: true,
  canViewHistory: true,
}

export function ReportsPage() {
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'Queued' | 'InProgress' | 'Completed' | 'Failed'
  >('all')
  const [notification, setNotification] = useState<{
    variant: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
  } | null>(null)
  const [appliedTemplate, setAppliedTemplate] = useState<ExportTemplate | null>(null)

  const { templates, isLoading: templatesLoading } = useTemplates()
  const { availableFields } = useExportConfigs()
  const { schedules, isLoading: schedulesLoading } = useSchedules()
  const {
    history,
    isLoading: historyLoading,
    refetch: refetchHistory,
  } = useExportHistory(statusFilter === 'all' ? undefined : statusFilter)

  const buildExport = useBuildExport()
  const createTemplate = useCreateTemplate()
  const deleteTemplate = useDeleteTemplate()
  const createSchedule = useCreateSchedule()
  const updateSchedule = useUpdateSchedule()
  const deleteSchedule = useDeleteSchedule()
  const retryJob = useRetryExportJob()

  const safeTemplates = ensureArray(templates)
  const safeSchedules = ensureArray(schedules)
  const safeHistory = ensureArray(history)

  const summaryMetrics = useMemo(() => {
    const completedCount = safeHistory.filter((j) => j.status === 'Completed').length
    const nextRun = safeSchedules
      .filter((s) => s.enabled && s.nextRunAt)
      .map((s) => new Date(s.nextRunAt!).getTime())
      .sort((a, b) => a - b)[0]
    const totalVolumeBytes = safeHistory
      .filter((j) => j.fileSizeBytes != null && j.fileSizeBytes > 0)
      .reduce((sum, j) => sum + (j.fileSizeBytes ?? 0), 0)
    const formatBytes = (b: number) =>
      b < 1024 ? `${b} B` : b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB` : `${(b / (1024 * 1024)).toFixed(1)} MB`
    return {
      exportsCount: completedCount,
      nextRunAt: nextRun ? new Date(nextRun) : null,
      totalVolume: formatBytes(totalVolumeBytes),
    }
  }, [safeHistory, safeSchedules])

  const handleApplyTemplate = useCallback((template: ExportTemplate) => {
    setAppliedTemplate(template)
  }, [])

  const handleBuildExport = useCallback(
    async (config: {
      name: string
      fields: { key: string; label: string; type: string }[]
      filters: { key: string; operator: string; value: unknown }[]
      sorts: { field: string; direction: 'asc' | 'desc' }[]
      format: 'CSV' | 'PDF'
      templateId?: string
    }) => {
      try {
        await buildExport.mutateAsync(config)
        setNotification({
          variant: 'success',
          title: 'Export queued',
          message: 'Your export has been added to the queue.',
        })
        refetchHistory()
      } catch {
        setNotification({
          variant: 'error',
          title: 'Export failed',
          message: 'Could not start export. Please try again.',
        })
      }
    },
    [buildExport, refetchHistory]
  )

  const handleSaveTemplate = useCallback(
    async (config: {
      name: string
      fields: { key: string; label: string; type: string }[]
      filters: { key: string; operator: string; value: unknown }[]
      sorts: { field: string; direction: 'asc' | 'desc' }[]
    }) => {
      try {
        await createTemplate.mutateAsync({
          name: config.name,
          description: '',
          ownerId: 'user-1',
          tenantId: 'tenant-1',
          fields: config.fields,
          filters: config.filters,
          sorts: config.sorts,
          templateFor: 'procurement',
        })
        setNotification({
          variant: 'success',
          title: 'Template saved',
          message: 'Your template has been created.',
        })
      } catch {
        setNotification({
          variant: 'error',
          title: 'Save failed',
          message: 'Could not save template.',
        })
      }
    },
    [createTemplate]
  )

  const handleScheduleToggle = useCallback(
    async (schedule: Schedule, enabled: boolean) => {
      try {
        await updateSchedule.mutateAsync({
          id: schedule.id,
          payload: { enabled },
        })
      } catch {
        setNotification({
          variant: 'error',
          title: 'Update failed',
          message: 'Could not update schedule.',
        })
      }
    },
    [updateSchedule]
  )

  const handleScheduleEdit = useCallback((schedule: Schedule) => {
    setNotification({
      variant: 'info',
      title: 'Edit schedule',
      message: `Edit functionality for "${schedule.name}" can be extended with a modal.`,
    })
  }, [])

  const handleScheduleDelete = useCallback(
    async (schedule: Schedule) => {
      try {
        await deleteSchedule.mutateAsync(schedule.id)
        setNotification({
          variant: 'success',
          title: 'Schedule deleted',
        })
      } catch {
        setNotification({
          variant: 'error',
          title: 'Delete failed',
          message: 'Could not delete schedule.',
        })
      }
    },
    [deleteSchedule]
  )

  const handleCreateSchedule = useCallback(
    async (
      payload: Omit<
        Schedule,
        'id' | 'createdAt' | 'updatedAt' | 'lastRunAt' | 'nextRunAt'
      >
    ) => {
      try {
        await createSchedule.mutateAsync(payload)
        setNotification({
          variant: 'success',
          title: 'Schedule created',
          message: 'Your recurring export has been scheduled.',
        })
      } catch {
        setNotification({
          variant: 'error',
          title: 'Create failed',
          message: 'Could not create schedule.',
        })
      }
    },
    [createSchedule]
  )

  const handleRetryJob = useCallback(
    async (job: ExportJob) => {
      try {
        await retryJob.mutateAsync(job.id)
        setNotification({
          variant: 'success',
          title: 'Export retried',
          message: 'The export has been queued again.',
        })
        refetchHistory()
      } catch {
        setNotification({
          variant: 'error',
          title: 'Retry failed',
          message: 'Could not retry export.',
        })
      }
    },
    [retryJob, refetchHistory]
  )

  const handleTemplateEdit = useCallback((template: ExportTemplate) => {
    setNotification({
      variant: 'info',
      title: 'Edit template',
      message: `Edit functionality for "${template.name}" can be extended with a modal.`,
    })
  }, [])

  const handleTemplateDelete = useCallback(
    async (template: ExportTemplate) => {
      try {
        await deleteTemplate.mutateAsync(template.id)
        setNotification({
          variant: 'success',
          title: 'Template deleted',
        })
      } catch {
        setNotification({
          variant: 'error',
          title: 'Delete failed',
          message: 'Could not delete template.',
        })
      }
    },
    [deleteTemplate]
  )

  const handleCreateTemplate = useCallback(
    async (
      payload: Omit<ExportTemplate, 'id' | 'createdAt' | 'updatedAt'>
    ) => {
      try {
        await createTemplate.mutateAsync(payload)
        setNotification({
          variant: 'success',
          title: 'Template created',
          message: 'Your template has been created. Configure fields in the Export Builder.',
        })
      } catch {
        setNotification({
          variant: 'error',
          title: 'Create failed',
          message: 'Could not create template.',
        })
      }
    },
    [createTemplate]
  )

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports & Exports</h1>
        <p className="text-muted-foreground mt-1">
          Build ad hoc and scheduled reports (CSV/PDF) with customizable templates
        </p>
      </div>

      {notification && (
        <NotificationBanner
          variant={notification.variant}
          title={notification.title}
          message={notification.message}
          onDismiss={() => setNotification(null)}
        />
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="rounded-2xl border border-border shadow-card transition-all duration-300 hover:shadow-elevated">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20">
              <History className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-muted-foreground">Completed Exports</p>
              <p className="text-xl font-semibold">{summaryMetrics.exportsCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border border-border shadow-card transition-all duration-300 hover:shadow-elevated">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-muted-foreground">Next Scheduled Run</p>
              <p className="text-xl font-semibold">
                {summaryMetrics.nextRunAt
                  ? summaryMetrics.nextRunAt.toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })
                  : '—'}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border border-border shadow-card transition-all duration-300 hover:shadow-elevated">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-muted-foreground">Total Data Volume</p>
              <p className="text-xl font-semibold">{summaryMetrics.totalVolume}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="builder" className="space-y-6">
        <TabsList className="inline-flex h-11 items-center justify-center rounded-full bg-muted/50 p-1">
          <TabsTrigger value="builder" className="rounded-full">
            Export Builder
          </TabsTrigger>
          <TabsTrigger value="templates" className="rounded-full">
            Templates
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="rounded-full">
            Scheduled
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-full">
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="mt-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ExportBuilderPanel
                templates={safeTemplates}
                availableFields={availableFields}
                existingExportConfig={
                  appliedTemplate
                    ? {
                        fields: appliedTemplate.fields ?? [],
                        filters: appliedTemplate.filters ?? [],
                        sorts: appliedTemplate.sorts ?? [],
                        format: 'CSV',
                        templateId: appliedTemplate.id,
                      }
                    : undefined
                }
                userPermissions={DEFAULT_PERMISSIONS}
                onApplyTemplate={handleApplyTemplate}
                onBuildExport={handleBuildExport}
                onSaveTemplate={handleSaveTemplate}
                isBuilding={buildExport.isPending}
              />
            </div>
            <div>
              <ExportHistoryPanel
                history={safeHistory.slice(0, 5)}
                isLoading={historyLoading}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                onRetry={handleRetryJob}
                onDownload={(job) => {
                  if (job.downloadUrl) {
                    window.open(job.downloadUrl, '_blank')
                  }
                }}
                canViewHistory={DEFAULT_PERMISSIONS.canViewHistory}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <TemplateManager
            templates={safeTemplates}
            isLoading={templatesLoading}
            onApply={handleApplyTemplate}
            onEdit={handleTemplateEdit}
            onDelete={handleTemplateDelete}
            onCreate={handleCreateTemplate}
            canManageTemplates={DEFAULT_PERMISSIONS.canEditTemplate}
          />
        </TabsContent>

        <TabsContent value="scheduled" className="mt-6">
          <ScheduleManager
            schedules={safeSchedules}
            isLoading={schedulesLoading}
            onToggle={handleScheduleToggle}
            onEdit={handleScheduleEdit}
            onDelete={handleScheduleDelete}
            onCreate={handleCreateSchedule}
            canManageSchedules={DEFAULT_PERMISSIONS.canManageSchedules}
          />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <ExportHistoryPanel
            history={safeHistory}
            isLoading={historyLoading}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onRetry={handleRetryJob}
            onDownload={(job) => {
              if (job.downloadUrl) {
                window.open(job.downloadUrl, '_blank')
              }
            }}
            canViewHistory={DEFAULT_PERMISSIONS.canViewHistory}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
