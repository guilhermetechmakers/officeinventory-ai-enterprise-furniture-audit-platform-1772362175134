/**
 * PolicyContentRenderer - Converts policy payload into structured sections.
 * Handles rich text, lists, and preserves hierarchy. Null-safe for API responses.
 */

import { PolicySection } from './policy-section'
import type { PolicySection as PolicySectionType } from '@/types/privacy-policy'

export interface PolicyContentRendererProps {
  sections: PolicySectionType[] | null | undefined
  searchQuery?: string
  /** Filter sections by search - only show matching sections when query present */
  filterBySearch?: boolean
}

/** Check if section or its subsections match search query */
function sectionMatchesSearch(
  section: PolicySectionType,
  query: string
): boolean {
  const q = query?.toLowerCase().trim()
  if (!q) return true
  const match = (s: PolicySectionType) =>
    (s.title?.toLowerCase().includes(q) ?? false) ||
    (s.body?.toLowerCase().includes(q) ?? false)
  if (match(section)) return true
  const subs = section.subsections ?? []
  return subs.some((sub) => sectionMatchesSearch(sub, q))
}

export function PolicyContentRenderer({
  sections,
  searchQuery,
  filterBySearch = true,
}: PolicyContentRendererProps) {
  const safeSections = Array.isArray(sections) ? sections : []
  const filtered =
    filterBySearch && searchQuery?.trim()
      ? safeSections.filter((s) => sectionMatchesSearch(s, searchQuery))
      : safeSections

  if (filtered.length === 0) {
    return (
      <p className="text-muted-foreground py-8" role="status">
        {searchQuery?.trim()
          ? 'No sections match your search. Try different keywords.'
          : 'No policy content available.'}
      </p>
    )
  }

  return (
    <div className="space-y-8" role="article">
      {filtered.map((section) => (
        <PolicySection
          key={section.id}
          section={section}
          level="h2"
          searchQuery={searchQuery}
        />
      ))}
    </div>
  )
}
