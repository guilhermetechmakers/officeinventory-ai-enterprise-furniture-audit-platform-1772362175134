import * as React from 'react'
import {
  Building2,
  Shield,
  Users,
  Activity,
  CreditCard,
  ClipboardList,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { AdminSection } from '@/types/admin'

const adminNavItems: { id: AdminSection; icon: React.ElementType; label: string }[] = [
  { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
  { id: 'tenants', icon: Building2, label: 'Tenant Settings' },
  { id: 'sso', icon: Shield, label: 'SSO' },
  { id: 'users', icon: Users, label: 'Users & Roles' },
  { id: 'health', icon: Activity, label: 'Health' },
  { id: 'billing', icon: CreditCard, label: 'Billing' },
  { id: 'audit', icon: ClipboardList, label: 'Audit Log' },
]

export interface AdminDashboardShellProps {
  activeSection: AdminSection
  onSectionChange: (section: AdminSection) => void
  children: React.ReactNode
}

export function AdminDashboardShell({
  activeSection,
  onSectionChange,
  children,
}: AdminDashboardShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)

  return (
    <div className="flex h-full min-h-0">
      {/* Left sidebar - compact icon stack */}
      <aside
        className={cn(
          'flex flex-col border-r border-border bg-card transition-all duration-300',
          sidebarCollapsed ? 'w-[72px]' : 'w-56'
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-3">
          {!sidebarCollapsed && (
            <span className="text-sm font-semibold text-foreground">
              Admin
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {adminNavItems.map((item) => {
            const isActive = activeSection === item.id
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mx-auto max-w-6xl animate-fade-in-up">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
