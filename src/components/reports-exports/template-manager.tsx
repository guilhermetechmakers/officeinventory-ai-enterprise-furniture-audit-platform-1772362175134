import { useState } from 'react'
import { FileText, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TemplateCard } from './template-card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ExportTemplate, TemplateFor } from '@/types/reports-exports'
import { ensureArray } from '@/lib/safe-array'
import { cn } from '@/lib/utils'

export interface TemplateManagerProps {
  templates: ExportTemplate[]
  isLoading?: boolean
  onApply: (template: ExportTemplate) => void
  onEdit: (template: ExportTemplate) => void
  onDelete: (template: ExportTemplate) => void
  onCreate?: (payload: Omit<ExportTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void
  canManageTemplates?: boolean
  className?: string
}

export function TemplateManager({
  templates,
  isLoading = false,
  onApply,
  onEdit,
  onDelete,
  onCreate,
  canManageTemplates = true,
  className,
}: TemplateManagerProps) {
  const [showCreate, setShowCreate] = useState(false)
  const [createName, setCreateName] = useState('')
  const [createDesc, setCreateDesc] = useState('')
  const [createFor, setCreateFor] = useState<TemplateFor>('procurement')

  const safeTemplates = ensureArray(templates)

  const handleCreate = () => {
    if (!createName.trim() || !onCreate) return
    onCreate({
      name: createName.trim(),
      description: createDesc.trim(),
      ownerId: 'user-1',
      tenantId: 'tenant-1',
      fields: [],
      filters: [],
      sorts: [],
      templateFor: createFor,
    })
    setShowCreate(false)
    setCreateName('')
    setCreateDesc('')
    setCreateFor('procurement')
  }

  return (
    <>
      <Card className={cn('rounded-2xl border border-border shadow-card transition-all duration-300 hover:shadow-elevated animate-fade-in', className)}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Report Templates
            </CardTitle>
            <CardDescription>
              Pre-built and custom templates for exports
            </CardDescription>
          </div>
          {canManageTemplates && onCreate && (
            <Button
              size="sm"
              onClick={() => setShowCreate(true)}
              className="rounded-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : safeTemplates.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground font-medium">No templates</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create a template or use the Export Builder from scratch
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {safeTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onApply={onApply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle>New Template</DialogTitle>
            <DialogDescription>
              Create a reusable export template
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="e.g. Inventory List"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Brief description of this template"
                value={createDesc}
                onChange={(e) => setCreateDesc(e.target.value)}
                className="rounded-xl"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Template for</Label>
              <Select value={createFor} onValueChange={(v) => setCreateFor(v as TemplateFor)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="procurement">Procurement</SelectItem>
                  <SelectItem value="facilities">Facilities</SelectItem>
                  <SelectItem value="sustainability">Sustainability</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)} className="rounded-full">
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!createName.trim()} className="rounded-full">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
