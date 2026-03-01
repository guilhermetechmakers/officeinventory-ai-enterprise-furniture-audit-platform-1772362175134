import { Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { UserPermissions } from '@/types/reports-exports'

export interface PermissionsIndicatorProps {
  permissions: UserPermissions
  children: React.ReactNode
  fallback?: React.ReactNode
  requirePermission?: keyof UserPermissions
  className?: string
}

/**
 * Wraps content and conditionally renders based on permissions.
 * When requirePermission is set, only renders children if that permission is true.
 */
export function PermissionsIndicator({
  permissions,
  children,
  fallback,
  requirePermission,
  className,
}: PermissionsIndicatorProps) {
  const hasPermission = requirePermission
    ? permissions?.[requirePermission] === true
    : true

  if (!hasPermission) {
    if (fallback) return <>{fallback}</>
    return (
      <div
        className={cn(
          'flex items-center gap-2 rounded-xl border border-border bg-muted/30 p-4 text-muted-foreground text-sm',
          className
        )}
      >
        <Shield className="h-4 w-4 shrink-0" />
        <span>You don't have permission to access this feature.</span>
      </div>
    )
  }

  return <>{children}</>
}
