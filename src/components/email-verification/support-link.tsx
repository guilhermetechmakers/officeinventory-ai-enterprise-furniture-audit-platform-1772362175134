import { HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const DEFAULT_SUPPORT_EMAIL = 'support@officeinventory.ai'

export interface SupportLinkProps {
  href?: string
  className?: string
}

export function SupportLink({
  href = `mailto:${DEFAULT_SUPPORT_EMAIL}`,
  className,
}: SupportLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors',
        'hover:text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded',
        className
      )}
      aria-label="Contact support"
    >
      <HelpCircle className="h-4 w-4" aria-hidden />
      Didn&apos;t receive the email? Contact support
    </a>
  )
}
