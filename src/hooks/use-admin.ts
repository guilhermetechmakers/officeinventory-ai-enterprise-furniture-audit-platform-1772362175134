/** Admin Dashboard hooks - data fetching, mutations, null-safe */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as adminApi from '@/api/admin'
import type {
  CreateTenantInput,
  UpdateTenantInput,
  CreateRoleInput,
  SSOConfig,
} from '@/types/admin'

const adminKeys = {
  tenants: ['admin', 'tenants'] as const,
  users: ['admin', 'users'] as const,
  roles: ['admin', 'roles'] as const,
  sso: ['admin', 'sso'] as const,
  health: ['admin', 'health'] as const,
  billing: ['admin', 'billing'] as const,
  audit: ['admin', 'audit'] as const,
}

export function useTenants() {
  return useQuery({
    queryKey: adminKeys.tenants,
    queryFn: adminApi.getTenants,
    staleTime: 60_000,
  })
}

export function useCreateTenant() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateTenantInput) => adminApi.createTenant(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.tenants })
      toast.success('Tenant created successfully')
    },
    onError: (e: Error) => toast.error(e?.message ?? 'Failed to create tenant'),
  })
}

export function useUpdateTenant() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTenantInput }) =>
      adminApi.updateTenant(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.tenants })
      toast.success('Tenant updated successfully')
    },
    onError: (e: Error) => toast.error(e?.message ?? 'Failed to update tenant'),
  })
}

export function useUsers() {
  return useQuery({
    queryKey: adminKeys.users,
    queryFn: adminApi.getUsers,
    staleTime: 60_000,
  })
}

export function useInviteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { email: string; role: string; tenantId: string }) =>
      adminApi.inviteUser(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.users })
      toast.success('Invitation sent')
    },
    onError: (e: Error) => toast.error(e?.message ?? 'Failed to invite user'),
  })
}

export function useActivateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminApi.activateUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.users })
      toast.success('User activated')
    },
    onError: (e: Error) => toast.error(e?.message ?? 'Failed to activate user'),
  })
}

export function useDeactivateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminApi.deactivateUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.users })
      toast.success('User deactivated')
    },
    onError: (e: Error) => toast.error(e?.message ?? 'Failed to deactivate user'),
  })
}

export function useRoles() {
  return useQuery({
    queryKey: adminKeys.roles,
    queryFn: adminApi.getRoles,
    staleTime: 60_000,
  })
}

export function useCreateRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateRoleInput) => adminApi.createRole(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.roles })
      toast.success('Role created')
    },
    onError: (e: Error) => toast.error(e?.message ?? 'Failed to create role'),
  })
}

export function useSSOConfigs() {
  return useQuery({
    queryKey: adminKeys.sso,
    queryFn: adminApi.getSSOConfigs,
    staleTime: 60_000,
  })
}

export function useTestSSOConnection() {
  return useMutation({
    mutationFn: (config: Partial<SSOConfig>) => adminApi.testSSOConnection(config),
    onSuccess: (data) => {
      if (data?.success) toast.success(data.message ?? 'Connection successful')
      else toast.error(data?.message ?? 'Connection failed')
    },
    onError: (e: Error) => toast.error(e?.message ?? 'Connection test failed'),
  })
}

export function useUpdateSSOConfig() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, config }: { id: string; config: Partial<SSOConfig> }) =>
      adminApi.updateSSOConfig(id, config),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.sso })
      toast.success('SSO configuration updated')
    },
    onError: (e: Error) => toast.error(e?.message ?? 'Failed to update SSO'),
  })
}

export function useHealthOverview() {
  return useQuery({
    queryKey: adminKeys.health,
    queryFn: adminApi.getHealthOverview,
    staleTime: 30_000,
  })
}

export function useBillingOverview() {
  return useQuery({
    queryKey: adminKeys.billing,
    queryFn: adminApi.getBillingOverview,
    staleTime: 60_000,
  })
}

export function useAuditLogs() {
  return useQuery({
    queryKey: adminKeys.audit,
    queryFn: adminApi.getAuditLogs,
    staleTime: 30_000,
  })
}
