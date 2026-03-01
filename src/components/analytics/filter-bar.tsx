/**
 * FilterBar - Date range, site, floor, category selectors with apply/reset
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
import type { AnalyticsFilters } from '@/types/analytics'

export interface FilterBarProps {
  filters: AnalyticsFilters
  onChange: (filters: AnalyticsFilters) => void
  onApply?: () => void
  sites?: { id: string; name: string }[]
  floors?: { id: string; name: string; siteId: string }[]
  categories?: { id: string; name: string }[]
  className?: string
}

const MOCK_SITES = [
  { id: 's1', name: 'HQ Building A' },
  { id: 's2', name: 'Building B' },
  { id: 's3', name: 'Main Office' },
]

const MOCK_FLOORS = [
  { id: 'f1', name: 'Floor 1', siteId: 's1' },
  { id: 'f2', name: 'Floor 2', siteId: 's1' },
  { id: 'f3', name: 'Ground Floor', siteId: 's2' },
  { id: 'f4', name: 'Floor 1', siteId: 's3' },
]

const MOCK_CATEGORIES = [
  { id: 'desks', name: 'Desks' },
  { id: 'chairs', name: 'Chairs' },
  { id: 'storage', name: 'Storage' },
  { id: 'tables', name: 'Meeting Tables' },
]

export function FilterBar({
  filters,
  onChange,
  onApply,
  sites = MOCK_SITES,
  floors = MOCK_FLOORS,
  categories = MOCK_CATEGORIES,
  className,
}: FilterBarProps) {
  const safeSites = Array.isArray(sites) ? sites : MOCK_SITES
  const safeFloors = Array.isArray(floors) ? floors : MOCK_FLOORS
  const safeCategories = Array.isArray(categories) ? categories : MOCK_CATEGORIES

  const filteredFloors = filters.siteId
    ? safeFloors.filter((f) => f.siteId === filters.siteId)
    : safeFloors

  const hasActiveFilters =
    (filters.siteId && filters.siteId !== '') ||
    (filters.floorId && filters.floorId !== '') ||
    (filters.category && filters.category !== '')

  const handleReset = () => {
    onChange({
      ...filters,
      siteId: undefined,
      floorId: undefined,
      category: undefined,
    })
    onApply?.()
  }

  return (
    <div
      className={cn('space-y-4', className)}
      role="search"
      aria-label="Filter analytics data"
    >
      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-2">
          <Label htmlFor="analytics-start-date" className="text-xs font-medium">
            Start date
          </Label>
          <Input
            id="analytics-start-date"
            type="date"
            value={filters.startDate ?? ''}
            onChange={(e) => onChange({ ...filters, startDate: e.target.value })}
            className="rounded-xl"
            aria-label="Start date"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="analytics-end-date" className="text-xs font-medium">
            End date
          </Label>
          <Input
            id="analytics-end-date"
            type="date"
            value={filters.endDate ?? ''}
            onChange={(e) => onChange({ ...filters, endDate: e.target.value })}
            className="rounded-xl"
            aria-label="End date"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="analytics-site" className="text-xs font-medium">
            Site
          </Label>
          <Select
            value={filters.siteId ?? 'all'}
            onValueChange={(v) => {
              onChange({
                ...filters,
                siteId: v === 'all' ? undefined : v,
                floorId: undefined,
              })
            }}
          >
            <SelectTrigger
              id="analytics-site"
              className="w-[180px] rounded-xl"
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
        <div className="space-y-2">
          <Label htmlFor="analytics-floor" className="text-xs font-medium">
            Floor
          </Label>
          <Select
            value={filters.floorId ?? 'all'}
            onValueChange={(v) =>
              onChange({ ...filters, floorId: v === 'all' ? undefined : v })
            }
          >
            <SelectTrigger
              id="analytics-floor"
              className="w-[160px] rounded-xl"
              aria-label="Filter by floor"
            >
              <SelectValue placeholder="All floors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All floors</SelectItem>
              {filteredFloors.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="analytics-category" className="text-xs font-medium">
            Category
          </Label>
          <Select
            value={filters.category ?? 'all'}
            onValueChange={(v) =>
              onChange({ ...filters, category: v === 'all' ? undefined : v })
            }
          >
            <SelectTrigger
              id="analytics-category"
              className="w-[160px] rounded-xl"
              aria-label="Filter by category"
            >
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {safeCategories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {onApply && (
          <Button
            size="sm"
            onClick={onApply}
            className="rounded-full"
            aria-label="Apply filters"
          >
            Apply
          </Button>
        )}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="rounded-full"
            aria-label="Reset filters"
          >
            <X className="mr-1.5 h-4 w-4" />
            Reset
          </Button>
        )}
      </div>
    </div>
  )
}
