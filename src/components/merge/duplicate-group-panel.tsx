/**
 * DuplicateGroupPanel - Lists candidate duplicate groups with similarity scores and actions
 */

import { Eye, Flag, GitMerge, ImageOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ensureArray } from '@/lib/safe-array'
import type { Group } from '@/types/merge'

export interface DuplicateGroupPanelProps {
  groups: Group[]
  selectedGroupId: string | null
  onSelectGroup: (groupId: string) => void
  onMergeGroup: (groupId: string) => void
  onFlagGroup?: (groupId: string) => void
  isLoading?: boolean
  className?: string
}

export function DuplicateGroupPanel({
  groups,
  selectedGroupId,
  onSelectGroup,
  onMergeGroup,
  onFlagGroup,
  isLoading = false,
  className,
}: DuplicateGroupPanelProps) {
  const safeGroups = ensureArray(groups)

  return (
    <Card
      className={cn(
        'rounded-2xl border border-border bg-card shadow-card transition-all duration-300',
        className
      )}
      role="region"
      aria-label="Candidate duplicate groups"
    >
      <CardHeader>
        <CardTitle className="text-base font-bold">Candidate Duplicates</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Select a group to inspect evidence and merge attributes
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 rounded-xl bg-muted/50 animate-pulse"
                aria-hidden
              />
            ))}
          </div>
        ) : safeGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50 mb-4">
              <GitMerge className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No duplicate groups found. Run a scan to detect candidates.
            </p>
          </div>
        ) : (
          <ul className="space-y-3" role="list">
            {safeGroups.map((group) => {
              const isSelected = selectedGroupId === group?.id
              const itemIds = ensureArray(group?.itemIds)
              const previewAssets = ensureArray(group?.previewAssets)
              const score = Math.round((group?.similarityScore ?? 0) * 100)

              return (
                <li key={group?.id ?? ''}>
                  <div
                    className={cn(
                      'flex items-center gap-4 rounded-xl border p-4 transition-all duration-200',
                      'hover:shadow-elevated focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-card'
                        : 'border-border bg-secondary hover:border-primary/30'
                    )}
                  >
                    <div className="flex shrink-0 gap-1">
                      {previewAssets.slice(0, 3).map((asset, i) => (
                        <div
                          key={asset?.itemId ?? i}
                          className="h-12 w-12 overflow-hidden rounded-lg border border-border bg-muted"
                        >
                          {asset?.thumbnailUrl ? (
                            <img
                              src={asset.thumbnailUrl}
                              alt=""
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <ImageOff className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground">
                        {itemIds.length} items · {score}% similar
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Group {group?.id?.slice(0, 8) ?? '—'}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => onSelectGroup(group?.id ?? '')}
                        aria-label={`Inspect group ${group?.id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="rounded-full"
                        onClick={() => onMergeGroup(group?.id ?? '')}
                        aria-label={`Merge group ${group?.id}`}
                      >
                        <GitMerge className="h-4 w-4" />
                      </Button>
                      {onFlagGroup && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full"
                          onClick={() => onFlagGroup(group?.id ?? '')}
                          aria-label={`Flag group ${group?.id}`}
                        >
                          <Flag className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
