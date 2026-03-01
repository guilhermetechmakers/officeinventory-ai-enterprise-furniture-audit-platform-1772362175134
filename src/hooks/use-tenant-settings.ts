/** React Query hooks for Tenant Settings & Preferences */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getTenantSettings,
  patchTenantSettings,
  patchExportSchema,
  importExportSchema,
  exportExportSchema,
  patchInferenceSettings,
  patchReviewSLA,
  patchStoragePolicies,
  getWebhooks,
  createWebhook,
  updateWebhook,
  deleteWebhook,
  testWebhook,
} from '@/api/tenant-settings'
import type {
  ExportSchema,
  InferenceSettings,
  ReviewSLASettings,
  StoragePolicies,
  CreateWebhookInput,
  UpdateWebhookInput,
} from '@/types/tenant-settings'

const QUERY_KEY = ['tenant-settings'] as const
const WEBHOOKS_KEY = ['tenant-settings', 'webhooks'] as const

export function useTenantSettings() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: getTenantSettings,
  })
}

export function usePatchTenantSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: patchTenantSettings,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Settings updated')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to update settings')
    },
  })
}

export function usePatchExportSchema() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (schema: Partial<ExportSchema>) => patchExportSchema(schema),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Export schema updated')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to update export schema')
    },
  })
}

export function useImportExportSchema() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: importExportSchema,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Export schema imported')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to import export schema')
    },
  })
}

export function useExportExportSchema() {
  return useMutation({
    mutationFn: () => exportExportSchema(),
    onSuccess: (data) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `export-schema-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Export schema downloaded')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to export schema')
    },
  })
}

export function usePatchInferenceSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (settings: Partial<InferenceSettings>) => patchInferenceSettings(settings),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Inference settings updated')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to update inference settings')
    },
  })
}

export function usePatchReviewSLA() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (settings: Partial<ReviewSLASettings>) => patchReviewSLA(settings),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Review SLA settings updated')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to update review SLA')
    },
  })
}

export function usePatchStoragePolicies() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (policies: Partial<StoragePolicies>) => patchStoragePolicies(policies),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Storage policies updated')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to update storage policies')
    },
  })
}

export function useWebhooks() {
  return useQuery({
    queryKey: WEBHOOKS_KEY,
    queryFn: getWebhooks,
  })
}

export function useCreateWebhook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateWebhookInput) => createWebhook(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      qc.invalidateQueries({ queryKey: WEBHOOKS_KEY })
      toast.success('Webhook created')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to create webhook')
    },
  })
}

export function useUpdateWebhook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateWebhookInput) => updateWebhook(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      qc.invalidateQueries({ queryKey: WEBHOOKS_KEY })
      toast.success('Webhook updated')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to update webhook')
    },
  })
}

export function useDeleteWebhook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (webhookId: string) => deleteWebhook(webhookId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      qc.invalidateQueries({ queryKey: WEBHOOKS_KEY })
      toast.success('Webhook deleted')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to delete webhook')
    },
  })
}

export function useTestWebhook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (webhookId: string) => testWebhook(webhookId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      qc.invalidateQueries({ queryKey: WEBHOOKS_KEY })
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Webhook test failed')
    },
  })
}
