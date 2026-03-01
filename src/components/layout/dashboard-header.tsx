import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Bell, ChevronDown, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
interface DashboardHeaderProps {
  onSearch?: (query: string) => void
  tenantName?: string
  user?: { name?: string; email?: string; avatar?: string }
}

export function DashboardHeader({
  onSearch,
  tenantName = 'Acme Corp',
  user = { name: 'User', email: 'user@example.com' },
}: DashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchQuery)
  }

  const initials = user.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? 'U'

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-card px-6 shadow-sm">
      <form onSubmit={handleSearch} className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search audits, sites, items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-full"
          />
        </div>
      </form>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm" className="rounded-full">
              {tenantName}
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Switch tenant</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{tenantName}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user.name}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {user.email}
                </span>
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
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
