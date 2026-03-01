import { FileSpreadsheet, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { ExportField } from '@/types/reports-exports'

export interface PreviewPanelProps {
  selectedFields: ExportField[]
  format: 'CSV' | 'PDF'
  estimatedRowCount?: number
  sampleHeaders?: string[]
  className?: string
}

export function PreviewPanel({
  selectedFields,
  format,
  estimatedRowCount = 0,
  sampleHeaders = [],
  className,
}: PreviewPanelProps) {
  const headerLabels = sampleHeaders.length > 0
    ? sampleHeaders
    : (selectedFields ?? []).map((f) => f.label ?? f.key)

  return (
    <Card className={cn('rounded-2xl border border-border shadow-card', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          {format === 'CSV' ? (
            <FileSpreadsheet className="h-4 w-4" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {(selectedFields ?? []).length} columns selected
          </p>
          {estimatedRowCount > 0 && (
            <p className="text-sm text-muted-foreground">
              ~{estimatedRowCount.toLocaleString()} rows estimated
            </p>
          )}
        </div>
        <div className="rounded-lg border border-border bg-card p-3 overflow-x-auto">
          <div className="flex flex-wrap gap-2">
            {(headerLabels ?? []).map((label, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium"
              >
                {label}
              </span>
            ))}
          </div>
          {headerLabels.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Select fields to see preview
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
