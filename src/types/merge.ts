/**
 * Data models for Merge & Duplicate Resolution
 * Aligned with OfficeInventory AI platform architecture
 */

export interface Group {
  id: string
  similarityScore: number
  itemIds: string[]
  previewAssets?: Array<{ itemId: string; thumbnailUrl: string }>
}

export interface EvidenceItem {
  id: string
  itemId: string
  imageUrl: string
  croppedUrl?: string
  metadata?: Record<string, unknown>
}

export interface CanonicalItem {
  id: string
  attributes: Record<string, unknown>
  sourceItemIds: string[]
  mergedAt?: string
  auditNote?: string
}

export interface LogEntry {
  id: string
  action: string
  mergeId?: string
  itemsAffected: string[]
  note?: string
  userId: string
  timestamp: string
}

export interface AttributeSchemaField {
  key: string
  label: string
  type: 'text' | 'select'
  options?: string[]
  required?: boolean
}

export interface MergePayload {
  canonicalItemId: string
  mergedAttributes: Record<string, unknown>
  evidenceReferences: string[]
  auditNote: string
  sourceGroupIds: string[]
}
