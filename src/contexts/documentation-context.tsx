/**
 * DocumentationProvider - Centralize documents data fetch, search, and permissions.
 * API: fetchDocuments(), searchDocuments(query, filters), getCategoryDocs(category)
 */

import * as React from 'react'
import {
  getDocs,
  getDocById,
  getGuides,
  getApiEndpoints,
  getFAQs,
  getReleaseNotes,
  createTicket,
  getTickets,
} from '@/api/documentation'
import type {
  Document,
  Guide,
  ApiEndpoint,
  FAQ,
  ReleaseNote,
  Ticket,
  CreateTicketInput,
  DocCategory,
} from '@/types/documentation'
import { ensureArray } from '@/lib/validation'

interface DocumentationState {
  documents: Document[]
  guides: Guide[]
  endpoints: ApiEndpoint[]
  faqs: FAQ[]
  releaseNotes: ReleaseNote[]
  tickets: Ticket[]
  totalDocs: number
  isLoading: boolean
  error: string | null
}

interface DocumentationContextValue extends DocumentationState {
  searchDocuments: (query: string, category?: DocCategory) => Promise<void>
  fetchDocuments: (category?: DocCategory, offset?: number) => Promise<void>
  getCategoryDocs: (category: DocCategory) => Document[]
  fetchDocById: (id: string) => Promise<Document | null>
  submitTicket: (input: CreateTicketInput) => Promise<Ticket>
  refetch: () => Promise<void>
}

const DocumentationContext = React.createContext<DocumentationContextValue | null>(null)

export function DocumentationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<DocumentationState>({
    documents: [],
    guides: [],
    endpoints: [],
    faqs: [],
    releaseNotes: [],
    tickets: [],
    totalDocs: 0,
    isLoading: false,
    error: null,
  })

  const fetchAll = React.useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }))
    try {
      const [docsRes, guides, endpoints, faqs, notes, tickets] = await Promise.all([
        getDocs({ limit: 50 }),
        getGuides(),
        getApiEndpoints(),
        getFAQs(),
        getReleaseNotes(),
        getTickets(),
      ])

      const docs = Array.isArray(docsRes?.documents) ? docsRes.documents : []
      const total = typeof docsRes?.total === 'number' ? docsRes.total : docs.length

      setState((s) => ({
        ...s,
        documents: docs,
        guides: ensureArray(guides),
        endpoints: ensureArray(endpoints),
        faqs: ensureArray(faqs),
        releaseNotes: ensureArray(notes),
        tickets: ensureArray(tickets),
        totalDocs: total,
        isLoading: false,
        error: null,
      }))
    } catch (err) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to load documentation',
      }))
    }
  }, [])

  React.useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const searchDocuments = React.useCallback(
    async (query: string, category?: DocCategory) => {
      setState((s) => ({ ...s, isLoading: true, error: null }))
      try {
        const res = await getDocs({ search: query, category, limit: 30 })
        const documents = Array.isArray(res?.documents) ? res.documents : []
        const total = typeof res?.total === 'number' ? res.total : documents.length
        setState((s) => ({ ...s, documents, totalDocs: total, isLoading: false, error: null }))
      } catch (err) {
        setState((s) => ({
          ...s,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Search failed',
        }))
      }
    },
    []
  )

  const fetchDocuments = React.useCallback(
    async (category?: DocCategory, offset = 0) => {
      setState((s) => ({ ...s, isLoading: true, error: null }))
      try {
        const res = await getDocs({ category, limit: 20, offset })
        const documents = Array.isArray(res?.documents) ? res.documents : []
        const total = typeof res?.total === 'number' ? res.total : documents.length
        setState((s) => ({
          ...s,
          documents: offset === 0 ? documents : [...s.documents, ...documents],
          totalDocs: total,
          isLoading: false,
          error: null,
        }))
      } catch (err) {
        setState((s) => ({
          ...s,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to load documents',
        }))
      }
    },
    []
  )

  const getCategoryDocs = React.useCallback(
    (category: DocCategory) => {
      return (state.documents ?? []).filter((d) => d.category === category)
    },
    [state.documents]
  )

  const fetchDocById = React.useCallback(async (id: string) => {
    try {
      return await getDocById(id)
    } catch {
      return null
    }
  }, [])

  const submitTicket = React.useCallback(async (input: CreateTicketInput) => {
    const ticket = await createTicket(input)
    setState((s) => ({
      ...s,
      tickets: [...(s.tickets ?? []), ticket],
    }))
    return ticket
  }, [])

  const value: DocumentationContextValue = {
    ...state,
    searchDocuments,
    fetchDocuments,
    getCategoryDocs,
    fetchDocById,
    submitTicket,
    refetch: fetchAll,
  }

  return (
    <DocumentationContext.Provider value={value}>
      {children}
    </DocumentationContext.Provider>
  )
}

export function useDocumentation() {
  const ctx = React.useContext(DocumentationContext)
  if (!ctx) throw new Error('useDocumentation must be used within DocumentationProvider')
  return ctx
}
