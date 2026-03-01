/**
 * Reports & Exports - Type definitions
 * Enterprise furniture audit export schemas and scheduling
 */

export type TemplateFor = 'procurement' | 'facilities' | 'sustainability'

export interface ExportField {
  key: string
  label: string
  type: string
}

export interface ExportFilter {
  key: string
  operator: string
  value: unknown
}

export interface ExportSort {
  field: string
  direction: 'asc' | 'desc'
}

export interface FieldDefinition {
  key: string
  label: string
  type: string
  isRequired: boolean
  isSortable: boolean
}

export interface ExportTemplate {
  id: string
  name: string
  description: string
  ownerId: string
  tenantId: string
  fields: ExportField[]
  filters: ExportFilter[]
  sorts: ExportSort[]
  templateFor: TemplateFor
  createdAt: string
  updatedAt: string
}

export interface ExportConfig {
  id: string
  name: string
  fields: ExportField[]
  filters: ExportFilter[]
  sorts: ExportSort[]
  format: 'CSV' | 'PDF'
  templateId?: string
  createdBy: string
  createdAt: string
}

export interface Schedule {
  id: string
  name: string
  cronExpression: string
  format: 'CSV' | 'PDF'
  recipients: string[]
  enabled: boolean
  retentionDays: number
  lastRunAt: string | null
  nextRunAt: string | null
  exportConfigId?: string
  createdAt: string
  updatedAt: string
}

export type ExportJobStatus = 'Queued' | 'InProgress' | 'Completed' | 'Failed'

export interface ExportJob {
  id: string
  exportConfigId: string
  status: ExportJobStatus
  format: 'CSV' | 'PDF'
  generatedAt: string | null
  downloadUrl: string | null
  fileSizeBytes: number | null
  errorMessage: string | null
  scheduleId?: string
  createdAt?: string
}

export interface ExportConfigResponse {
  availableFields: FieldDefinition[]
  defaultConfig?: Partial<ExportConfig>
}

export interface UserPermissions {
  canCreateExport: boolean
  canEditTemplate: boolean
  canManageSchedules: boolean
  canViewHistory: boolean
}
