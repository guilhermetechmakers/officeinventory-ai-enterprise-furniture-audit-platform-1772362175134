/**
 * AttributeMergeEditor - Authoritative attribute selectors with conflict resolution
 */

import { useCallback } from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ensureArray } from '@/lib/safe-array'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { normalizeAttributes } from '@/lib/merge-utils'
import type { AttributeSchemaField } from '@/types/merge'

export interface AttributeMergeEditorProps {
  attributesSchema: AttributeSchemaField[]
  initialAttributes: Record<string, unknown>
  conflictingValues?: Record<string, unknown[]>
  onChange: (updatedAttributes: Record<string, unknown>) => void
  onSubmit?: () => void
  auditNote: string
  onAuditNoteChange: (note: string) => void
  className?: string
}

const DEFAULT_SCHEMA: AttributeSchemaField[] = [
  { key: 'category', label: 'Category', type: 'text', required: true },
  { key: 'subtype', label: 'Subtype', type: 'text' },
  { key: 'material', label: 'Material', type: 'text' },
  { key: 'finish', label: 'Finish', type: 'text' },
  { key: 'brandModel', label: 'Brand / Model', type: 'text' },
  {
    key: 'condition',
    label: 'Condition',
    type: 'select',
    options: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
  },
  { key: 'notes', label: 'Notes', type: 'text' },
]

export function AttributeMergeEditor({
  attributesSchema = DEFAULT_SCHEMA,
  initialAttributes,
  conflictingValues,
  onChange,
  onSubmit,
  auditNote,
  onAuditNoteChange,
  className,
}: AttributeMergeEditorProps) {
  const schema = ensureArray(attributesSchema).length > 0 ? attributesSchema : DEFAULT_SCHEMA
  const schemaDefaults = Object.fromEntries(
    schema.map((f) => [f.key, ''])
  ) as Record<string, unknown>
  const attrs = normalizeAttributes(initialAttributes, schemaDefaults)
  const conflictKeys = conflictingValues
    ? Object.entries(conflictingValues)
        .filter(([, vals]) => {
          const uniq = new Set(
            ensureArray(vals).filter((v) => v != null && String(v).trim() !== '')
          )
          return uniq.size > 1
        })
        .map(([k]) => k)
    : []

  const handleFieldChange = useCallback(
    (key: string, value: unknown) => {
      onChange({ ...attrs, [key]: value })
    },
    [attrs, onChange]
  )

  const handleResolveConflict = useCallback(
    (key: string, value: unknown) => {
      handleFieldChange(key, value)
    },
    [handleFieldChange]
  )

  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-secondary p-6 shadow-card',
        className
      )}
      role="region"
      aria-label="Attribute merge editor"
    >
      <h3 className="text-base font-bold text-foreground mb-4">
        Authoritative Attributes
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Select the canonical values for each attribute. Conflicting values are highlighted.
      </p>

      <div className="space-y-4">
        {schema.map((field) => {
          const value = attrs[field.key]
          const strVal = value != null ? String(value) : ''
          const hasConflict = conflictKeys.includes(field.key)
          const options = ensureArray(field.options)
          const conflictOptions = conflictingValues?.[field.key]
            ? ensureArray(conflictingValues[field.key]).filter(
                (v) => v != null && String(v).trim() !== ''
              )
            : []

          return (
            <div key={field.key} className="space-y-2">
              <Label
                htmlFor={`attr-${field.key}`}
                className={cn(
                  'text-sm font-medium',
                  hasConflict && 'text-warning'
                )}
              >
                {field.label}
                {field.required && (
                  <span className="text-destructive ml-1" aria-hidden>
                    *
                  </span>
                )}
              </Label>
              {hasConflict && (
                <div
                  className="flex items-center gap-2 rounded-lg bg-warning/10 px-3 py-2 text-xs text-foreground"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 text-warning" />
                  <span>Conflicting values detected</span>
                </div>
              )}
              {field.type === 'select' ? (
                <Select
                  value={strVal}
                  onValueChange={(v) => handleFieldChange(field.key, v)}
                >
                  <SelectTrigger
                    id={`attr-${field.key}`}
                    className={cn(
                      'rounded-xl',
                      hasConflict && 'border-warning ring-1 ring-warning/30'
                    )}
                  >
                    <SelectValue placeholder={`Select ${field.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {options.length > 0 ? (
                      options.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))
                    ) : (
                      conflictOptions.map((opt, i) => (
                        <SelectItem
                          key={i}
                          value={String(opt)}
                          className="data-[highlight]:bg-primary/10"
                        >
                          {String(opt)}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={`attr-${field.key}`}
                  value={strVal}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  placeholder={`Enter ${field.label}`}
                  className={cn(
                    'rounded-xl',
                    hasConflict && 'border-warning ring-1 ring-warning/30'
                  )}
                  required={field.required}
                />
              )}
              {hasConflict && conflictOptions.length > 1 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {conflictOptions.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleResolveConflict(field.key, opt)}
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                        'border border-border bg-card hover:border-primary hover:bg-primary/10',
                        strVal === String(opt) && 'border-primary bg-primary/20'
                      )}
                    >
                      Use: {String(opt)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-6 space-y-2">
        <Label htmlFor="audit-note" className="text-sm font-medium">
          Audit note <span className="text-destructive" aria-hidden>*</span>
        </Label>
        <Textarea
          id="audit-note"
          value={auditNote}
          onChange={(e) => onAuditNoteChange(e.target.value)}
          placeholder="Required: Describe why these attributes were chosen for the merge"
          className="rounded-xl min-h-[100px]"
          required
        />
      </div>

      {onSubmit && (
        <button
          type="button"
          onClick={onSubmit}
          className="mt-6 w-full rounded-full bg-primary py-3 font-medium text-primary-foreground shadow-card transition-all hover:bg-primary/90 hover:shadow-elevated hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
          disabled={!auditNote.trim()}
        >
          Confirm Merge
        </button>
      )}
    </div>
  )
}
