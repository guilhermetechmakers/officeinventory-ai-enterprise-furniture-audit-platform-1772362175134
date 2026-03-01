/**
 * AttributeEditor - Field set for category, subtype, material/finish, brand/model, condition, notes
 * Inline editing with per-field save/cancel and validation
 */

import { useCallback } from 'react'
import { InlineEditCard } from './inline-edit-card'
import type { ItemAttributes } from '@/types/item-detail'

const ATTRIBUTE_FIELDS: Array<{
  key: keyof ItemAttributes
  label: string
  required?: boolean
  multiline?: boolean
}> = [
  { key: 'category', label: 'Category', required: true },
  { key: 'subtype', label: 'Subtype' },
  { key: 'material', label: 'Material' },
  { key: 'finish', label: 'Finish' },
  { key: 'brandModel', label: 'Brand / Model' },
  { key: 'condition', label: 'Condition' },
  { key: 'notes', label: 'Notes', multiline: true },
]

export interface AttributeEditorProps {
  attributes: ItemAttributes | null
  onSave: (attributes: Partial<ItemAttributes>) => void | Promise<void>
  className?: string
}

export function AttributeEditor({
  attributes,
  onSave,
  className,
}: AttributeEditorProps) {
  const attrs = attributes ?? {}

  const handleFieldSave = useCallback(
    (key: keyof ItemAttributes, value: string) => {
      return onSave({ [key]: value })
    },
    [onSave]
  )

  return (
    <div
      className={className}
      role="region"
      aria-label="Item attributes"
    >
      <h3 className="text-base font-semibold text-foreground mb-4">
        Attributes
      </h3>
      <div className="space-y-4">
        {ATTRIBUTE_FIELDS.map(({ key, label, required, multiline }) => (
          <InlineEditCard
            key={key}
            label={label}
            value={attrs[key] ?? ''}
            onSave={(v) => handleFieldSave(key, v)}
            required={required}
            multiline={multiline}
            maxLength={multiline ? 1000 : 200}
          />
        ))}
      </div>
    </div>
  )
}
