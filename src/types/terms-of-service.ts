/**
 * Terms of Service data models and API response types.
 * Used for versioned ToS content, sections, and acceptance tracking.
 */

export interface ToSSection {
  id: string
  title: string
  body: string
  subsections?: ToSSection[]
}

export interface ToSVersion {
  id: string
  versionNumber: string
  effectiveDate: string
  contentSections: ToSSection[]
  isActive: boolean
  summary?: string
}

export interface ToSContent {
  versionId: string
  versionNumber: string
  effectiveDate: string
  contentSections: ToSSection[]
}

export interface ToSVersionHistoryItem {
  versionId: string
  versionNumber: string
  effectiveDate: string
  summary?: string
}

export interface ToSAcknowledgement {
  id: string
  userId: string
  tosVersionId: string
  acceptedAt: string
}
