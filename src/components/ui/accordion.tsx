import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccordionItemContextValue {
  value: string
  open: boolean
  onToggle: () => void
}

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null)

function useAccordionItem() {
  const ctx = React.useContext(AccordionItemContext)
  if (!ctx) throw new Error('AccordionTrigger/AccordionContent must be used within AccordionItem')
  return ctx
}

interface AccordionProps {
  type?: 'single' | 'multiple'
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  children: React.ReactNode
  className?: string
}

function Accordion({
  type = 'single',
  value,
  onValueChange,
  children,
  className,
}: AccordionProps) {
  const [internalValue, setInternalValue] = React.useState<string | string[]>(
    value ?? (type === 'multiple' ? [] : '')
  )
  const isControlled = value !== undefined
  const current = isControlled ? value : internalValue

  const handleToggle = React.useCallback(
    (itemValue: string) => {
      if (type === 'single') {
        const cur = Array.isArray(current) ? '' : (current as string)
        const newVal = cur === itemValue ? '' : itemValue
        if (!isControlled) setInternalValue(newVal)
        onValueChange?.(newVal)
      } else {
        const arr = Array.isArray(current) ? [...current] : (current ? [current as string] : [])
        const idx = arr.indexOf(itemValue)
        const newArr = idx >= 0 ? arr.filter((_, i) => i !== idx) : [...arr, itemValue]
        if (!isControlled) setInternalValue(newArr)
        onValueChange?.(newArr)
      }
    },
    [type, current, isControlled, onValueChange]
  )

  const isOpen = (itemValue: string) =>
    type === 'single'
      ? (Array.isArray(current) ? '' : (current as string)) === itemValue
      : Array.isArray(current) && current.includes(itemValue)

  return (
    <div className={cn('space-y-1', className)} role="region" aria-label="Accordion">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === AccordionItem) {
          const itemValue = (child.props as { value: string }).value
          const ctx: AccordionItemContextValue = {
            value: itemValue,
            open: isOpen(itemValue),
            onToggle: () => handleToggle(itemValue),
          }
          return (
            <AccordionItemContext.Provider key={itemValue} value={ctx}>
              {child}
            </AccordionItemContext.Provider>
          )
        }
        return child
      })}
    </div>
  )
}

interface AccordionItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

function AccordionItem({ value: _value, children, className }: AccordionItemProps) {
  const { open } = useAccordionItem()
  return (
    <div
      className={cn('rounded-xl border border-border bg-card overflow-hidden', className)}
      data-state={open ? 'open' : 'closed'}
    >
      {children}
    </div>
  )
}

interface AccordionTriggerProps {
  children: React.ReactNode
  className?: string
}

function AccordionTrigger({ children, className }: AccordionTriggerProps) {
  const { open, onToggle } = useAccordionItem()
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'flex w-full items-center justify-between gap-4 px-6 py-4 text-left font-medium transition-colors',
        'hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      aria-expanded={open}
    >
      {children}
      <ChevronDown
        className={cn(
          'h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200',
          open && 'rotate-180'
        )}
      />
    </button>
  )
}

interface AccordionContentProps {
  children: React.ReactNode
  className?: string
}

function AccordionContent({ children, className }: AccordionContentProps) {
  const { open } = useAccordionItem()
  if (!open) return null
  return (
    <div className={cn('px-6 pb-4 pt-0 text-sm text-muted-foreground animate-fade-in', className)}>
      {children}
    </div>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
