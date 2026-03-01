/**
 * ToS Download Service - Generates and triggers PDF/text export of Terms of Service.
 * Safe handling of content transformation and encoding.
 */

import {
  TOS_CONTENT_SECTIONS,
  TOS_VERSION_NUMBER,
  TOS_EFFECTIVE_DATE,
} from '@/data/terms-of-service-content'
import { toSContentAsPlainText } from '@/api/terms-of-service'
import type { ToSSection } from '@/types/terms-of-service'

const TOS_FILENAME = 'OfficeInventory-AI-Terms-of-Service'

/**
 * Generates a downloadable text file from ToS content.
 * Uses client-side Blob when API PDF is unavailable.
 * Null-safe: sections defaults to static content if undefined.
 */
export function generateToSExport(sections?: ToSSection[] | null): Blob {
  const safeSections = Array.isArray(sections) ? sections : TOS_CONTENT_SECTIONS
  const header = `OfficeInventory AI - Terms of Service\nVersion ${TOS_VERSION_NUMBER}\nEffective Date: ${TOS_EFFECTIVE_DATE}\nLast Updated: ${TOS_EFFECTIVE_DATE}\n\n`
  const body = toSContentAsPlainText(safeSections)
  const fullText = header + body
  return new Blob([fullText], { type: 'text/plain;charset=utf-8' })
}

/**
 * Triggers download of ToS as text file.
 * Opens in new tab or triggers download based on browser support.
 */
export function downloadToSFile(sections?: ToSSection[] | null): void {
  const blob = generateToSExport(sections)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${TOS_FILENAME}.txt`
  a.rel = 'noopener noreferrer'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
