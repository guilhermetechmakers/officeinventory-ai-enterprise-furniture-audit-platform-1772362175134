/**
 * ExportButton - CSV and image export for chart data
 */

import { useCallback } from 'react'
import { Download } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export interface ExportButtonProps {
  chartId?: string
  chartRef?: React.RefObject<HTMLDivElement | null>
  data: Record<string, unknown>[] | { [key: string]: unknown }[]
  filename?: string
  headers?: string[]
  className?: string
}

function toCSV(
  data: Record<string, unknown>[] | { [key: string]: unknown }[],
  headers?: string[]
): string {
  const items = Array.isArray(data) ? data : []
  if (items.length === 0) return ''

  const keys = headers ?? (Object.keys(items[0] ?? {}) as string[])
  const headerRow = keys.join(',')
  const rows = items.map((row) =>
    keys.map((k) => {
      const v = (row as Record<string, unknown>)[k]
      const str = v == null ? '' : String(v)
      return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str
    }).join(',')
  )
  return [headerRow, ...rows].join('\n')
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function ExportButton({
  chartId,
  chartRef,
  data,
  filename = 'analytics-export',
  headers,
  className,
}: ExportButtonProps) {
  const handleExportCSV = useCallback(() => {
    const items = Array.isArray(data) ? data : []
    const csv = toCSV(items, headers)
    if (!csv) {
      toast.error('No data to export')
      return
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    downloadBlob(blob, `${filename}-${new Date().toISOString().slice(0, 10)}.csv`)
    toast.success('CSV exported')
  }, [data, filename, headers])

  const handleExportSVG = useCallback(() => {
    const el = chartRef?.current ?? (chartId ? document.getElementById(chartId) : null)
    const svg = el?.querySelector?.('svg')
    if (!svg) {
      toast.error('Chart not found for export')
      return
    }
    try {
      const serializer = new XMLSerializer()
      const svgStr = serializer.serializeToString(svg)
      const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
      downloadBlob(blob, `${filename}-${new Date().toISOString().slice(0, 10)}.svg`)
      toast.success('SVG exported')
    } catch {
      toast.error('SVG export failed')
    }
  }, [chartId, chartRef, filename])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('rounded-full', className)}
          aria-label="Export options"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl">
        <DropdownMenuItem onClick={handleExportCSV}>Export as CSV</DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportSVG}>Export as SVG</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
