/** Tenant Settings API - export schemas, inference, review SLA, storage, webhooks */

import { apiGet, apiPatch, apiPost, apiDelete } from '@/lib/api'
import {
  mockTenantSettings,
  mockExportSchema,
  mockInferenceSettings,
  mockReviewSLASettings,
  mockStoragePolicies,
  mockWebhooks,
} from '@/data/tenant-settings-mocks'
import type {
  TenantSettings,
  ExportSchema,
  InferenceSettings,
  ReviewSLASettings,
  StoragePolicies,
  Webhook,
  CreateWebhookInput,
  UpdateWebhookInput,
  WebhookTestResult,
} from '@/types/tenant-settings'

const USE_MOCK = true

function safeArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? data : []
}

function safeObject<T>(data: unknown, fallback: T): T {
  return data && typeof data === 'object' && !Array.isArray(data) ? (data as T) : fallback
}

/** GET /api/tenant/settings */
export async function getTenantSettings(): Promise<TenantSettings> {
  if (USE_MOCK) return { ...mockTenantSettings }
  const res = await apiGet<TenantSettings>('/tenant/settings')
  return safeObject(res, mockTenantSettings)
}

/** PATCH /api/tenant/settings (partial updates) */
export async function patchTenantSettings(
  payload: Partial<Pick<TenantSettings, 'exportSchema' | 'inferenceSettings' | 'reviewSla' | 'storagePolicies'>>
): Promise<TenantSettings> {
  if (USE_MOCK) {
    return {
      ...mockTenantSettings,
      ...payload,
      updatedAt: new Date().toISOString(),
      version: (mockTenantSettings.version ?? 0) + 1,
    }
  }
  const res = await apiPatch<TenantSettings>('/tenant/settings', payload)
  return safeObject(res, mockTenantSettings)
}

/** PATCH /api/tenant/export-schemas */
export async function patchExportSchema(schema: Partial<ExportSchema>): Promise<ExportSchema> {
  if (USE_MOCK) {
    const merged = { ...mockExportSchema, ...schema, updatedAt: new Date().toISOString() }
    mockTenantSettings.exportSchema = merged
    return merged
  }
  const res = await apiPatch<ExportSchema>('/tenant/export-schemas', schema)
  return safeObject(res, mockExportSchema)
}

/** POST /api/tenant/export-schemas/import */
export async function importExportSchema(payload: { schema: ExportSchema }): Promise<ExportSchema> {
  if (USE_MOCK) {
    const imported = { ...payload.schema, updatedAt: new Date().toISOString() }
    mockTenantSettings.exportSchema = imported
    return imported
  }
  const res = await apiPost<ExportSchema>('/tenant/export-schemas/import', payload)
  return safeObject(res, mockExportSchema)
}

/** GET /api/tenant/export-schemas/export */
export async function exportExportSchema(): Promise<ExportSchema> {
  if (USE_MOCK) return { ...mockExportSchema }
  const res = await apiGet<ExportSchema>('/tenant/export-schemas/export')
  return safeObject(res, mockExportSchema)
}

/** PATCH /api/tenant/inference-settings */
export async function patchInferenceSettings(settings: Partial<InferenceSettings>): Promise<InferenceSettings> {
  if (USE_MOCK) {
    const merged = { ...mockInferenceSettings, ...settings, updatedAt: new Date().toISOString() }
    mockTenantSettings.inferenceSettings = merged
    return merged
  }
  const res = await apiPatch<InferenceSettings>('/tenant/inference-settings', settings)
  return safeObject(res, mockInferenceSettings)
}

/** PATCH /api/tenant/review-sla */
export async function patchReviewSLA(settings: Partial<ReviewSLASettings>): Promise<ReviewSLASettings> {
  if (USE_MOCK) {
    const merged = { ...mockReviewSLASettings, ...settings, updatedAt: new Date().toISOString() }
    mockTenantSettings.reviewSla = merged
    return merged
  }
  const res = await apiPatch<ReviewSLASettings>('/tenant/review-sla', settings)
  return safeObject(res, mockReviewSLASettings)
}

/** PATCH /api/tenant/storage-policies */
export async function patchStoragePolicies(policies: Partial<StoragePolicies>): Promise<StoragePolicies> {
  if (USE_MOCK) {
    const merged = { ...mockStoragePolicies, ...policies, updatedAt: new Date().toISOString() }
    mockTenantSettings.storagePolicies = merged
    return merged
  }
  const res = await apiPatch<StoragePolicies>('/tenant/storage-policies', policies)
  return safeObject(res, mockStoragePolicies)
}

/** GET /api/tenant/webhooks (via settings) */
export async function getWebhooks(): Promise<Webhook[]> {
  if (USE_MOCK) return [...mockWebhooks]
  const res = await apiGet<{ data?: Webhook[]; webhooks?: Webhook[] }>('/tenant/webhooks')
  return safeArray<Webhook>(res?.data ?? res?.webhooks) ?? mockWebhooks
}

/** POST /api/tenant/webhooks */
export async function createWebhook(input: CreateWebhookInput): Promise<Webhook> {
  if (USE_MOCK) {
    const newWebhook: Webhook = {
      webhookId: `wh${Date.now()}`,
      tenantId: 't1',
      name: input.name,
      url: input.url,
      method: input.method ?? 'POST',
      authType: input.authType ?? 'none',
      secretMasked: input.secret ? '••••••••' : undefined,
      enabled: input.enabled ?? true,
      retryPolicyJson: input.retryPolicy,
      lastTestStatus: null,
      lastTestAt: null,
      updatedAt: new Date().toISOString(),
    }
    mockWebhooks.push(newWebhook)
    mockTenantSettings.webhooks = [...mockWebhooks]
    return newWebhook
  }
  const res = await apiPost<Webhook>('/tenant/webhooks', input)
  return safeObject(res, {} as Webhook)
}

/** PUT /api/tenant/webhooks/{id} */
export async function updateWebhook(input: UpdateWebhookInput): Promise<Webhook> {
  if (USE_MOCK) {
    const idx = mockWebhooks.findIndex((w) => w.webhookId === input.webhookId)
    if (idx >= 0) {
      const { webhookId: _id, secret, retryPolicy, ...rest } = input
      const updated: Webhook = {
        ...mockWebhooks[idx],
        ...rest,
        retryPolicyJson: retryPolicy ?? mockWebhooks[idx].retryPolicyJson,
        secretMasked: secret !== undefined ? (secret ? '••••••••' : undefined) : mockWebhooks[idx].secretMasked,
        updatedAt: new Date().toISOString(),
      }
      mockWebhooks[idx] = updated
      mockTenantSettings.webhooks = [...mockWebhooks]
      return updated
    }
    throw new Error('Webhook not found')
  }
  const res = await apiPatch<Webhook>(`/tenant/webhooks/${input.webhookId}`, input)
  return safeObject(res, {} as Webhook)
}

/** DELETE /api/tenant/webhooks/{id} */
export async function deleteWebhook(webhookId: string): Promise<void> {
  if (USE_MOCK) {
    const idx = mockWebhooks.findIndex((w) => w.webhookId === webhookId)
    if (idx >= 0) {
      mockWebhooks.splice(idx, 1)
      mockTenantSettings.webhooks = [...mockWebhooks]
    }
    return
  }
  await apiDelete(`/tenant/webhooks/${webhookId}`)
}

/** POST /api/tenant/webhooks/{id}/test */
export async function testWebhook(webhookId: string): Promise<WebhookTestResult> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800))
    const wh = mockWebhooks.find((w) => w.webhookId === webhookId)
    if (wh) {
      wh.lastTestStatus = 'success'
      wh.lastTestAt = new Date().toISOString()
    }
    return { success: true, statusCode: 200, durationMs: 120 }
  }
  const res = await apiPost<WebhookTestResult>(`/tenant/webhooks/${webhookId}/test`, {})
  return safeObject(res, { success: false })
}
