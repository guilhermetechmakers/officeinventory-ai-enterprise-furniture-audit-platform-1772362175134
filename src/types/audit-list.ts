/**
 * Data models for Audit List / Site Manager
 * Aligned with OfficeInventory AI platform architecture
 */

export interface Tenant {
  id: string
  name: string
  sites?: Site[]
}

export interface Site {
  id: string
  name: string
  tenantId: string
  floors?: Floor[]
}

export interface Floor {
  id: string
  name: string
  siteId: string
  zones?: Zone[]
}

export interface Zone {
  id: string
  name: string
  floorId: string
}

export type AuditStatus = 'draft' | 'in-progress' | 'complete' | 'archived'

export interface Audit {
  id: string
  name: string
  status: AuditStatus
  itemCount: number
  lastUpdated: string
  ownerId: string
  owner?: { id: string; name: string; email?: string }
  tenantId: string
  siteId: string
  floorId: string
  zoneId?: string
  assignedTeamIds?: string[]
  siteName?: string
  floorName?: string
  zoneName?: string
  tenantName?: string
}

export interface AuditItem {
  id: string
  type: string
  attributes: Record<string, unknown>
  confidence: number
  evidenceUrl?: string
  location?: { x: number; y: number }
}

export interface ActivityLog {
  id: string
  auditId: string
  action: string
  timestamp: string
  userId: string
  userName?: string
}

export interface SiteDetail {
  id: string
  name: string
  tenantId: string
  tenantName?: string
  floors?: Floor[]
  audits?: Audit[]
  items?: AuditItem[]
  queues?: unknown[]
  activityLog?: ActivityLog[]
}

export interface CreateAuditPayload {
  tenantId: string
  siteId: string
  floorId: string
  zoneId?: string
  name: string
  schedule?: { type: 'once' | 'recurring'; date?: string; recurrence?: string }
  assignedTeamIds?: string[]
}

export interface ScheduleOption {
  type: 'once' | 'recurring'
  date?: string
  time?: string
  recurrence?: string
}
