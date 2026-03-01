import { useCallback, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { acceptInvitation, validateInvitation } from '@/api/auth'
import { useAuthContext } from '@/contexts/auth-context'
import { mapAuthError } from '@/lib/auth-error-mapper'
import type { Invitation } from '@/types/auth'

export function useInvitation() {
  const [searchParams] = useSearchParams()
  const { setUser } = useAuthContext()
  const [invitation, setInvitation] = useState<Invitation | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [isAccepting, setIsAccepting] = useState(false)
  const [error, setError] = useState<string>('')

  const invitationId = searchParams.get('invitation') ?? searchParams.get('invitationId') ?? ''
  const invitationEmail = searchParams.get('email') ?? ''

  const checkInvitation = useCallback(async () => {
    if (!invitationId) return
    setIsValidating(true)
    setError('')
    try {
      const res = await validateInvitation({
        invitationId,
        email: invitationEmail || '',
      })
      if (res?.invited && res?.invitationData) {
        setInvitation(res.invitationData)
      } else {
        setInvitation(null)
      }
    } catch (err) {
      setError(mapAuthError(err))
      setInvitation(null)
    } finally {
      setIsValidating(false)
    }
  }, [invitationId, invitationEmail])

  const accept = useCallback(
    async (userDetails: { name?: string; password?: string }) => {
      if (!invitationId) return { success: false }
      setIsAccepting(true)
      setError('')
      try {
        const res = await acceptInvitation({
          invitationId,
          userDetails,
        })
        if (res?.user?.id) {
          setUser(res.user)
          return { success: true }
        }
        setError('Invalid response')
        return { success: false }
      } catch (err) {
        const msg = mapAuthError(err)
        setError(msg)
        return { success: false }
      } finally {
        setIsAccepting(false)
      }
    },
    [invitationId, setUser]
  )

  return {
    invitationId,
    invitationEmail,
    invitation,
    isValidating,
    isAccepting,
    error,
    checkInvitation,
    accept,
    setError,
  }
}
