import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Camera,
  ClipboardList,
  CheckSquare,
  Merge,
  FileText,
  BarChart3,
  Settings,
  Users,
  ChevronLeft,
  ChevronRight,
  Upload,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { to: '/dashboard/capture', icon: Camera, label: 'Capture' },
  { to: '/dashboard/uploads', icon: Upload, label: 'Upload Status' },
  { to: '/dashboard/audits', icon: ClipboardList, label: 'Audits' },
  { to: '/dashboard/review-queue', icon: CheckSquare, label: 'Review Queue' },
  { to: '/dashboard/merge', icon: Merge, label: 'Merge & Duplicates' },
  { to: '/dashboard/reports', icon: FileText, label: 'Reports' },
  { to: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
]

const adminItems = [
  { to: '/dashboard/admin', icon: Settings, label: 'Admin' },
  { to: '/dashboard/users', icon: Users, label: 'Users' },
]

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-border bg-card transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <Link to="/dashboard" className="font-bold text-lg text-foreground">
            OfficeInventory AI
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/')
          return (
            <Link key={item.to} to={item.to}>
              <div
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </div>
            </Link>
          )
        })}

        <Separator className="my-2" />

        {adminItems.map((item) => {
          const isActive = location.pathname === item.to
          return (
            <Link key={item.to} to={item.to}>
              <div
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </div>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
