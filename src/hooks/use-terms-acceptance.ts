/**
 * useTermsAcceptance - Manages whether terms are acknowledged per user/session.
 * Persists in localStorage; syncs with backend when acknowledgeToS is called.
 */

import { useState, useEffect, useCallback } from 'react'
import { acknowledgeToS } from '@/api/terms-of-service'

const STORAGE_KEY_PREFIX = 'officeinventory-tos-accepted-'

function getStorageKey(versionId: string): string {
  return `${STORAGE_KEY_PREFIX}${versionId}`
}

/**
 * Check if terms have been accepted for a given version.
 * Reads from localStorage.
 */
export function isTermsAccepted(versionId: string): boolean {
  if (!versionId) return false
  try {
    const stored = localStorage.getItem(getStorageKey(versionId))
    return stored === 'true'
  } catch {
    return false
  }
}

export interface UseTermsAcceptanceOptions {
  versionId: string
  userId?: string | null
  /** When true, show acceptance panel even if already accepted (e.g. for re-confirmation) */
  forceShow?: boolean
}

export interface UseTermsAcceptanceReturn {
  accepted: boolean
  setAccepted: (value: boolean) => void
  acceptTerms: () => Promise<boolean>
  isAccepted: () => boolean
}

/**
 * Hook to manage ToS acceptance state.
 * Persists to localStorage; optionally syncs with backend via acknowledgeToS.
 */
export function useTermsAcceptance({
  versionId,
  userId,
  forceShow = false,
}: UseTermsAcceptanceOptions): UseTermsAcceptanceReturn {
  const [accepted, setAcceptedState] = useState<boolean>(() =>
    forceShow ? false : isTermsAccepted(versionId)
  )

  useEffect(() => {
    if (!forceShow && versionId) {
      setAcceptedState(isTermsAccepted(versionId))
    }
  }, [versionId, forceShow])

  const setAccepted = useCallback(
    (value: boolean) => {
      setAcceptedState(value)
      if (value && versionId) {
        try {
          localStorage.setItem(getStorageKey(versionId), 'true')
        } catch {
          // Ignore storage errors
        }
      }
    },
    [versionId]
  )

  const acceptTerms = useCallback(async (): Promise<boolean> => {
    if (!versionId) return false
    try {
      if (userId) {
        const success = await acknowledgeToS(versionId, userId)
        if (success) {
          setAcceptedState(true)
          localStorage.setItem(getStorageKey(versionId), 'true')
          return true
        }
      }
      setAcceptedState(true)
      localStorage.setItem(getStorageKey(versionId), 'true')
      return true
    } catch {
      return false
    }
  }, [versionId, userId])

  const isAccepted = useCallback(() => isTermsAccepted(versionId), [versionId])

  return {
    accepted,
    setAccepted,
    acceptTerms,
    isAccepted,
  }
}
