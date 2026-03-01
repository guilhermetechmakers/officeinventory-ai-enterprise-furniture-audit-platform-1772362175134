/**
 * ChangesBlock - Version history and revision info for ToS.
 */

import { cn } from '@/lib/utils'
import type { ToSVersionHistoryItem } from '@/types/terms-of-service'

export interface ChangesBlockProps {
  history: ToSVersionHistoryItem[] | null | undefined
  currentVersion: string
  effectiveDate: string
  className?: string
}

export function ChangesBlock({
  history,
  currentVersion,
  effectiveDate,
  className,
}: ChangesBlockProps) {
  const safeHistory = Array.isArray(history) ? history : []

  return (
    <section
      className={cn('rounded-2xl border border-border bg-card p-6 shadow-card', className)}
      aria-labelledby="tos-changes-heading"
    >
      <h2 id="tos-changes-heading" className="text-xl font-bold text-foreground mb-4">
        Revision History
      </h2>
      <p className="text-muted-foreground text-sm mb-4">
        Current version: {currentVersion} (Effective: {effectiveDate})
      </p>
      {safeHistory.length > 0 ? (
        <ul className="space-y-2 text-sm text-muted-foreground">
          {safeHistory.map((item) => (
            <li key={item.versionId} className="flex gap-2">
              <span className="font-medium text-foreground">{item.versionNumber}</span>
              <span>— {item.effectiveDate}</span>
              {item.summary && <span>— {item.summary}</span>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground text-sm">No prior versions on record.</p>
      )}
    </section>
  )
}
