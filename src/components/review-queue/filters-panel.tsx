/**
 * FiltersPanel - Confidence range, site, location, status
 */

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { ReviewQueueFilters, ReviewItemStatus } from '@/types/review-queue'

export interface FiltersPanelProps {
  filters: ReviewQueueFilters
  onFiltersChange: (filters: ReviewQueueFilters) => void
  sites?: { id: string; name: string }[]
  className?: string
}

type StatusFilterValue = ReviewItemStatus | 'all'
const STATUS_OPTIONS: { value: StatusFilterValue; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'lowConfidence', label: 'Low Confidence' },
  { value: 'exception', label: 'Exception' },
  { value: 'duplicate', label: 'Duplicate' },
  { value: 'inReview', label: 'In Review' },
  { value: 'approved', label: 'Approved' },
]

export function FiltersPanel({
  filters,
  onFiltersChange,
  sites = [],
  className,
}: FiltersPanelProps) {
  const hasActiveFilters =
    (filters.minConfidence != null && filters.minConfidence > 0) ||
    (filters.maxConfidence != null && filters.maxConfidence < 100) ||
    (filters.siteId && filters.siteId !== 'all') ||
    (filters.location && filters.location.trim() !== '') ||
    (filters.status != null)

  const handleReset = () => {
    onFiltersChange({
      minConfidence: undefined,
      maxConfidence: undefined,
      siteId: undefined,
      location: undefined,
      status: undefined,
      assignedTo: undefined,
    })
  }

  const safeSites = Array.isArray(sites) ? sites : []

  return (
    <div
      className={cn('space-y-4', className)}
      role="search"
      aria-label="Filter review queue"
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
          <div className="space-y-2">
            <Label htmlFor="min-confidence" className="text-xs">
              Min Confidence %
            </Label>
            <Input
              id="min-confidence"
              type="number"
              min={0}
              max={100}
              placeholder="0"
              value={filters.minConfidence ?? ''}
              onChange={(e) => {
                const v = e.target.value ? Number(e.target.value) : undefined
                onFiltersChange({ ...filters, minConfidence: v })
              }}
              className="rounded-xl"
              aria-label="Minimum confidence percentage"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-confidence" className="text-xs">
              Max Confidence %
            </Label>
            <Input
              id="max-confidence"
              type="number"
              min={0}
              max={100}
              placeholder="100"
              value={filters.maxConfidence ?? ''}
              onChange={(e) => {
                const v = e.target.value ? Number(e.target.value) : undefined
                onFiltersChange({ ...filters, maxConfidence: v })
              }}
              className="rounded-xl"
              aria-label="Maximum confidence percentage"
            />
          </div>
        </div>
        {safeSites.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="site-filter" className="text-xs">
              Site
            </Label>
            <Select
              value={filters.siteId ?? 'all'}
              onValueChange={(v) =>
                onFiltersChange({
                  ...filters,
                  siteId: v === 'all' ? undefined : v,
                })
              }
            >
              <SelectTrigger
                id="site-filter"
                className="rounded-xl"
                aria-label="Filter by site"
              >
                <SelectValue placeholder="All sites" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sites</SelectItem>
                {safeSites.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="location-filter" className="text-xs">
            Location
          </Label>
          <Input
            id="location-filter"
            type="text"
            placeholder="Search location..."
            value={filters.location ?? ''}
            onChange={(e) =>
              onFiltersChange({ ...filters, location: e.target.value || undefined })
            }
            className="rounded-xl"
            aria-label="Filter by location"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status-filter" className="text-xs">
            Status
          </Label>
          <Select
            value={filters.status ?? 'all'}
            onValueChange={(v) =>
              onFiltersChange({
                ...filters,
                status: v === 'all' ? undefined : (v as ReviewItemStatus),
              })
            }
          >
            <SelectTrigger
              id="status-filter"
              className="rounded-xl"
              aria-label="Filter by status"
            >
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="w-full rounded-full"
            aria-label="Reset filters"
          >
            <X className="mr-1.5 h-4 w-4" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  )
}
