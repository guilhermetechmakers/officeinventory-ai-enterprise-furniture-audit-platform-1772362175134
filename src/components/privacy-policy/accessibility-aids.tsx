/**
 * AccessibilityAids - Skip-to-content link, breadcrumbs, aria-live regions.
 * Ensures keyboard navigation and screen reader support.
 */

import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AccessibilityAidsProps {
  /** ID of main content element for skip link */
  mainContentId?: string
  /** Show breadcrumbs */
  showBreadcrumbs?: boolean
  /** Aria-live region for status updates (e.g. export progress) */
  statusMessage?: string
  className?: string
}

export function AccessibilityAids({
  mainContentId = 'privacy-policy-main',
  showBreadcrumbs = true,
  statusMessage,
  className,
}: AccessibilityAidsProps) {
  return (
    <div className={cn(className)}>
      <a
        href={`#${mainContentId}`}
        className={cn(
          'absolute -left-[9999px] z-[9999] rounded-full font-medium',
          'focus:fixed focus:left-4 focus:top-4 focus:px-4 focus:py-2',
          'focus:bg-primary focus:text-primary-foreground focus:shadow-elevated',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
        )}
      >
        Skip to content
      </a>
      {showBreadcrumbs && (
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link
                to="/"
                className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                Home
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-4 w-4" />
            </li>
            <li aria-current="page">Privacy Policy</li>
          </ol>
        </nav>
      )}
      {statusMessage && (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {statusMessage}
        </div>
      )}
    </div>
  )
}
