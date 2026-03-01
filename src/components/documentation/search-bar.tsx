/**
 * SearchBar - Global search input with debounce and category scope.
 */

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface SearchBarProps {
  value?: string
  onChange?: (value: string) => void
  onSubmit?: (value: string) => void
  onSelectSuggestion?: (item: { title: string; id: string }) => void
  suggestions?: Array<{ id: string; title: string; category?: string }>
  placeholder?: string
  className?: string
}

export function SearchBar({
  value: controlledValue,
  onChange,
  onSubmit,
  onSelectSuggestion,
  suggestions = [],
  placeholder = 'Search documentation...',
  className,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(controlledValue ?? '')
  const [isFocused, setIsFocused] = useState(false)
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : localValue

  useEffect(() => {
    if (isControlled && controlledValue !== localValue) {
      setLocalValue(controlledValue ?? '')
    }
  }, [isControlled, controlledValue])


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(value)
  }

  const safeSuggestions = Array.isArray(suggestions) ? suggestions : []
  const showSuggestions = isFocused && value.length > 0 && safeSuggestions.length > 0

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={value}
          onChange={(e) => {
            const v = e.target.value
            if (!isControlled) setLocalValue(v)
            onChange?.(v)
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          placeholder={placeholder}
          className="h-12 pl-12 pr-4 rounded-2xl border-border bg-secondary shadow-sm focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Search documentation"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
        />
      </div>
      {showSuggestions && (
        <ul
          className="absolute top-full left-0 right-0 z-50 mt-2 rounded-2xl border border-border bg-card shadow-overlay py-2 animate-fade-in"
          role="listbox"
        >
          {safeSuggestions.slice(0, 8).map((s) => (
            <li key={s.id}>
              <button
                type="button"
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-primary/10 focus:bg-primary/10 focus:outline-none flex flex-col"
                onClick={() => {
                  onSelectSuggestion?.({ title: s.title, id: s.id })
                  setLocalValue(s.title)
                  onChange?.(s.title)
                  setIsFocused(false)
                }}
                role="option"
              >
                <span className="font-medium text-foreground">{s.title}</span>
                {s.category && (
                  <span className="text-xs text-muted-foreground">{s.category}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  )
}
