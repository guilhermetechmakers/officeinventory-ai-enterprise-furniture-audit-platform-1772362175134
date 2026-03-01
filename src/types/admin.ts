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
  email: string
  tenantId: string
  isActive: boolean
  roles: string[]
  invitedAt: string
}

export interface Role {
  id: string
  name: string
  permissions: string[]
}

export interface CreateRoleInput {
  name: string
  permissions: string[]
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
