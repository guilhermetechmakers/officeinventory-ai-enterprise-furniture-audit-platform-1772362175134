import { useCallback, useState } from 'react'
import { requestAccess } from '@/api/auth'
import { mapAuthError } from '@/lib/auth-error-mapper'
import type { RequestAccessPayload } from '@/types/auth'

export function useAccessRequest() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [requestId, setRequestId] = useState<string>('')
  const [status, setStatus] = useState<string>('')

  const submit = useCallback(async (payload: RequestAccessPayload) => {
    setIsLoading(true)
    setError('')
    setRequestId('')
    setStatus('')
    try {
      const res = await requestAccess(payload)
      setRequestId(res?.requestId ?? '')
      setStatus(res?.status ?? 'pending')
      return { success: true, requestId: res?.requestId, status: res?.status }
    } catch (err) {
      const msg = mapAuthError(err)
      setError(msg)
      return { success: false }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { submit, isLoading, error, requestId, status, setError }
}
