/**
 * FAQSection - Accordion-based FAQs with search and tags.
 */

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { FAQ } from '@/types/documentation'

export interface FAQSectionProps {
  faqs: FAQ[]
  isLoading?: boolean
  className?: string
}

export function FAQSection({ faqs, isLoading = false, className }: FAQSectionProps) {
  const [search, setSearch] = useState('')
  const safeFaqs = faqs ?? []

  const filtered = useMemo(() => {
    if (!search.trim()) return safeFaqs
    const q = search.toLowerCase()
    return safeFaqs.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        (f.tags ?? []).some((t) => t.toLowerCase().includes(q))
    )
  }, [safeFaqs, search])

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        <Skeleton className="h-11 w-full max-w-md rounded-xl" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
    )
  }

  if (safeFaqs.length === 0) {
    return (
      <div className={cn('rounded-2xl border border-dashed border-border bg-card/50 py-12 px-6 text-center', className)}>
        <p className="text-muted-foreground">No FAQs available.</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search FAQs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12 rounded-xl"
          aria-label="Search FAQs"
        />
      </div>

      <Accordion type="single" className="space-y-2">
        {filtered.map((faq) => {
          const tags = faq.tags ?? []
          const safeTags = Array.isArray(tags) ? tags : []
          return (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger>{(faq as FAQ).question}</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2">
                  <p className="text-muted-foreground">{(faq as FAQ).answer}</p>
                  {safeTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {safeTags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>

      {filtered.length === 0 && (
        <p className="text-muted-foreground text-center py-8">No matches for "{search}".</p>
      )}
    </div>
  )
}
