/**
 * VersionBadge - Displays ToS version number and effective date.
 */

import { cn } from '@/lib/utils'

export interface VersionBadgeProps {
  versionNumber: string
  effectiveDate: string
  className?: string
}

export function VersionBadge({
  versionNumber,
  effectiveDate,
  className,
}: VersionBadgeProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap gap-4 text-sm text-muted-foreground',
        className
      )}
      role="status"
      aria-label={`Terms of Service version ${versionNumber}, effective ${effectiveDate}`}
    >
      <span>Version {versionNumber}</span>
      <span>Effective: {effectiveDate}</span>
      <span>Last updated: {effectiveDate}</span>
    </div>
  )
}
