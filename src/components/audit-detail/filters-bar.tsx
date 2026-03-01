/**
 * FiltersBar - Filter controls for confidence, category, condition, and flagged status
 */

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import type { AuditDetailFilters } from '@/types/audit-detail'

export interface FiltersBarProps {
  filters: AuditDetailFilters
  onFiltersChange: (filters: AuditDetailFilters) => void
  categories: string[]
  conditions: string[]
  className?: string
}

export function FiltersBar({
  filters,
  onFiltersChange,
  categories,
  conditions,
  className,
}: FiltersBarProps) {
  const hasActiveFilters =
    (filters.minConfidence != null && filters.minConfidence > 0) ||
    (filters.maxConfidence != null && filters.maxConfidence < 100) ||
    (filters.category && filters.category !== 'all') ||
    (filters.condition && filters.condition !== 'all') ||
    filters.onlyFlagged === true

  const handleReset = () => {
    onFiltersChange({
      minConfidence: undefined,
      maxConfidence: undefined,
      category: undefined,
      condition: undefined,
      onlyFlagged: false,
      sortBy: 'confidence-desc',
    })
  }

  return (
    <div
      className={cn('space-y-4', className)}
      role="search"
      aria-label="Filter detections"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
        <div className="flex flex-col gap-2">
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
            className="w-24 rounded-xl"
            aria-label="Minimum confidence percentage"
          />
        </div>
        <div className="flex flex-col gap-2">
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
            className="w-24 rounded-xl"
            aria-label="Maximum confidence percentage"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="category-filter" className="text-xs">
            Category
          </Label>
          <Select
            value={filters.category ?? 'all'}
            onValueChange={(v) =>
              onFiltersChange({
                ...filters,
                category: v === 'all' ? undefined : v,
              })
            }
          >
            <SelectTrigger
              id="category-filter"
              className="w-[160px] rounded-xl"
              aria-label="Filter by category"
            >
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {(categories ?? []).map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="condition-filter" className="text-xs">
            Condition
          </Label>
          <Select
            value={filters.condition ?? 'all'}
            onValueChange={(v) =>
              onFiltersChange({
                ...filters,
                condition: v === 'all' ? undefined : v,
              })
            }
          >
            <SelectTrigger
              id="condition-filter"
              className="w-[140px] rounded-xl"
              aria-label="Filter by condition"
            >
              <SelectValue placeholder="All conditions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All conditions</SelectItem>
              {(conditions ?? []).map((cond) => (
                <SelectItem key={cond} value={cond}>
                  {cond}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="sort-by" className="text-xs">
            Sort by
          </Label>
          <Select
            value={filters.sortBy ?? 'confidence-desc'}
            onValueChange={(v) =>
              onFiltersChange({
                ...filters,
                sortBy: v as AuditDetailFilters['sortBy'],
              })
            }
          >
            <SelectTrigger
              id="sort-by"
              className="w-[180px] rounded-xl"
              aria-label="Sort detections"
            >
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="confidence-desc">Confidence (high first)</SelectItem>
              <SelectItem value="confidence-asc">Confidence (low first)</SelectItem>
              <SelectItem value="category">Category</SelectItem>
              <SelectItem value="date">Date Detected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-2">
          <Switch
            id="only-flagged"
            checked={filters.onlyFlagged ?? false}
            onCheckedChange={(checked) =>
              onFiltersChange({ ...filters, onlyFlagged: checked })
            }
            aria-label="Show only flagged items"
          />
          <Label htmlFor="only-flagged" className="text-sm font-medium">
            Flagged only
          </Label>
        </div>
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
