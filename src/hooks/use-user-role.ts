import { useMemo } from 'react'
import { useAuthContext } from '@/contexts/auth-context'
import type { UserRole } from '@/types/dashboard'

const ROLE_MAP: Record<string, UserRole> = {
  admin: 'admin',
  reviewer: 'reviewer',
  field_user: 'field_user',
  field: 'field_user',
}

/** Derive primary role from user.roles array */
export function useUserRole(): UserRole {
  const { user } = useAuthContext()
  return useMemo(() => {
    const roles = user?.roles ?? []
    if (!Array.isArray(roles)) return 'field_user'
    for (const r of roles) {
      const role = typeof r === 'string' ? ROLE_MAP[r.toLowerCase()] ?? r : undefined
      if (role === 'admin') return 'admin'
      if (role === 'reviewer') return 'reviewer'
      if (role === 'field_user' || role === 'field') return 'field_user'
    }
    return 'field_user'
  }, [user?.roles])
}

/** Check if user has at least one of the given roles */
export function useHasRole(allowedRoles: UserRole[]): boolean {
  const role = useUserRole()
  return useMemo(() => allowedRoles.includes(role), [role, allowedRoles])
}
