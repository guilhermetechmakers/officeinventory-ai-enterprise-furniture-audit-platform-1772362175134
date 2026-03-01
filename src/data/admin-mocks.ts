/** Mock data for Admin Dashboard MVP - no external APIs */

import type {
  Tenant,
  User,
  Role,
  SSOConfig,
  HealthMetric,
  HealthAlert,
  Invoice,
  BillingOverview,
  AuditLogEntry,
} from '@/types/admin'

export const mockTenants: Tenant[] = [
  {
    id: 't1',
    name: 'Acme Corp',
    domain: 'acme.example.com',
    createdAt: '2024-01-15T10:00:00Z',
    settings: {
      defaultLocale: 'en-US',
      quotas: { maxSites: 10, maxUsers: 50, storageGB: 100 },
    },
  },
  {
    id: 't2',
    name: 'TechStart Inc',
    domain: 'techstart.example.com',
    createdAt: '2024-02-20T14:30:00Z',
    settings: {
      defaultLocale: 'en-GB',
      quotas: { maxSites: 5, maxUsers: 20, storageGB: 50 },
    },
  },
]

export const mockRoles: Role[] = [
  {
    id: 'r1',
    name: 'Admin',
    description: 'Full access to all admin features, users, and tenants',
    permissions: ['admin:*', 'users:*', 'tenants:*'],
  },
  {
    id: 'r2',
    name: 'Editor',
    description: 'Can create and edit audits and reports',
    permissions: ['audits:write', 'reports:read'],
  },
  {
    id: 'r3',
    name: 'Viewer',
    description: 'Read-only access to audits and reports',
    permissions: ['audits:read', 'reports:read'],
  },
]

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Admin User',
    email: 'admin@acme.example.com',
    tenantId: 't1',
    isActive: true,
    roles: ['Admin'],
    invitedAt: '2024-01-15T10:00:00Z',
    lastActive: '2024-03-15T14:30:00Z',
  },
  {
    id: 'u2',
    name: 'Editor User',
    email: 'editor@acme.example.com',
    tenantId: 't1',
    isActive: true,
    roles: ['Editor'],
    invitedAt: '2024-02-01T09:00:00Z',
    lastActive: '2024-03-14T09:15:00Z',
  },
  {
    id: 'u3',
    name: 'Pending User',
    email: 'pending@acme.example.com',
    tenantId: 't1',
    isActive: false,
    roles: ['Viewer'],
    invitedAt: '2024-03-01T12:00:00Z',
    lastActive: null,
  },
]

export const mockSSOConfigs: SSOConfig[] = [
  {
    id: 'sso1',
    tenantId: 't1',
    type: 'SAML',
    config: {
      issuer: 'https://acme.example.com/saml',
      entryPoint: 'https://idp.example.com/sso',
    },
    status: 'configured',
  },
]

export const mockHealthMetrics: HealthMetric[] = [
  { id: 'h1', tenantId: 't1', metricName: 'queueDepth', value: 12, timestamp: new Date().toISOString() },
  { id: 'h2', tenantId: 't1', metricName: 'storageUsageGB', value: 45, timestamp: new Date().toISOString() },
  { id: 'h3', tenantId: 't1', metricName: 'errorRate', value: 0.02, timestamp: new Date().toISOString() },
]

export const mockHealthAlerts: HealthAlert[] = [
  {
    id: 'a1',
    severity: 'warning',
    message: 'Queue depth above threshold',
    timestamp: new Date().toISOString(),
    acknowledged: false,
  },
]

export const mockInvoices: Invoice[] = [
  {
    id: 'inv1',
    tenantId: 't1',
    periodStart: '2024-01-01',
    periodEnd: '2024-01-31',
    total: 299,
    status: 'paid',
  },
  {
    id: 'inv2',
    tenantId: 't1',
    periodStart: '2024-02-01',
    periodEnd: '2024-02-29',
    total: 299,
    status: 'paid',
  },
  {
    id: 'inv3',
    tenantId: 't1',
    periodStart: '2024-03-01',
    periodEnd: '2024-03-31',
    total: 299,
    status: 'unpaid',
  },
]

export const mockBillingOverview: BillingOverview = {
  subscriptionTier: 'Professional',
  usageCredits: 1250,
  creditsLimit: 5000,
  renewalDate: '2024-04-15',
  invoices: mockInvoices,
}

export const mockAuditLogs: AuditLogEntry[] = [
  {
    id: 'al1',
    action: 'tenant.created',
    actorId: 'u1',
    actorEmail: 'admin@acme.example.com',
    tenantId: 't1',
    timestamp: '2024-01-15T10:00:00Z',
    details: { tenantName: 'Acme Corp' },
  },
  {
    id: 'al2',
    action: 'user.invited',
    actorId: 'u1',
    actorEmail: 'admin@acme.example.com',
    subjectUserId: 'u2',
    tenantId: 't1',
    timestamp: '2024-02-01T09:00:00Z',
    details: { email: 'editor@acme.example.com', role: 'Editor' },
  },
  {
    id: 'al3',
    action: 'sso.configured',
    actorId: 'u1',
    actorEmail: 'admin@acme.example.com',
    tenantId: 't1',
    timestamp: '2024-02-15T14:00:00Z',
    details: { type: 'SAML' },
  },
  {
    id: 'al4',
    action: 'user.login',
    actorId: 'u1',
    actorEmail: 'admin@acme.example.com',
    subjectUserId: 'u1',
    tenantId: 't1',
    timestamp: '2024-03-15T14:30:00Z',
    details: { ip: '192.168.1.***', device: 'Chrome on macOS' },
  },
  {
    id: 'al5',
    action: 'role_change',
    actorId: 'u1',
    actorEmail: 'admin@acme.example.com',
    subjectUserId: 'u2',
    tenantId: 't1',
    timestamp: '2024-03-10T11:00:00Z',
    details: { from: 'Viewer', to: 'Editor' },
  },
  {
    id: 'al6',
    action: 'user.deactivated',
    actorId: 'u1',
    actorEmail: 'admin@acme.example.com',
    subjectUserId: 'u3',
    tenantId: 't1',
    timestamp: '2024-03-01T12:00:00Z',
    details: { email: 'pending@acme.example.com' },
  },
]
