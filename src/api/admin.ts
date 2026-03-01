/** Admin API - internal endpoints, tenant isolation, mocked for MVP */

import { apiGet, apiPost, apiPut, apiPatch } from '@/lib/api'
import {
  mockTenants,
  mockUsers,
  mockRoles,
  mockSSOConfigs,
  mockHealthMetrics,
  mockHealthAlerts,
  mockBillingOverview,
  mockAuditLogs,
} from '@/data/admin-mocks'
import type {
  Tenant,
  CreateTenantInput,
  UpdateTenantInput,
  User,
  Role,
  CreateRoleInput,
  SSOConfig,
  Invoice,
  HealthOverview,
  BillingOverview,
  AuditLogEntry,
} from '@/types/admin'

const USE_MOCK = true // Toggle when backend is ready

function safeArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? data : []
}

function safeObject<T>(data: unknown, fallback: T): T {
  return data && typeof data === 'object' && !Array.isArray(data) ? (data as T) : fallback
}

// Tenants
export async function getTenants(): Promise<Tenant[]> {
  if (USE_MOCK) return [...mockTenants]
  const res = await apiGet<{ data?: Tenant[]; tenants?: Tenant[] }>('/admin/tenants')
  return safeArray<Tenant>(res?.data ?? res?.tenants) || mockTenants
}

export async function createTenant(input: CreateTenantInput): Promise<Tenant> {
  if (USE_MOCK) {
    const newTenant: Tenant = {
      id: `t${Date.now()}`,
      name: input.name,
      domain: input.domain,
      createdAt: new Date().toISOString(),
      settings: input.settings,
    }
    mockTenants.push(newTenant)
    return newTenant
  }
  const res = await apiPost<Tenant>('/admin/tenants', input)
  return safeObject(res, {} as Tenant)
}

export async function updateTenant(id: string, input: UpdateTenantInput): Promise<Tenant> {
  if (USE_MOCK) {
    const idx = mockTenants.findIndex((t) => t.id === id)
    if (idx >= 0) {
      mockTenants[idx] = { ...mockTenants[idx], ...input }
      return mockTenants[idx]
    }
    throw new Error('Tenant not found')
  }
  const res = await apiPut<Tenant>(`/admin/tenants/${id}`, input)
  return safeObject(res, {} as Tenant)
}

// Users
export async function getUsers(): Promise<User[]> {
  if (USE_MOCK) return [...mockUsers]
  const res = await apiGet<{ data?: User[]; users?: User[] }>('/admin/users')
  return safeArray<User>(res?.data ?? res?.users) || mockUsers
}

export async function inviteUser(payload: {
  email: string
  role: string
  tenantId: string
}): Promise<User> {
  if (USE_MOCK) {
    const newUser: User = {
      id: `u${Date.now()}`,
      email: payload.email,
      tenantId: payload.tenantId,
      isActive: false,
      roles: [payload.role],
      invitedAt: new Date().toISOString(),
    }
    mockUsers.push(newUser)
    return newUser
  }
  const res = await apiPost<User>('/admin/users/invite', payload)
  return safeObject(res, {} as User)
}

export async function activateUser(id: string): Promise<User> {
  if (USE_MOCK) {
    const u = mockUsers.find((x) => x.id === id)
    if (u) {
      u.isActive = true
      return u
    }
    throw new Error('User not found')
  }
  const res = await apiPatch<User>(`/admin/users/${id}/activate`, {})
  return safeObject(res, {} as User)
}

export async function deactivateUser(id: string): Promise<User> {
  if (USE_MOCK) {
    const u = mockUsers.find((x) => x.id === id)
    if (u) {
      u.isActive = false
      return u
    }
    throw new Error('User not found')
  }
  const res = await apiPatch<User>(`/admin/users/${id}/deactivate`, {})
  return safeObject(res, {} as User)
}

// Roles
export async function getRoles(): Promise<Role[]> {
  if (USE_MOCK) return [...mockRoles]
  const res = await apiGet<{ data?: Role[]; roles?: Role[] }>('/admin/roles')
  return safeArray<Role>(res?.data ?? res?.roles) || mockRoles
}

export async function createRole(input: CreateRoleInput): Promise<Role> {
  if (USE_MOCK) {
    const newRole: Role = {
      id: `r${Date.now()}`,
      name: input.name,
      permissions: input.permissions ?? [],
    }
    mockRoles.push(newRole)
    return newRole
  }
  const res = await apiPost<Role>('/admin/roles', input)
  return safeObject(res, {} as Role)
}

// SSO
export async function getSSOConfigs(): Promise<SSOConfig[]> {
  if (USE_MOCK) return [...mockSSOConfigs]
  const res = await apiGet<{ data?: SSOConfig[] }>('/admin/sso')
  return safeArray<SSOConfig>(res?.data) || mockSSOConfigs
}

export async function testSSOConnection(config: Partial<SSOConfig>): Promise<{ success: boolean; message?: string }> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800))
    return { success: true, message: 'Connection successful' }
  }
  const res = await apiPost<{ success: boolean; message?: string }>('/admin/sso/test', config)
  return safeObject(res, { success: false })
}

export async function updateSSOConfig(id: string, config: Partial<SSOConfig>): Promise<SSOConfig> {
  if (USE_MOCK) {
    const idx = mockSSOConfigs.findIndex((s) => s.id === id)
    if (idx >= 0) {
      mockSSOConfigs[idx] = { ...mockSSOConfigs[idx], ...config }
      return mockSSOConfigs[idx]
    }
    throw new Error('SSO config not found')
  }
  const res = await apiPut<SSOConfig>(`/admin/sso/${id}`, config)
  return safeObject(res, {} as SSOConfig)
}

// Health
export async function getHealthOverview(): Promise<HealthOverview> {
  if (USE_MOCK) {
    return {
      metrics: [...mockHealthMetrics],
      alerts: [...mockHealthAlerts],
    }
  }
  const res = await apiGet<HealthOverview>('/admin/health')
  return safeObject(res, { metrics: [], alerts: [] })
}

// Billing
export async function getBillingOverview(): Promise<BillingOverview> {
  if (USE_MOCK) return { ...mockBillingOverview }
  const res = await apiGet<BillingOverview>('/admin/billing')
  return safeObject(res, mockBillingOverview)
}

export async function getInvoices(): Promise<Invoice[]> {
  if (USE_MOCK) return [...mockBillingOverview.invoices]
  const res = await apiGet<{ data?: Invoice[]; invoices?: Invoice[] }>('/admin/billing/invoices')
  const list = safeArray<Invoice>(res?.data ?? res?.invoices)
  return list.length > 0 ? list : mockBillingOverview.invoices
}

// Audit
export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  if (USE_MOCK) return [...mockAuditLogs]
  const res = await apiGet<{ data?: AuditLogEntry[] }>('/admin/audit')
  return safeArray<AuditLogEntry>(res?.data) || mockAuditLogs
}
