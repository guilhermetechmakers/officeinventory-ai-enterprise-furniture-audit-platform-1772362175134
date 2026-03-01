import * as React from 'react'
import { ChevronUp, ChevronDown, FileJson, Download, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useTenantSettings, usePatchExportSchema, useExportExportSchema, useImportExportSchema } from '@/hooks/use-tenant-settings'
import { LoadingState } from './loading-state'
import { ErrorState } from './error-state'
import { ValidationBadge } from './validation-badge'
import type { ExportSchemaField } from '@/types/tenant-settings'
import { cn } from '@/lib/utils'

export function ExportSchemaEditor() {
  const { data: settings, isLoading, error, refetch } = useTenantSettings()
  const patchSchema = usePatchExportSchema()
  const exportSchema = useExportExportSchema()
  const importSchema = useImportExportSchema()

  const schema = settings?.exportSchema
  const fields = (schema?.fields ?? []).slice().sort((a, b) => a.order - b.order)

  const [localFields, setLocalFields] = React.useState<ExportSchemaField[]>([])
  const [hasChanges, setHasChanges] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    const arr = Array.isArray(schema?.fields) ? schema.fields : []
    const sorted = [...arr].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    if (sorted.length > 0) setLocalFields(sorted)
  }, [schema?.updatedAt, schema?.schemaId, schema?.fields])

  const moveField = (index: number, direction: 'up' | 'down') => {
    const next = [...localFields]
    const target = direction === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    next.forEach((f, i) => (f.order = i))
    setLocalFields(next)
    setHasChanges(true)
  }

  const toggleField = (id: string, enabled: boolean) => {
    setLocalFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled } : f))
    )
    setHasChanges(true)
  }

  const handleSave = () => {
    patchSchema.mutate(
      { fields: localFields },
      {
        onSuccess: () => setHasChanges(false),
      }
    )
  }

  const handleExport = () => {
    exportSchema.mutate()
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string)
        const fields = Array.isArray(parsed?.fields) ? parsed.fields : Array.isArray(parsed) ? parsed : []
        const schemaToImport = {
          schemaId: parsed?.schemaId ?? schema?.schemaId ?? 'schema-imported',
          tenantId: parsed?.tenantId ?? schema?.tenantId ?? 't1',
          fields: fields.map((f: ExportSchemaField, i: number) => ({
            id: f.id ?? `f${Date.now()}-${i}`,
            key: f.key ?? '',
            label: f.label ?? f.key,
            type: f.type ?? 'string',
            enabled: f.enabled ?? true,
            order: f.order ?? i,
          })),
          enabled: parsed?.enabled ?? true,
        }
        importSchema.mutate(
          { schema: schemaToImport },
          { onSuccess: () => setLocalFields(schemaToImport.fields) }
        )
      } catch {
        toast.error('Invalid schema file format')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  if (isLoading) return <LoadingState lines={6} />
  if (error) return <ErrorState message={String(error)} onRetry={() => refetch()} />

  const isValid = localFields.some((f) => f.enabled)

  return (
    <Card className="rounded-2xl shadow-card">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Default Export Schema</CardTitle>
            <CardDescription>
              Define the structure of export CSV/JSON/PDF reports used across audits
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-1" />
              Import
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
              aria-label="Import schema file"
            />
            <Button variant="outline" size="sm" onClick={handleExport} disabled={exportSchema.isPending}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Column definitions</Label>
            <ValidationBadge valid={isValid} message={isValid ? 'Schema valid' : 'Enable at least one field'} />
          </div>
          <div className="space-y-2">
            {(localFields.length > 0 ? localFields : fields).map((field, i) => (
              <div
                key={field.id}
                className={cn(
                  'flex items-center gap-4 rounded-xl border border-border bg-background p-3 transition-all',
                  field.enabled && 'border-primary/30'
                )}
              >
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => moveField(i, 'up')}
                    disabled={i === 0}
                    className="rounded p-0.5 hover:bg-muted disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveField(i, 'down')}
                    disabled={i === (localFields.length || fields.length) - 1}
                    className="rounded p-0.5 hover:bg-muted disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Input
                      value={field.key}
                      readOnly
                      className="font-mono text-sm bg-muted/50"
                    />
                    <span className="text-muted-foreground text-sm">({field.type})</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{field.label}</p>
                </div>
                <Switch
                  checked={field.enabled}
                  onCheckedChange={(v) => toggleField(field.id, v)}
                  aria-label={`Enable ${field.label}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileJson className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Live preview</span>
          </div>
          <pre className="text-xs text-muted-foreground overflow-x-auto max-h-32 overflow-y-auto">
            {JSON.stringify(
              (localFields.length > 0 ? localFields : fields)
                .filter((f) => f.enabled)
                .sort((a, b) => a.order - b.order)
                .map((f) => ({ key: f.key, type: f.type })),
              null,
              2
            )}
          </pre>
        </div>

        {hasChanges && (
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={patchSchema.isPending || !isValid}
            >
              Save changes
            </Button>
          </div>
        )}

        {schema?.updatedAt && (
          <p className="text-xs text-muted-foreground">
            Last updated: {new Date(schema.updatedAt).toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
