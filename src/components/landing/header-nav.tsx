import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '#value-prop', label: 'Features' },
  { href: '#features', label: 'How it works' },
  { href: '#logos', label: 'Customers' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#contact', label: 'Contact' },
]

export function HeaderNav() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header role="banner">
      <nav
        className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md"
        aria-label="Main navigation"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="font-bold text-xl text-foreground hover:text-primary transition-colors"
          >
            OfficeInventory AI
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isHash = item.href.startsWith('#')
              const linkClass =
                'px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors'
              return isHash ? (
                <a key={item.href} href={item.href} className={linkClass}>
                  {item.label}
                </a>
              ) : (
                <Link key={item.href} to={item.href} className={linkClass}>
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="rounded-full">
                Get started
              </Button>
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div
            className="md:hidden border-t border-border bg-background px-4 py-4 animate-slide-up"
            role="dialog"
            aria-label="Mobile menu"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isHash = item.href.startsWith('#')
                const mobileLinkClass =
                  'px-4 py-3 rounded-xl hover:bg-muted/50 hover:text-foreground text-muted-foreground font-medium block'
                return isHash ? (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={mobileLinkClass}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={mobileLinkClass}
                  >
                    {item.label}
                  </Link>
                )
              })}
              <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button variant="outline" className="w-full rounded-full">
                    Sign in
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button className="w-full rounded-full">Get started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
