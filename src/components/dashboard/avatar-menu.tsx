import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthContext } from '@/contexts/auth-context'
import { safeString } from '@/hooks/use-supa-safe-data'

interface AvatarMenuUser {
  name?: string
  email?: string
  avatarUrl?: string
}

interface AvatarMenuProps {
  /** Override user - if not provided, uses auth context */
  user?: AvatarMenuUser
  onSignOut?: () => void
}

export function AvatarMenu({ user: userProp, onSignOut }: AvatarMenuProps) {
  const { user: authUser, signOut } = useAuthContext()
  const navigate = useNavigate()
  const user = userProp ?? authUser

  const name = safeString(user?.name, 'User')
  const email = safeString(user?.email, '')
  const avatarUrl = user?.avatarUrl

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Open user menu"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="font-medium">{name}</span>
            {email && (
              <span className="text-xs font-normal text-muted-foreground">
                {email}
              </span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/dashboard/settings">
            <User className="mr-2 h-4 w-4" />
            Profile & Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => {
            onSignOut?.()
            signOut()
            navigate('/login')
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
