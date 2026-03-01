/** Admin Dashboard data models - tenant isolation, RBAC, auditability */

export interface TenantSettings {
  defaultLocale?: string
  quotas?: {
    maxSites?: number
    maxUsers?: number
    storageGB?: number
  }
}

export interface Tenant {
  id: string
  name: string
  domain: string
  createdAt: string
  settings?: TenantSettings
}

export interface CreateTenantInput {
  name: string
  domain: string
  settings?: TenantSettings
}

export interface UpdateTenantInput extends Partial<CreateTenantInput> {
  id: string
}

export interface User {
  id: string
  name?: string
  email: string
  tenantId: string
  tenantName?: string
  isActive: boolean
  roles: string[]
  role?: string
  invitedAt: string
  lastActive?: string | null
}

export interface Role {
  id: string
  name: string
  description?: string
  permissions: string[]
  tenantId?: string
}

/** Role template for display in RoleTemplatesPanel */
export interface RoleTemplate {
  id: string
  name: string
  description: string
  permissions: string[]
  tenantId?: string
}

export interface AuditLogFilters {
  tenantId?: string
  userId?: string
  startDate?: string
  endDate?: string
  action?: string
}

export interface CreateRoleInput {
  name: string
  description?: string
  permissions: string[]
  tenantId?: string
}

export interface InviteInput {
  name: string
  email: string
  tenantId: string
  role: string
}

export interface BulkInviteInput {
  invites: InviteInput[]
}

export interface SSOConfig {
  id: string
  tenantId: string
  type: 'SAML' | 'OIDC'
  config: {
    issuer?: string
    entryPoint?: string
    cert?: string
    clientId?: string
    clientSecret?: string
    metadata?: string
  }
  status: 'configured' | 'invalid' | 'testing'
}

export interface HealthMetric {
  id: string
  tenantId: string
  metricName: string
  value: number
  timestamp: string
}

export interface HealthOverview {
  metrics: HealthMetric[]
  alerts: HealthAlert[]
}

export interface HealthAlert {
  id: string
  severity: 'info' | 'warning' | 'error'
  message: string
  timestamp: string
  acknowledged?: boolean
}

export interface Invoice {
  id: string
  tenantId: string
  periodStart: string
  periodEnd: string
  total: number
  status: 'paid' | 'unpaid' | 'overdue'
}

export interface BillingOverview {
  subscriptionTier: string
  usageCredits: number
  creditsLimit: number
  renewalDate: string
  invoices: Invoice[]
}

export interface AuditLogEntry {
  id: string
  action: string
  actorId: string
  actorEmail?: string
  subjectUserId?: string
  tenantId?: string
  timestamp: string
  details?: Record<string, unknown>
}

export type AdminSection =
  | 'overview'
  | 'tenants'
  | 'sso'
  | 'users'
  | 'health'
  | 'billing'
  | 'audit'
