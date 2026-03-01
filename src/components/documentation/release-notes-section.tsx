/**
 * ReleaseNotesSection - Timeline of release notes with version/date and export.
 * Supports Text and CSV export per spec (exportable reports for procurement/facilities).
 */

import { Megaphone, Download, FileText, FileSpreadsheet } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { ReleaseNote } from '@/types/documentation'

function exportNotesAsText(notes: ReleaseNote[]) {
  const safeNotes = notes ?? []
  const text = safeNotes
    .map(
      (n) =>
        `## ${n.version} (${n.date})\n${(n.highlights ?? []).map((h) => `- ${h}`).join('\n')}\n\n${n.details ?? ''}`
    )
    .join('\n\n---\n\n')
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `release-notes-${new Date().toISOString().slice(0, 10)}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

function exportNotesAsCsv(notes: ReleaseNote[]) {
  const safeNotes = notes ?? []
  const headers = ['Version', 'Date', 'Highlights', 'Details']
  const rows = safeNotes.map((n) => [
    n.version,
    n.date,
    (n.highlights ?? []).join('; '),
    (n.details ?? '').replace(/"/g, '""'),
  ])
  const csvContent = [
    headers.join(','),
    ...rows.map((r) => r.map((c) => `"${c}"`).join(',')),
  ].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `release-notes-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export interface ReleaseNotesSectionProps {
  notes: ReleaseNote[]
  isLoading?: boolean
  className?: string
}

export function ReleaseNotesSection({
  notes,
  isLoading = false,
  className,
}: ReleaseNotesSectionProps) {
  const safeNotes = notes ?? []

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    )
  }

  if (safeNotes.length === 0) {
    return (
      <div className={cn('rounded-2xl border border-dashed border-border bg-card/50 py-12 px-6 text-center', className)}>
        <Megaphone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No release notes available.</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-full">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
            <DropdownMenuItem onClick={() => exportNotesAsText(safeNotes)}>
              <FileText className="h-4 w-4" />
              Export as Text
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportNotesAsCsv(safeNotes)}>
              <FileSpreadsheet className="h-4 w-4" />
              Export as CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-4">
        {safeNotes.map((note) => {
          const highlights = note.highlights ?? []
          const safeHighlights = Array.isArray(highlights) ? highlights : []
          return (
            <Card key={note.id} className="animate-fade-in">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">v{note.version}</span>
                    <span className="text-sm text-muted-foreground">{note.date}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-1.5 mb-2">
                  {safeHighlights.map((h, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                {note.details && (
                  <p className="text-sm text-muted-foreground mt-2">{note.details}</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
