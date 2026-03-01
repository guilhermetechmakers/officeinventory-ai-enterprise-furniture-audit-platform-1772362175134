import { Link } from 'react-router-dom'
import { Camera, Upload, CheckSquare, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useUserRole } from '@/hooks/use-user-role'
import type { UserRole } from '@/types/dashboard'

interface QuickAction {
  id: string
  to?: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  primary?: boolean
  /** Roles that can use this action - empty = all roles */
  roles?: UserRole[]
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'start-capture',
    to: '/dashboard/capture',
    label: 'Start Capture',
    icon: Camera,
    primary: true,
    roles: ['admin', 'field_user'],
  },
  {
    id: 'upload-batch',
    to: '/dashboard/uploads',
    label: 'Upload Batch',
    icon: Upload,
    roles: ['admin', 'field_user'],
  },
  {
    id: 'review-queue',
    to: '/dashboard/review-queue',
    label: 'Open Review Queue',
    icon: CheckSquare,
    roles: ['admin', 'reviewer', 'field_user'],
  },
  {
    id: 'create-audit',
    to: '/dashboard/audits?create=1',
    label: 'Create Audit',
    icon: Plus,
    roles: ['admin'],
  },
]

export function QuickActionsBar() {
  const userRole = useUserRole()
  const enabledActions = QUICK_ACTIONS.filter((a) => {
    const allowed = a.roles ?? []
    return allowed.length === 0 || allowed.includes(userRole)
  })

  return (
    <div className="flex flex-wrap gap-3" role="toolbar" aria-label="Quick actions">
      {enabledActions.map((action) => {
        const isPrimary = action.primary ?? false
        const content = (
          <>
            <action.icon className="h-4 w-4" />
            {action.label}
          </>
        )
        const className = cn(
          'rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
          isPrimary && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-elevated'
        )

        return (
          <Button
            key={action.id}
            asChild
            variant={isPrimary ? 'default' : 'secondary'}
            size="sm"
            className={className}
          >
            <Link to={action.to ?? '/dashboard'}>{content}</Link>
          </Button>
        )
      })}
    </div>
  )
}
