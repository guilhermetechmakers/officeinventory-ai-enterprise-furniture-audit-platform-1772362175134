/**
 * InlineEditCard - Generic reusable inline editing surface
 * Used by AttributeEditor for consistent UX
 */

import { useState } from 'react'
import { Pencil, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export interface InlineEditCardProps {
  label: string
  value: string
  onSave: (value: string) => void | Promise<void>
  placeholder?: string
  required?: boolean
  maxLength?: number
  multiline?: boolean
  className?: string
}

export function InlineEditCard({
  label,
  value,
  onSave,
  placeholder = '',
  required = false,
  maxLength = 500,
  multiline = false,
  className,
}: InlineEditCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const displayValue = value ?? ''
  const currentEdit = editValue ?? ''

  const handleStartEdit = () => {
    setEditValue(displayValue)
    setError(null)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setEditValue(displayValue)
    setError(null)
    setIsEditing(false)
  }

  const handleSave = async () => {
    const trimmed = currentEdit.trim()
    if (required && !trimmed) {
      setError('This field is required')
      return
    }
    if (trimmed.length > maxLength) {
      setError(`Maximum ${maxLength} characters`)
      return
    }
    setIsSaving(true)
    setError(null)
    try {
      await onSave(trimmed)
      setIsEditing(false)
    } catch {
      setError('Failed to save')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-4 shadow-card transition-all duration-200',
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <label className="text-sm font-medium text-muted-foreground">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
          {isEditing ? (
            <div className="mt-2 space-y-2">
              {multiline ? (
                <Textarea
                  value={currentEdit}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder={placeholder}
                  maxLength={maxLength}
                  rows={3}
                  aria-label={label}
                  autoFocus
                />
              ) : (
                <Input
                  value={currentEdit}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder={placeholder}
                  maxLength={maxLength}
                  aria-label={label}
                  autoFocus
                />
              )}
              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="rounded-full"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="rounded-full"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-foreground">
              {displayValue || (
                <span className="text-muted-foreground italic">
                  {placeholder || 'Not set'}
                </span>
              )}
            </p>
          )}
        </div>
        {!isEditing && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleStartEdit}
            aria-label={`Edit ${label}`}
            className="shrink-0 rounded-full"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
