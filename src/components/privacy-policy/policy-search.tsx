/**
 * PolicySearch - Optional search field that filters visible sections by query.
 * Debounced to avoid excessive re-renders. Highlights matches in content.
 */

import { useState, useRef, useCallback } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface PolicySearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  id?: string
}

const DEBOUNCE_MS = 200

export function PolicySearch({
  value,
  onChange,
  placeholder = 'Search within policy...',
  className,
  id = 'policy-search',
}: PolicySearchProps) {
  const [localValue, setLocalValue] = useState(value)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value
      setLocalValue(v)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => onChange(v), DEBOUNCE_MS)
    },
    [onChange]
  )

  return (
    <div className={cn('relative', className)}>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
        aria-hidden
      />
      <Input
        id={id}
        type="search"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-10 rounded-full"
        aria-label="Search within privacy policy"
        autoComplete="off"
      />
    </div>
  )
}
