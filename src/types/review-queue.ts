/**
 * Review Queue types - AI-detected items needing human validation
 */

export type ReviewItemStatus =
  | 'lowConfidence'
  | 'exception'
  | 'duplicate'
  | 'inReview'
  | 'approved'

export interface SiteContext {
  clientId?: string
  siteId?: string
  location?: string
  auditId?: string
}

export interface ReviewItem {
  id: string
  aiItemId: string
  type: string
  attributes: Record<string, unknown>
  confidence: number
  siteContext: SiteContext
  imageUrl?: string
  evidenceUrls?: string[]
  status: ReviewItemStatus
  assignedTo?: string
  reviewerNotes?: string
  createdAt: string
  updatedAt: string
}

export interface Assignment {
  id: string
  itemIds: string[]
  assigneeId: string
  teamId?: string
  slaNotes?: string
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export interface ReviewLog {
  id: string
  itemId: string
  action: string
  actorId: string
  timestamp: string
  details?: string
}

export type ReviewQueueTab = 'low' | 'exceptions' | 'duplicates' | 'assigned'

export interface ReviewQueueFilters {
  minConfidence?: number
  maxConfidence?: number
  siteId?: string
  location?: string
  status?: ReviewItemStatus
  assignedTo?: string
}

export interface ReviewQueueResponse {
  items: ReviewItem[]
  total: number
  page: number
  pageSize: number
}

export interface ReviewQueueMetrics {
  itemsPerHour: number
  avgReviewTimeMinutes: number
  totalReviewed: number
  lowConfidenceCount: number
  exceptionsCount: number
  duplicatesCount: number
  assignedToMeCount: number
}
