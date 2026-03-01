/** Mock data for Tenant Settings & Preferences - no external APIs */

import type {
  TenantSettings,
  ExportSchema,
  InferenceSettings,
  ReviewSLASettings,
  StoragePolicies,
  Webhook,
} from '@/types/tenant-settings'

const defaultExportFields = [
  { id: 'f1', key: 'item_id', label: 'Item ID', type: 'string' as const, enabled: true, order: 0 },
  { id: 'f2', key: 'type', label: 'Type', type: 'string' as const, enabled: true, order: 1 },
  { id: 'f3', key: 'condition', label: 'Condition', type: 'string' as const, enabled: true, order: 2 },
  { id: 'f4', key: 'location', label: 'Location', type: 'string' as const, enabled: true, order: 3 },
  { id: 'f5', key: 'confidence', label: 'Confidence', type: 'number' as const, enabled: true, order: 4 },
  { id: 'f6', key: 'detected_at', label: 'Detected At', type: 'date' as const, enabled: true, order: 5 },
]

export const mockExportSchema: ExportSchema = {
  schemaId: 'schema-default',
  tenantId: 't1',
  fields: [...defaultExportFields],
  enabled: true,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-03-01T12:00:00Z',
}

export const mockInferenceSettings: InferenceSettings = {
  tenantId: 't1',
  threshold: 0.85,
  autoAccept: true,
  maxAutoAcceptPerBatch: 50,
  queueLowConfidence: true,
  updatedAt: '2024-03-01T12:00:00Z',
}

export const mockReviewSLASettings: ReviewSLASettings = {
  tenantId: 't1',
  rules: [
    { id: 'r1', condition: 'confidence < 0.7', reviewerPoolId: 'pool-qa', priority: 1 },
    { id: 'r2', condition: 'type = "chair"', reviewerPoolId: 'pool-furniture', priority: 2 },
  ],
  escalationTimes: [
    { hours: 4, action: 'notify' },
    { hours: 24, action: 'reassign' },
    { hours: 72, action: 'escalate' },
  ],
  defaultReviewerPoolId: 'pool-default',
  slaHours: 48,
  updatedAt: '2024-03-01T12:00:00Z',
}

export const mockStoragePolicies: StoragePolicies = {
  tenantId: 't1',
  policies: [
    { id: 'p1', type: 'images', retentionDays: 365, archiveAfterDays: 90, purgeAfterDays: 730 },
    { id: 'p2', type: 'reports', retentionDays: 180, archiveAfterDays: 30, purgeAfterDays: 365 },
    { id: 'p3', type: 'logs', retentionDays: 90, archiveAfterDays: 14, purgeAfterDays: 180 },
  ],
  updatedAt: '2024-03-01T12:00:00Z',
}

export const mockWebhooks: Webhook[] = [
  {
    webhookId: 'wh1',
    tenantId: 't1',
    name: 'Audit Events',
    url: 'https://api.example.com/webhooks/audits',
    method: 'POST',
    authType: 'bearer',
    secretMasked: '••••••••••••',
    enabled: true,
    retryPolicyJson: { maxAttempts: 3, backoffMs: 1000, timeoutMs: 10000 },
    lastTestStatus: 'success',
    lastTestAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
  },
  {
    webhookId: 'wh2',
    tenantId: 't1',
    name: 'Review Completed',
    url: 'https://hooks.slack.com/services/xxx',
    method: 'POST',
    authType: 'header',
    secretMasked: '••••••••',
    enabled: false,
    retryPolicyJson: { maxAttempts: 5, backoffMs: 2000, timeoutMs: 5000 },
    lastTestStatus: 'failure',
    lastTestAt: '2024-03-10T14:00:00Z',
    updatedAt: '2024-03-10T14:00:00Z',
  },
]

export const mockTenantSettings: TenantSettings = {
  tenantId: 't1',
  exportSchema: mockExportSchema,
  inferenceSettings: mockInferenceSettings,
  reviewSla: mockReviewSLASettings,
  storagePolicies: mockStoragePolicies,
  webhooks: mockWebhooks,
  updatedAt: '2024-03-15T12:00:00Z',
  version: 3,
}
