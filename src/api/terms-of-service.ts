/**
 * Terms of Service API - content, PDF export, acknowledgement.
 * Uses native fetch via apiGet/apiPost. Falls back to static content when API unavailable.
 */

import { apiGet, apiPost } from '@/lib/api'
import {
  TOS_CONTENT_SECTIONS,
  TOS_VERSION_NUMBER,
  TOS_EFFECTIVE_DATE,
  TOS_VERSION_ID,
} from '@/data/terms-of-service-content'
import type {
  ToSContent,
  ToSSection,
  ToSVersionHistoryItem,
} from '@/types/terms-of-service'

/** Ensure sections is a valid array; null-safe fallback */
function ensureSections(sections: unknown): ToSSection[] {
  return Array.isArray(sections) ? sections : TOS_CONTENT_SECTIONS
}

/**
 * GET /tos/current
 * Returns current ToS content. Falls back to static content on failure.
 */
export async function fetchCurrentToS(): Promise<ToSContent> {
  try {
    const res = await apiGet<{
      versionId?: string
      versionNumber?: string
      effectiveDate?: string
      contentSections?: ToSSection[]
    }>('/tos/current')

    const sections = ensureSections(res?.contentSections ?? TOS_CONTENT_SECTIONS)
    return {
      versionId: res?.versionId ?? TOS_VERSION_ID,
      versionNumber: res?.versionNumber ?? TOS_VERSION_NUMBER,
      effectiveDate: res?.effectiveDate ?? TOS_EFFECTIVE_DATE,
      contentSections: sections,
    }
  } catch {
    return {
      versionId: TOS_VERSION_ID,
      versionNumber: TOS_VERSION_NUMBER,
      effectiveDate: TOS_EFFECTIVE_DATE,
      contentSections: TOS_CONTENT_SECTIONS,
    }
  }
}

/**
 * GET /tos/history
 * Returns version history. Falls back to current version only on failure.
 */
export async function fetchToSHistory(): Promise<ToSVersionHistoryItem[]> {
  try {
    const res = await apiGet<ToSVersionHistoryItem[] | { items?: ToSVersionHistoryItem[] }>(
      '/tos/history'
    )
    const items = Array.isArray(res)
      ? res
      : Array.isArray((res as { items?: ToSVersionHistoryItem[] })?.items)
        ? (res as { items: ToSVersionHistoryItem[] }).items
        : []
    if (items.length > 0) return items
  } catch {
    // Fall through to fallback
  }
  return [
    {
      versionId: TOS_VERSION_ID,
      versionNumber: TOS_VERSION_NUMBER,
      effectiveDate: TOS_EFFECTIVE_DATE,
      summary: 'Initial release',
    },
  ]
}

/**
 * POST /tos/acknowledge
 * Records user acceptance of ToS. Requires authenticated user.
 */
export async function acknowledgeToS(versionId: string, userId: string): Promise<boolean> {
  try {
    await apiPost<{ success?: boolean }>('/tos/acknowledge', { versionId, userId })
    return true
  } catch {
    return false
  }
}

/**
 * Export ToS as downloadable text/PDF-like file.
 * Client-side fallback when API unavailable.
 */
export function toSContentAsPlainText(sections: ToSSection[]): string {
  const safeSections = sections ?? []
  return safeSections
    .map((s) => {
      let text = `${s.title}\n${s.body}\n`
      const subs = s.subsections ?? []
      subs.forEach((sub) => {
        text += `  ${sub.title}\n  ${sub.body}\n`
      })
      return text
    })
    .join('\n\n')
}
