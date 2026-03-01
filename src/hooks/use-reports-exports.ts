/**
 * Reports & Exports - React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  fetchExportConfigs,
  buildExport,
  fetchSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  fetchExportHistory,
  fetchExportJob,
  retryExportJob,
} from '@/api/reports-exports'
import type {
  ExportTemplate,
  Schedule,
  FieldDefinition,
} from '@/types/reports-exports'
import { ensureArray } from '@/lib/safe-array'
import { toast } from 'sonner'

const QUERY_KEYS = {
  templates: ['reports-exports', 'templates'] as const,
  configs: ['reports-exports', 'configs'] as const,
  schedules: ['reports-exports', 'schedules'] as const,
  history: (status?: string) =>
    status ? ['reports-exports', 'history', status] : ['reports-exports', 'history'] as const,
  job: (id: string) => ['reports-exports', 'job', id] as const,
}

export function useTemplates() {
  const query = useQuery({
    queryKey: QUERY_KEYS.templates,
    queryFn: fetchTemplates,
    staleTime: 60_000,
  })
  const templates = ensureArray(query.data)
  return { ...query, templates }
}

export function useExportConfigs() {
  const query = useQuery({
    queryKey: QUERY_KEYS.configs,
    queryFn: fetchExportConfigs,
    staleTime: 60_000,
  })
  const availableFields: FieldDefinition[] = ensureArray(
    query.data?.availableFields
  )
  const defaultConfig = query.data?.defaultConfig
  return { ...query, availableFields, defaultConfig }
}

export function useSchedules() {
  const query = useQuery({
    queryKey: QUERY_KEYS.schedules,
    queryFn: fetchSchedules,
    staleTime: 30_000,
  })
  const schedules = ensureArray(query.data)
  return { ...query, schedules }
}

export function useExportHistory(status?: string) {
  const query = useQuery({
    queryKey: QUERY_KEYS.history(status),
    queryFn: () => fetchExportHistory({ status, limit: 50 }),
    staleTime: 15_000,
  })
  const history = ensureArray(query.data)
  return { ...query, history }
}

export function useExportJob(id: string | null) {
  const query = useQuery({
    queryKey: QUERY_KEYS.job(id ?? ''),
    queryFn: () => (id ? fetchExportJob(id) : Promise.resolve(null)),
    enabled: !!id,
    staleTime: 5_000,
  })
  return query
}

export function useCreateTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.templates })
      toast.success('Template created')
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to create template')
    },
  })
}

export function useUpdateTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ExportTemplate> }) =>
      updateTemplate(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.templates })
      toast.success('Template updated')
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to update template')
    },
  })
}

export function useDeleteTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteTemplate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.templates })
      toast.success('Template deleted')
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to delete template')
    },
  })
}

export function useBuildExport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: buildExport,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.history() })
      toast.success('Export queued')
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to start export')
    },
  })
}

export function useCreateSchedule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createSchedule,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.schedules })
      toast.success('Schedule created')
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to create schedule')
    },
  })
}

export function useUpdateSchedule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Schedule> }) =>
      updateSchedule(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.schedules })
      toast.success('Schedule updated')
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to update schedule')
    },
  })
}

export function useDeleteSchedule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteSchedule,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.schedules })
      toast.success('Schedule deleted')
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to delete schedule')
    },
  })
}

export function useRetryExportJob() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: retryExportJob,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.history() })
      toast.success('Export retried')
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to retry export')
    },
  })
}
