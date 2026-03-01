/** Dashboard-related type definitions for OfficeInventory AI */

export type UserRole = 'admin' | 'reviewer' | 'field_user'

export interface Audit {
  id: string
  siteId: string
  siteName?: string
  name: string
  status: 'draft' | 'in-progress' | 'complete' | 'archived'
  lastUpdated: string
  ownerId?: string
  itemsDetected?: number
  location?: string
}

export interface SiteMetrics {
  activeAudits: number
  itemsToday: number
  pendingReviews: number
}

export interface Site {
  id: string
  name: string
  location?: string
  metrics?: SiteMetrics
}

export type ActivityType =
  | 'audit_created'
  | 'audit_updated'
  | 'audit_completed'
  | 'batch_uploaded'
  | 'review_assigned'
  | 'review_completed'
  | 'export_generated'
  | 'status_update'
  | 'status_update'

export interface Activity {
  id: string
  type: ActivityType
  timestamp: string
  description: string
  auditId?: string
  siteId?: string
  userId?: string
  metadata?: Record<string, unknown>
}

export interface DashboardKPIs {
  activeAudits: number
  itemsToday: number
  pendingReviews: number
  exportCreditsUsed: number
}

export interface DashboardData {
  audits: Audit[]
  kpis: DashboardKPIs
  recentActivities: Activity[]
  sites: Site[]
}

/** Raw API response shape - may have null/undefined fields */
export interface DashboardApiResponse {
  audits?: Audit[] | null
  kpis?: Partial<DashboardKPIs> | null
  recentActivities?: Activity[] | null
  sites?: Site[] | null
}
