/** Tenant Settings & Preferences - data models for tenant-scoped policies */

export interface ExportSchemaField {
  id: string
  key: string
  label: string
  type: 'string' | 'number' | 'boolean' | 'date'
  enabled: boolean
  order: number
}

export interface ExportSchema {
  schemaId: string
  tenantId: string
  fields: ExportSchemaField[]
  enabled: boolean
  createdAt?: string
  updatedAt?: string
}

export interface InferenceSettings {
  tenantId?: string
  threshold: number
  autoAccept: boolean
  maxAutoAcceptPerBatch: number
  queueLowConfidence: boolean
  updatedAt?: string
}

export interface AutoAssignRule {
  id: string
  condition: string
  reviewerPoolId: string
  priority: number
}

export interface EscalationTimeline {
  hours: number
  action: 'notify' | 'reassign' | 'escalate'
}

export interface ReviewSLASettings {
  tenantId?: string
  rules: AutoAssignRule[]
  escalationTimes: EscalationTimeline[]
  defaultReviewerPoolId: string | null
  slaHours: number
  updatedAt?: string
}

export interface LifecycleTier {
  id: string
  type: 'images' | 'reports' | 'logs'
  retentionDays: number
  archiveAfterDays: number
  purgeAfterDays: number
}

export interface StoragePolicies {
  tenantId?: string
  policies: LifecycleTier[]
  updatedAt?: string
}

export interface RetryPolicy {
  maxAttempts: number
  backoffMs: number
  timeoutMs: number
}

export interface Webhook {
  webhookId: string
  tenantId: string
  name: string
  url: string
  method: 'POST' | 'PUT'
  headersJson?: Record<string, string>
  authType: 'none' | 'bearer' | 'header' | 'hmac'
  secretMasked?: string
  enabled: boolean
  retryPolicyJson?: RetryPolicy
  lastTestStatus?: 'success' | 'failure' | 'pending' | null
  lastTestAt?: string | null
  updatedAt?: string
}

export interface TenantSettings {
  tenantId: string
  exportSchema?: ExportSchema
  inferenceSettings?: InferenceSettings
  reviewSla?: ReviewSLASettings
  storagePolicies?: StoragePolicies
  webhooks?: Webhook[]
  updatedAt?: string
  version?: number
}

export interface CreateWebhookInput {
  name: string
  url: string
  method?: 'POST' | 'PUT'
  headers?: Record<string, string>
  authType?: 'none' | 'bearer' | 'header' | 'hmac'
  secret?: string
  enabled?: boolean
  retryPolicy?: RetryPolicy
}

export interface UpdateWebhookInput extends Partial<CreateWebhookInput> {
  webhookId: string
}

export interface WebhookTestResult {
  success: boolean
  statusCode?: number
  message?: string
  durationMs?: number
}
