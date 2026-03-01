import { FileText, Download, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { ExportTemplate } from '@/types/reports-exports'
import { cn } from '@/lib/utils'

export interface TemplateCardProps {
  template: ExportTemplate
  onApply: (template: ExportTemplate) => void
  onEdit: (template: ExportTemplate) => void
  onDelete: (template: ExportTemplate) => void
  canEdit?: boolean
  canDelete?: boolean
  className?: string
}

export function TemplateCard({
  template,
  onApply,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
  className,
}: TemplateCardProps) {
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <Card
      className={cn(
        'rounded-2xl border border-border shadow-card group transition-all duration-300 hover:shadow-elevated hover:scale-[1.01]',
        className
      )}
    >
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">{template.name}</p>
            <p className="text-sm text-muted-foreground truncate">
              {template.description}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Modified {formatDate(template.updatedAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            onClick={() => onApply(template)}
            className="rounded-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Apply
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="More actions">
                <span className="sr-only">More</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              {canEdit && (
                <DropdownMenuItem onClick={() => onEdit(template)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              {canDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(template)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}
