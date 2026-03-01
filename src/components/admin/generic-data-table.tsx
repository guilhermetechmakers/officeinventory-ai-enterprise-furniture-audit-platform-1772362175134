import * as React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { ChevronUp, ChevronDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ColumnDef<T> {
  id: string
  header: string
  accessorKey?: keyof T
  cell?: (row: T) => React.ReactNode
  sortable?: boolean
}

export interface GenericDataTableProps<T extends { id: string }> {
  data: T[]
  columns: ColumnDef<T>[]
  selectable?: boolean
  selectedIds?: Set<string>
  onSelectionChange?: (ids: Set<string>) => void
  bulkActions?: React.ReactNode
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  sortKey?: string
  sortDir?: 'asc' | 'desc'
  onSort?: (key: string, dir: 'asc' | 'desc') => void
  page?: number
  pageSize?: number
  totalCount?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
  isLoading?: boolean
  emptyMessage?: string
  className?: string
}

export function GenericDataTable<T extends { id: string }>({
  data,
  columns,
  selectable = false,
  selectedIds = new Set(),
  onSelectionChange,
  bulkActions,
  searchPlaceholder = 'Search…',
  searchValue = '',
  onSearchChange,
  sortKey,
  sortDir,
  onSort,
  isLoading = false,
  emptyMessage = 'No data',
  className,
}: GenericDataTableProps<T>) {
  const safeData = Array.isArray(data) ? data : []
  const allSelected =
    safeData.length > 0 &&
    safeData.every((row) => selectedIds.has(row.id))
  const someSelected = selectedIds.size > 0

  const toggleAll = () => {
    if (!onSelectionChange) return
    if (allSelected) {
      onSelectionChange(new Set())
    } else {
      onSelectionChange(new Set(safeData.map((r) => r.id)))
    }
  }

  const toggleRow = (id: string) => {
    if (!onSelectionChange) return
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onSelectionChange(next)
  }

  return (
    <div className={cn('space-y-4', className)}>
      {(onSearchChange || bulkActions) && (
        <div className="flex flex-wrap items-center gap-4">
          {onSearchChange && (
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
          )}
          {someSelected && bulkActions && (
            <div className="flex items-center gap-2">{bulkActions}</div>
          )}
        </div>
      )}

      <ScrollArea className="rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={toggleAll}
                    aria-label="Select all"
                  />
                </TableHead>
              )}
              {(columns ?? []).map((col) => (
                <TableHead key={col.id}>
                  {col.sortable && onSort ? (
                    <button
                      type="button"
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => {
                        const key = col.accessorKey as string ?? col.id
                        const next =
                          sortKey === key && sortDir === 'asc' ? 'desc' : 'asc'
                        onSort(key, next)
                      }}
                    >
                      {col.header}
                      {sortKey === (col.accessorKey ?? col.id) && (
                        sortDir === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={(selectable ? 1 : 0) + columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Loading…
                </TableCell>
              </TableRow>
            ) : safeData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={(selectable ? 1 : 0) + columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              safeData.map((row) => (
                <TableRow key={row.id}>
                  {selectable && (
                    <TableCell className="w-12">
                      <Checkbox
                        checked={selectedIds.has(row.id)}
                        onCheckedChange={() => toggleRow(row.id)}
                        aria-label={`Select row ${row.id}`}
                      />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={col.id}>
                      {col.cell
                        ? col.cell(row)
                        : col.accessorKey
                          ? String((row as Record<string, unknown>)[col.accessorKey as string] ?? '')
                          : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
