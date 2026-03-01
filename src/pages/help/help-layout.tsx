/**
 * HelpLayout - Wrapper for Help/Documentation pages with nav.
 * Design: Pill-shaped black nav bar with white and accent green highlights.
 */

import { Outlet, Link, useLocation } from 'react-router-dom'
import { BookOpen, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

export function HelpLayout() {
  const location = useLocation()
  const isHelp = location.pathname.startsWith('/help')
  const isContact = location.pathname === '/contact'

  return (
    <div className="min-h-screen bg-background">
      <nav
        className="sticky top-0 z-40 border-b border-border bg-[rgb(var(--primary-foreground))] shadow-card"
        role="navigation"
        aria-label="Help and documentation"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            to="/"
            className="font-bold text-xl text-secondary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--primary-foreground))] rounded-lg"
          >
            OfficeInventory AI
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/help"
              className={cn(
                'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--primary-foreground))]',
                isHelp
                  ? 'bg-primary text-primary-foreground'
                  : 'text-secondary hover:bg-secondary/10 hover:text-primary'
              )}
            >
              <BookOpen className="h-4 w-4" />
              Documentation
            </Link>
            <Link
              to="/contact"
              className={cn(
                'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--primary-foreground))]',
                isContact
                  ? 'bg-primary text-primary-foreground'
                  : 'text-secondary hover:bg-secondary/10 hover:text-primary'
              )}
            >
              <Mail className="h-4 w-4" />
              Contact
            </Link>
          </div>
        </div>
      </nav>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Outlet />
      </div>
    </div>
  )
}
