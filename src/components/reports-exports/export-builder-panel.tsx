import { useState, useCallback, useMemo } from 'react'
import { Search, ChevronUp, ChevronDown, Download, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { PreviewPanel } from './preview-panel'
import type {
  ExportTemplate,
  ExportField,
  ExportFilter,
  ExportSort,
  FieldDefinition,
  UserPermissions,
} from '@/types/reports-exports'
import { ensureArray } from '@/lib/safe-array'
import { cn } from '@/lib/utils'

export interface ExportBuilderPanelProps {
  templates: ExportTemplate[]
  availableFields: FieldDefinition[]
  existingExportConfig?: {
    fields: ExportField[]
    filters: ExportFilter[]
    sorts: ExportSort[]
    format: 'CSV' | 'PDF'
    templateId?: string
  }
  userPermissions: UserPermissions
  onApplyTemplate: (template: ExportTemplate) => void
  onBuildExport: (config: {
    name: string
    fields: ExportField[]
    filters: ExportFilter[]
    sorts: ExportSort[]
    format: 'CSV' | 'PDF'
    templateId?: string
  }) => void
  onSaveTemplate?: (config: { name: string; fields: ExportField[]; filters: ExportFilter[]; sorts: ExportSort[] }) => void
  isBuilding?: boolean
  className?: string
}

export function ExportBuilderPanel({
  templates,
  availableFields,
  existingExportConfig,
  userPermissions,
  onApplyTemplate,
  onBuildExport,
  onSaveTemplate,
  isBuilding = false,
  className,
}: ExportBuilderPanelProps) {
  const [selectedFields, setSelectedFields] = useState<ExportField[]>(
    () => existingExportConfig?.fields ?? []
  )
  const [filters, setFilters] = useState<ExportFilter[]>(
    () => existingExportConfig?.filters ?? []
  )
  const [sorts, setSorts] = useState<ExportSort[]>(
    () => existingExportConfig?.sorts ?? []
  )
  const [format, setFormat] = useState<'CSV' | 'PDF'>(
    existingExportConfig?.format ?? 'CSV'
  )
  const [templateId, setTemplateId] = useState<string | undefined>(
    existingExportConfig?.templateId
  )
  const [draftName, setDraftName] = useState('')
  const [fieldSearch, setFieldSearch] = useState('')
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const safeTemplates = ensureArray(templates)
  const safeFields = ensureArray(availableFields)

  const filteredFields = useMemo(() => {
    if (!fieldSearch.trim()) return safeFields
    const q = fieldSearch.toLowerCase()
    return safeFields.filter(
      (f) =>
        (f.key ?? '').toLowerCase().includes(q) ||
        (f.label ?? '').toLowerCase().includes(q)
    )
  }, [safeFields, fieldSearch])

  const handleApplyTemplate = useCallback(
    (template: ExportTemplate) => {
      const tplFields = ensureArray(template.fields)
      setSelectedFields(tplFields)
      setFilters(ensureArray(template.filters))
      setSorts(ensureArray(template.sorts))
      setTemplateId(template.id)
      onApplyTemplate(template)
    },
    [onApplyTemplate]
  )

  const toggleField = useCallback((fd: FieldDefinition) => {
    setSelectedFields((prev) => {
      const exists = prev.some((f) => f.key === fd.key)
      if (exists) {
        return prev.filter((f) => f.key !== fd.key)
      }
      return [...prev, { key: fd.key, label: fd.label, type: fd.type }]
    })
  }, [])

  const moveField = useCallback((index: number, direction: 'up' | 'down') => {
    setSelectedFields((prev) => {
      const arr = [...prev]
      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= arr.length) return prev
      ;[arr[index], arr[newIndex]] = [arr[newIndex], arr[index]]
      return arr
    })
  }, [])

  const validate = useCallback(() => {
    const errs: string[] = []
    if (selectedFields.length === 0) {
      errs.push('Select at least one field')
    }
    if (!draftName.trim()) {
      errs.push('Enter export name')
    }
    setValidationErrors(errs)
    return errs.length === 0
  }, [selectedFields.length, draftName])

  const handleBuild = useCallback(() => {
    if (!validate() || !userPermissions.canCreateExport) return
    onBuildExport({
      name: draftName.trim(),
      fields: selectedFields,
      filters,
      sorts,
      format,
      templateId,
    })
  }, [
    validate,
    userPermissions.canCreateExport,
    onBuildExport,
    draftName,
    selectedFields,
    filters,
    sorts,
    format,
    templateId,
  ])

  const rowCountEstimate = useMemo(() => {
    return Math.min(1000, selectedFields.length * 100)
  }, [selectedFields.length])

  return (
    <Card className={cn('rounded-2xl border border-border shadow-card transition-all duration-300 hover:shadow-elevated animate-fade-in', className)}>
      <CardHeader>
        <CardTitle>Export Builder</CardTitle>
        <CardDescription>
          Select template, configure fields, filters, and format
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Template</Label>
          <Select
            value={templateId ?? 'none'}
            onValueChange={(v) => {
              setTemplateId(v === 'none' ? undefined : v)
              const t = safeTemplates.find((tpl) => tpl.id === v)
              if (t) handleApplyTemplate(t)
            }}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Start from scratch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Start from scratch</SelectItem>
              {safeTemplates.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Fields</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search fields..."
              value={fieldSearch}
              onChange={(e) => setFieldSearch(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>
          <div className="max-h-48 overflow-y-auto rounded-xl border border-border p-3 space-y-2">
            {filteredFields.map((fd) => {
              const isSelected = selectedFields.some((f) => f.key === fd.key)
              return (
                <label
                  key={fd.key}
                  className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 rounded-lg p-2"
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleField(fd)}
                  />
                  <span className="text-sm">{fd.label}</span>
                </label>
              )
            })}
            {filteredFields.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No fields match
              </p>
            )}
          </div>
        </div>

        {selectedFields.length > 0 && (
          <div className="space-y-2">
            <Label>Column order</Label>
            <div className="space-y-1">
              {selectedFields.map((f, i) => (
                <div
                  key={f.key}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                >
                  <span className="text-sm">{f.label}</span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => moveField(i, 'up')}
                      disabled={i === 0}
                      aria-label="Move up"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => moveField(i, 'down')}
                      disabled={i === selectedFields.length - 1}
                      aria-label="Move down"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Format</Label>
            <Select value={format} onValueChange={(v) => setFormat(v as 'CSV' | 'PDF')}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CSV">CSV</SelectItem>
                <SelectItem value="PDF">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Export name</Label>
            <Input
              placeholder="e.g. Inventory Q1"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              className="rounded-xl"
            />
          </div>
        </div>

        {validationErrors.length > 0 && (
          <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-3">
            <ul className="text-sm text-destructive list-disc list-inside">
              {validationErrors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        <PreviewPanel
          selectedFields={selectedFields}
          estimatedRowCount={rowCountEstimate}
          format={format}
        />

        <div className="flex flex-wrap gap-2">
          {userPermissions.canCreateExport && (
            <Button
              onClick={handleBuild}
              disabled={isBuilding || selectedFields.length === 0}
              className="rounded-full"
            >
              {isBuilding ? (
                <>Building...</>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Run Export
                </>
              )}
            </Button>
          )}
          {onSaveTemplate && userPermissions.canEditTemplate && (
            <Button
              variant="outline"
              onClick={() =>
                onSaveTemplate?.({
                  name: draftName || 'Untitled',
                  fields: selectedFields,
                  filters,
                  sorts,
                })
              }
              disabled={selectedFields.length === 0}
              className="rounded-full"
            >
              <Save className="h-4 w-4 mr-2" />
              Save as Template
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
