import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { BatchFilter } from '@/types/bulk-upload'

interface FiltersBarProps {
  filter: BatchFilter
  sites: string[]
  onFilterChange: (filter: BatchFilter) => void
  onClear: () => void
  onSearchChange: (query: string) => void
  searchValue: string
  className?: string
}

export function FiltersBar({
  filter,
  sites,
  onFilterChange,
  onClear,
  onSearchChange,
  searchValue,
  className,
}: FiltersBarProps) {
  const hasActiveFilters =
    (filter.status && filter.status !== 'all') ||
    (filter.site && filter.site !== 'all') ||
    filter.startDate ||
    filter.endDate ||
    searchValue

  return (
    <div
      className={cn('flex flex-col gap-4', className)}
      role="search"
      aria-label="Filter batches"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            placeholder="Search batch name, uploader, site..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 rounded-full"
            aria-label="Search batches"
          />
        </div>

        <Select
          value={filter.status ?? 'all'}
          onValueChange={(v) =>
            onFilterChange({ ...filter, status: v === 'all' ? undefined : v })
          }
        >
          <SelectTrigger className="w-[140px] rounded-full" aria-label="Filter by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filter.site ?? 'all'}
          onValueChange={(v) =>
            onFilterChange({ ...filter, site: v === 'all' ? undefined : v })
          }
        >
          <SelectTrigger className="w-[160px] rounded-full" aria-label="Filter by site">
            <SelectValue placeholder="Site" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sites</SelectItem>
            {(sites ?? []).map((site) => (
              <SelectItem key={site} value={site}>
                {site}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={filter.startDate ?? ''}
          onChange={(e) => onFilterChange({ ...filter, startDate: e.target.value || undefined })}
          className="w-[140px] rounded-full"
          aria-label="Start date"
        />
        <Input
          type="date"
          value={filter.endDate ?? ''}
          onChange={(e) => onFilterChange({ ...filter, endDate: e.target.value || undefined })}
          className="w-[140px] rounded-full"
          aria-label="End date"
        />

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="rounded-full"
            aria-label="Clear filters"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
