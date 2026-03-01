/**
 * Data models for Item Detail & Evidence page
 * Aligned with OfficeInventory AI platform architecture
 */

export interface SourceImage {
  id: string
  url: string
  thumbnailUrl: string
}

export interface ItemAttributes {
  category?: string
  subtype?: string
  material?: string
  finish?: string
  brandModel?: string
  condition?: string
  notes?: string
}

export interface ConfidenceVersion {
  versionId: string
  score: number
  changedAt: string
  changedBy: string
  notes?: string
}

export interface EditRecord {
  field: string
  from?: unknown
  to?: unknown
  changedAt?: string
  changedBy?: string
}

export interface ActivityLogEntry {
  id: string
  actor: string
  action: string
  timestamp: string
  changes?: Record<string, unknown>
}

export interface ItemDetail {
  id: string
  auditId: string
  croppedDetectionImageUrl: string | null
  sourceImages: SourceImage[]
  attributes: ItemAttributes | null
  confidenceHistory: ConfidenceVersion[]
  edits: EditRecord[]
  activityLog: ActivityLogEntry[]
  status?: string
  isDuplicate?: boolean
  isException?: boolean
  confirmedAt?: string | null
  detectedAt?: string
}

export interface MergeCandidate {
  id: string
  category?: string
  confidence?: number
  thumbnailUrl?: string | null
  similarity?: number
  similarityScore?: number
}
