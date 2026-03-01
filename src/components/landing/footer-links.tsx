import { Link } from 'react-router-dom'
import { Github, Twitter, Linkedin } from 'lucide-react'
import { cn } from '@/lib/utils'

const footerLinks = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/contact', label: 'Contact' },
  { href: '/help', label: 'Documentation' },
]

const socialLinks = [
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
  { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://github.com', icon: Github, label: 'GitHub' },
]

export function FooterLinks() {
  return (
    <footer
      role="contentinfo"
      className="border-t border-border bg-card px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} OfficeInventory AI. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'text-sm text-muted-foreground hover:text-foreground transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-8 flex gap-4">
          {socialLinks.map((social) => {
            const Icon = social.icon
            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                )}
                aria-label={social.label}
              >
                <Icon className="h-5 w-5" aria-hidden />
              </a>
            )
          })}
        </div>
      </div>
    </footer>
  )
}
