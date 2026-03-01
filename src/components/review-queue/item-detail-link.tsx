/**
 * ItemDetailLink - Navigates to detailed audit item view
 */

import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ItemDetailLinkProps {
  auditId?: string
  itemId: string
  children: React.ReactNode
  className?: string
}

export function ItemDetailLink({ auditId, itemId, children, className }: ItemDetailLinkProps) {
  const href = auditId
    ? `/dashboard/audits/${auditId}/items/${itemId}`
    : `/dashboard/audits/aud-1/items/${itemId}`

  return (
    <Link
      to={href}
      className={cn(
        'inline-flex items-center gap-1 font-medium text-foreground hover:text-primary hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md',
        className
      )}
      aria-label={`View item ${itemId} details`}
    >
      {children}
      <ChevronRight className="h-4 w-4" aria-hidden />
    </Link>
  )
}
