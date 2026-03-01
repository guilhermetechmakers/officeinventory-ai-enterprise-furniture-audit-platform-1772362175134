/**
 * Data models for Audit Detail page
 * Aligned with OfficeInventory AI platform architecture
 */

export interface AuditDetailLocation {
  clientName?: string
  siteName?: string
  floorName?: string
  roomName?: string
  zoneName?: string
}

export interface AuditDetail {
  id: string
  name: string
  clientId: string
  siteId: string
  floorId: string
  roomId?: string
  zoneId?: string
  ownerId: string
  ownerName?: string
  status: string
  startDate?: string
  endDate?: string
  location?: AuditDetailLocation
  items?: DetectedItem[]
}

export interface DetectedItem {
  id: string
  auditId: string
  category: string
  material?: string | null
  finish?: string | null
  condition?: string | null
  brandModel?: string | null
  confidence: number
  evidenceUrl?: string | null
  thumbnailUrl?: string | null
  sourceImageUrl?: string | null
  isDuplicate: boolean
  isException: boolean
  status: string
  detectedAt?: string
}

export interface ReviewTask {
  id: string
  auditId: string
  reviewerId?: string
  status: string
  dueAt?: string
  createdAt?: string
}

export interface AuditDetailFilters {
  minConfidence?: number
  maxConfidence?: number
  category?: string
  condition?: string
  onlyFlagged?: boolean
  sortBy?: 'confidence-desc' | 'confidence-asc' | 'category' | 'date'
}

export type DetectedItemStatus = 'suspect' | 'confirmed' | 'flagged'
