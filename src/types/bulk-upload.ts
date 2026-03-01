/**
 * Bulk Upload Status - Data models for batch upload monitoring and AI inference
 */

export type BatchStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface Item {
  id: string
  batchId: string
  type: string
  confidence: number
  imageUrl?: string
  evidenceUrl?: string
}

export interface ErrorDetail {
  code: string
  message: string
  timestamp?: string
}

export interface Batch {
  id: string
  name: string
  site: string
  uploader: string
  uploadedAt: string
  status: BatchStatus
  progress: number
  items?: Item[]
  errors?: ErrorDetail[]
  imageUrls?: string[]
  inferenceStartedAt?: string
}

export interface BatchFilter {
  status?: string
  site?: string
  startDate?: string
  endDate?: string
  query?: string
}

export interface RetryBatchResponse {
  success: boolean
  batch?: Batch
}

export interface CancelBatchResponse {
  success: boolean
}
