import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthContext } from '@/contexts/auth-context'

interface RedirectHandlerProps {
  children: React.ReactNode
  fallbackPath?: string
}

/**
 * Handles post-auth redirect logic. When user is authenticated and a return URL
 * is present, redirects to that URL. Used within auth flows.
 */
export function RedirectHandler({ children, fallbackPath = '/dashboard' }: RedirectHandlerProps) {
  const { isAuthenticated } = useAuthContext()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (!isAuthenticated) return
    const returnUrl = searchParams.get('returnUrl') ?? searchParams.get('redirect')
    const target = returnUrl ?? fallbackPath
    if (target && target.startsWith('/') && !target.startsWith('//')) {
      navigate(target, { replace: true })
    }
  }, [isAuthenticated, searchParams, navigate, fallbackPath])

  if (isAuthenticated) return null
  return <>{children}</>
}
