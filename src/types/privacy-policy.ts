/**
 * Privacy Policy data models and API response types.
 * Used for versioned policy content, sections, and metadata.
 */

export interface PolicySection {
  id: string
  title: string
  body: string
  subsections?: PolicySection[]
}

export interface VersionInfo {
  version: string
  lastUpdated: string
  reviewer?: string
}

export interface Policy {
  version: string
  lastUpdated: string
  sections: PolicySection[]
  summary?: string
}

export interface ExportPdfResponse {
  url?: string
  blob?: Blob
}

export interface DpaLinkResponse {
  url: string
}
