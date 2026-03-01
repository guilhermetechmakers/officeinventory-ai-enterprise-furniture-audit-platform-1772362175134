/**
 * Privacy Policy API - policy content, PDF export, DPA link.
 * Uses native fetch via apiGet/apiPost. Falls back to mock data when API unavailable.
 */

import { apiGet, apiPost } from '@/lib/api'
import {
  PRIVACY_POLICY_SECTIONS,
  PRIVACY_POLICY_VERSION,
  PRIVACY_POLICY_LAST_UPDATED,
} from '@/data/privacy-policy-content'
import type {
  Policy,
  PolicySection,
  ExportPdfResponse,
  DpaLinkResponse,
} from '@/types/privacy-policy'

/** Ensure sections is a valid array; null-safe fallback */
function ensureSections(sections: unknown): PolicySection[] {
  return Array.isArray(sections) ? sections : PRIVACY_POLICY_SECTIONS
}

/**
 * GET /policies/privacy/latest
 * Returns versioned policy content. Falls back to static content on failure.
 */
export async function fetchLatestPolicy(): Promise<Policy> {
  try {
    const res = await apiGet<{
      version?: string
      lastUpdated?: string
      sections?: PolicySection[]
      summary?: string
    }>('/policies/privacy/latest')

    const sections = ensureSections(res?.sections ?? PRIVACY_POLICY_SECTIONS)
    return {
      version: res?.version ?? PRIVACY_POLICY_VERSION,
      lastUpdated: res?.lastUpdated ?? PRIVACY_POLICY_LAST_UPDATED,
      sections,
      summary: res?.summary,
    }
  } catch {
    return {
      version: PRIVACY_POLICY_VERSION,
      lastUpdated: PRIVACY_POLICY_LAST_UPDATED,
      sections: PRIVACY_POLICY_SECTIONS,
    }
  }
}

/**
 * POST /policies/privacy/export-pdf
 * Returns { url: string } or blob for download. Simulates client-side PDF when API unavailable.
 */
export async function exportPolicyPdf(): Promise<{ url: string } | { blob: Blob }> {
  try {
    const res = await apiPost<ExportPdfResponse>('/policies/privacy/export-pdf', {
      format: 'pdf',
    })

    if (res?.url) {
      return { url: res.url }
    }
    if (res?.blob) {
      return { blob: res.blob }
    }
  } catch {
    // Fall through to client-side fallback
  }

  // Client-side fallback: create a simple text-based PDF-like download
  const policyText = `OfficeInventory AI Privacy Policy\nVersion ${PRIVACY_POLICY_VERSION}\nLast Updated: ${PRIVACY_POLICY_LAST_UPDATED}\n\n${privacyPolicyAsPlainText()}`
  const blob = new Blob([policyText], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  return { url }
}

function privacyPolicyAsPlainText(): string {
  const sections = PRIVACY_POLICY_SECTIONS ?? []
  return sections
    .map((s) => {
      let text = `${s.title}\n${s.body}\n`
      const subs = s.subsections ?? []
      subs.forEach((sub) => {
        text += `  ${sub.title}\n  ${sub.body}\n`
      })
      return text
    })
    .join('\n')
}

/**
 * GET /policies/privacy/dpa-link
 * Returns URL to Data Processing Addendum for enterprise customers.
 */
export async function fetchDpaLink(): Promise<string> {
  try {
    const res = await apiGet<DpaLinkResponse>('/policies/privacy/dpa-link')
    return res?.url ?? '/dpa'
  } catch {
    return '/dpa'
  }
}
