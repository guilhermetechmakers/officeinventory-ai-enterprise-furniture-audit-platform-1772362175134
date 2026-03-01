import type { ReactNode } from 'react'
import { useUserRole } from '@/hooks/use-user-role'
import type { UserRole } from '@/types/dashboard'

interface RoleGuardProps {
  /** Roles that can see the content */
  roles: UserRole[]
  /** Content to render when user has one of the allowed roles */
  children: ReactNode
  /** Optional fallback when role doesn't match (default: null) */
  fallback?: ReactNode
}

/** Conditionally render content based on user role */
export function RoleGuard({ roles, children, fallback = null }: RoleGuardProps) {
  const userRole = useUserRole()
  const allowed = Array.isArray(roles) ? roles : []
  const hasAccess = allowed.includes(userRole)
  return hasAccess ? <>{children}</> : <>{fallback}</>
}
