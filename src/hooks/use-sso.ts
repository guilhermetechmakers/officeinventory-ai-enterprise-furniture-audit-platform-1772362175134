import { useCallback, useEffect, useState } from 'react'
import { getSSOProviders, ssoRedirect } from '@/api/auth'
import { mapAuthError } from '@/lib/auth-error-mapper'
import type { SSOProvider } from '@/types/auth'

export function useSSO(returnUrl?: string) {
  const [providers, setProviders] = useState<SSOProvider[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    let cancelled = false
    getSSOProviders()
      .then((list) => {
        if (!cancelled) {
          const items = Array.isArray(list) ? list : []
          setProviders(items ?? [])
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(mapAuthError(err))
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const initiateSSO = useCallback(
    async (providerId: string) => {
      setError('')
      try {
        const res = await ssoRedirect({
          providerId,
          returnUrl: returnUrl ?? window.location.origin + '/dashboard',
          state: crypto.randomUUID(),
        })
        const url = res?.redirectUrl
        if (url) {
          window.location.href = url
          return { success: true }
        }
        setError('No redirect URL returned')
        return { success: false }
      } catch (err) {
        const msg = mapAuthError(err)
        setError(msg)
        return { success: false }
      }
    },
    [returnUrl]
  )

  return { providers, isLoading, error, initiateSSO }
}
