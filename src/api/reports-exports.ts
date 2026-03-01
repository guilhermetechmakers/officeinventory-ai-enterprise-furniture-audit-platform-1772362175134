/**
 * Reports & Exports API
 * Templates, schedules, export build, and history
 * Falls back to mock when API unavailable
 */

import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api'
import type {
  ExportTemplate,
  Schedule,
  ExportJob,
  ExportConfigResponse,
} from '@/types/reports-exports'
import {
  mockTemplates,
  mockSchedules,
  mockExportHistory,
  mockFieldDefinitions,
  mockExportConfig,
} from '@/data/reports-exports-mocks'
import { ensureArray } from '@/lib/safe-array'

/** GET /api/export/templates */
export async function fetchTemplates(): Promise<ExportTemplate[]> {
  try {
    const data = await apiGet<ExportTemplate[] | { data?: ExportTemplate[] }>(
      '/export/templates'
    )
    const list = Array.isArray(data) ? data : (data as { data?: ExportTemplate[] })?.data
    return ensureArray(list)
  } catch {
    return mockTemplates
  }
}

/** POST /api/export/templates */
export async function createTemplate(
  payload: Omit<ExportTemplate, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ExportTemplate> {
  try {
    const created = await apiPost<ExportTemplate>('/export/templates', payload)
    return created ?? ({} as ExportTemplate)
  } catch {
    const id = `tpl-${Date.now()}`
    const now = new Date().toISOString()
    return {
      ...payload,
      id,
      createdAt: now,
      updatedAt: now,
    }
  }
}

/** PUT /api/export/templates/{id} */
export async function updateTemplate(
  id: string,
  payload: Partial<ExportTemplate>
): Promise<ExportTemplate> {
  try {
    const updated = await apiPut<ExportTemplate>(`/export/templates/${id}`, payload)
    return updated ?? ({} as ExportTemplate)
  } catch {
    const existing = mockTemplates.find((t) => t.id === id)
    const now = new Date().toISOString()
    return {
      ...(existing ?? {}),
      ...payload,
      id,
      updatedAt: now,
    } as ExportTemplate
  }
}

/** DELETE /api/export/templates/{id} */
export async function deleteTemplate(id: string): Promise<void> {
  try {
    await apiDelete(`/export/templates/${id}`)
  } catch {
    // Mock: no-op
  }
}

/** GET /api/export/configs - available fields and default config */
export async function fetchExportConfigs(): Promise<ExportConfigResponse> {
  try {
    const data = await apiGet<ExportConfigResponse>('/export/configs')
    return {
      availableFields: ensureArray(data?.availableFields),
      defaultConfig: data?.defaultConfig,
    }
  } catch {
    return {
      availableFields: mockFieldDefinitions,
      defaultConfig: mockExportConfig,
    }
  }
}

/** POST /api/export/build - build export on-demand */
export async function buildExport(payload: {
  name: string
  fields: { key: string; label: string; type: string }[]
  filters: { key: string; operator: string; value: unknown }[]
  sorts: { field: string; direction: 'asc' | 'desc' }[]
  format: 'CSV' | 'PDF'
  templateId?: string
}): Promise<{ jobId: string; status: string }> {
  try {
    const result = await apiPost<{ jobId: string; status: string }>(
      '/export/build',
      payload
    )
    return result ?? { jobId: `job-${Date.now()}`, status: 'Queued' }
  } catch {
    return { jobId: `job-${Date.now()}`, status: 'Queued' }
  }
}

/** POST /api/export/schedules */
export async function createSchedule(
  payload: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt' | 'lastRunAt' | 'nextRunAt'>
): Promise<Schedule> {
  try {
    const created = await apiPost<Schedule>('/export/schedules', payload)
    return created ?? ({} as Schedule)
  } catch {
    const id = `sched-${Date.now()}`
    const now = new Date().toISOString()
    const nextRun = payload.enabled ? new Date(Date.now() + 86400000).toISOString() : null
    return {
      ...payload,
      id,
      lastRunAt: null,
      nextRunAt: nextRun,
      createdAt: now,
      updatedAt: now,
    }
  }
}

/** GET /api/export/schedules */
export async function fetchSchedules(): Promise<Schedule[]> {
  try {
    const data = await apiGet<Schedule[] | { data?: Schedule[] }>(
      '/export/schedules'
    )
    const list = Array.isArray(data) ? data : (data as { data?: Schedule[] })?.data
    return ensureArray(list)
  } catch {
    return mockSchedules
  }
}

/** PUT /api/export/schedules/{id} */
export async function updateSchedule(
  id: string,
  payload: Partial<Schedule>
): Promise<Schedule> {
  try {
    const updated = await apiPut<Schedule>(`/export/schedules/${id}`, payload)
    return updated ?? ({} as Schedule)
  } catch {
    const existing = mockSchedules.find((s) => s.id === id)
    const now = new Date().toISOString()
    return {
      ...(existing ?? {}),
      ...payload,
      id,
      updatedAt: now,
    } as Schedule
  }
}

/** DELETE /api/export/schedules/{id} */
export async function deleteSchedule(id: string): Promise<void> {
  try {
    await apiDelete(`/export/schedules/${id}`)
  } catch {
    // Mock: no-op
  }
}

/** GET /api/export/history */
export async function fetchExportHistory(params?: {
  status?: string
  limit?: number
}): Promise<ExportJob[]> {
  try {
    const search = new URLSearchParams()
    if (params?.status) search.set('status', params.status)
    if (params?.limit) search.set('limit', String(params.limit))
    const qs = search.toString()
    const data = await apiGet<ExportJob[] | { data?: ExportJob[] }>(
      `/export/history${qs ? `?${qs}` : ''}`
    )
    const list = Array.isArray(data) ? data : (data as { data?: ExportJob[] })?.data
    return ensureArray(list)
  } catch {
    return mockExportHistory
  }
}

/** GET /api/export/history/{id} */
export async function fetchExportJob(id: string): Promise<ExportJob | null> {
  try {
    const data = await apiGet<ExportJob>(`/export/history/${id}`)
    return data ?? null
  } catch {
    return mockExportHistory.find((j) => j.id === id) ?? null
  }
}

/** POST /api/export/history/{id}/retry */
export async function retryExportJob(id: string): Promise<{ jobId: string }> {
  try {
    const result = await apiPost<{ jobId: string }>(`/export/history/${id}/retry`, {})
    return result ?? { jobId: `job-${Date.now()}` }
  } catch {
    return { jobId: `job-${Date.now()}` }
  }
}
