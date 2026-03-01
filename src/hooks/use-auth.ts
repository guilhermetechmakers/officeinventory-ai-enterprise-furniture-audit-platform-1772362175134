import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { login } from '@/api/auth'
import { useAuthContext } from '@/contexts/auth-context'
import { mapAuthError } from '@/lib/auth-error-mapper'
import type { LoginRequest } from '@/types/auth'

export function useAuth() {
  const { setUser } = useAuthContext()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const signIn = useCallback(
    async (payload: LoginRequest, returnUrl?: string) => {
      setIsLoading(true)
      setError('')
      try {
        const res = await login(payload)
        const user = res?.user
        if (user?.id) {
          setUser(user)
          const redirectTo = res?.redirectTo ?? returnUrl ?? '/dashboard'
          navigate(redirectTo, { replace: true })
          toast.success('Signed in successfully')
          return { success: true }
        }
        setError('Invalid response from server')
        return { success: false }
      } catch (err) {
        const msg = mapAuthError(err)
        setError(msg)
        toast.error(msg)
        return { success: false }
      } finally {
        setIsLoading(false)
      }
    },
    [setUser, navigate]
  )

  return { signIn, isLoading, error, setError }
}
