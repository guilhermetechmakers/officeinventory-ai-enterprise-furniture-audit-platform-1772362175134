/**
 * ToSContentLoader - Fetches ToS content from API or CMS.
 * Fallback to static default content. Validation with Array.isArray checks.
 */

import { useState, useEffect } from 'react'
import { fetchCurrentToS, fetchToSHistory } from '@/api/terms-of-service'
import type { ToSContent, ToSVersionHistoryItem } from '@/types/terms-of-service'

export interface ToSContentLoaderResult {
  content: ToSContent | null
  history: ToSVersionHistoryItem[]
  isLoading: boolean
  hasError: boolean
}

export interface ToSContentLoaderOptions {
  /** Optional CMS slug or version ID to fetch specific version */
  versionId?: string
}

/**
 * Hook to load ToS content. Returns content, history, loading and error state.
 * Null-safe: contentSections always validated as array.
 */
export function useToSContentLoader(
  _options?: ToSContentLoaderOptions
): ToSContentLoaderResult {
  const [content, setContent] = useState<ToSContent | null>(null)
  const [history, setHistory] = useState<ToSVersionHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    Promise.all([fetchCurrentToS(), fetchToSHistory()])
      .then(([tosContent, historyItems]) => {
        const sections = Array.isArray(tosContent?.contentSections)
          ? tosContent.contentSections
          : []
        setContent({
          ...tosContent,
          contentSections: sections,
        })
        setHistory(Array.isArray(historyItems) ? historyItems : [])
        setHasError(false)
      })
      .catch(() => {
        setContent(null)
        setHistory([])
        setHasError(true)
      })
      .finally(() => setIsLoading(false))
  }, [])

  return {
    content,
    history,
    isLoading,
    hasError,
  }
}
