/** Documentation Center API - documents, search, tickets */

import { apiGet, apiPost } from '@/lib/api'
import { ensureArray } from '@/lib/validation'
import {
  mockDocuments,
  mockGuides,
  mockEndpoints,
  mockFaqs,
  mockReleaseNotes,
} from '@/data/documentation-mocks'
import type {
  Document,
  Guide,
  Endpoint,
  FAQ,
  ReleaseNote,
  Ticket,
  CreateTicketInput,
  DocsResponse,
  DocCategory,
} from '@/types/documentation'

const USE_MOCK = true

function safeDocs(data: unknown): Document[] {
  return ensureArray<Document>(data).length > 0 ? ensureArray<Document>(data) : mockDocuments
}

/** GET /docs?category=&search=&limit=&offset= */
export async function getDocs(params?: {
  category?: DocCategory
  search?: string
  limit?: number
  offset?: number
}): Promise<DocsResponse> {
  if (USE_MOCK) {
    let docs = [...mockDocuments]
    const search = params?.search?.toLowerCase() ?? ''
    const category = params?.category

    if (search) {
      docs = docs.filter(
        (d) =>
          d.title.toLowerCase().includes(search) ||
          d.excerpt.toLowerCase().includes(search) ||
          (d.tags ?? []).some((t) => t.toLowerCase().includes(search))
      )
    }
    if (category && category !== 'Contact') {
      docs = docs.filter((d) => d.category === category)
    }

    const limit = params?.limit ?? 20
    const offset = params?.offset ?? 0
    const total = docs.length
    docs = docs.slice(offset, offset + limit)

    return { documents: docs, total }
  }

  const q = new URLSearchParams()
  if (params?.category) q.set('category', params.category)
  if (params?.search) q.set('search', params.search)
  if (params?.limit) q.set('limit', String(params.limit))
  if (params?.offset) q.set('offset', String(params.offset))

  const res = await apiGet<{ data?: Document[]; total?: number }>(`/docs?${q}`)
  const documents = Array.isArray(res?.data) ? res.data : safeDocs(res)
  const total = typeof res?.total === 'number' ? res.total : documents.length
  return { documents, total }
}

/** GET /docs/:id */
export async function getDocById(id: string): Promise<Document | null> {
  if (USE_MOCK) {
    const doc = mockDocuments.find((d) => d.id === id) ?? null
    if (doc && doc.category === 'Guides') {
      const guide = mockGuides.find((g) => g.id === id)
      return (guide ?? doc) as Document
    }
    return doc
  }

  try {
    const res = await apiGet<Document>(`/docs/${id}`)
    return res && typeof res === 'object' ? res : null
  } catch {
    return null
  }
}

/** GET /docs/guides - returns guides with steps */
export async function getGuides(): Promise<Guide[]> {
  if (USE_MOCK) return mockGuides
  const res = await apiGet<Guide[] | { data?: Guide[] }>('/docs/guides')
  return Array.isArray(res) ? res : ensureArray<Guide>(res?.data)
}

/** GET /docs/api/endpoints */
export async function getApiEndpoints(): Promise<Endpoint[]> {
  if (USE_MOCK) return mockEndpoints
  const res = await apiGet<Endpoint[] | { data?: Endpoint[] }>('/docs/api/endpoints')
  return Array.isArray(res) ? res : ensureArray<Endpoint>(res?.data)
}

/** GET /docs/faqs */
export async function getFAQs(): Promise<FAQ[]> {
  if (USE_MOCK) return mockFaqs
  const res = await apiGet<FAQ[] | { data?: FAQ[] }>('/docs/faqs')
  return Array.isArray(res) ? res : ensureArray<FAQ>(res?.data)
}

/** Alias for use-documentation hook - returns DocsListResponse */
export async function fetchDocuments(params?: {
  category?: DocCategory
  search?: string
  limit?: number
  offset?: number
}): Promise<{ items: Document[]; total: number }> {
  const res = await getDocs(params)
  return { items: res.documents ?? [], total: res.total ?? 0 }
}

/** Alias for use-documentation hook */
export async function fetchDocument(id: string | null): Promise<Document | null> {
  return id ? getDocById(id) : null
}

/** Get guide steps for a guide */
export async function fetchGuideSteps(guideId: string | null): Promise<import('@/types/documentation').GuideStep[]> {
  if (!guideId) return []
  const guides = await getGuides()
  const guide = (guides ?? []).find((g: { id: string }) => g.id === guideId)
  return (guide?.steps ?? []) as import('@/types/documentation').GuideStep[]
}

/** Alias */
export const fetchEndpoints = getApiEndpoints
export const fetchFaqs = getFAQs
export const fetchReleaseNotes = getReleaseNotes

/** GET /docs/release-notes */
export async function getReleaseNotes(): Promise<ReleaseNote[]> {
  if (USE_MOCK) return mockReleaseNotes
  const res = await apiGet<ReleaseNote[] | { data?: ReleaseNote[] }>('/docs/release-notes')
  return Array.isArray(res) ? res : ensureArray<ReleaseNote>(res?.data)
}

/** POST /tickets */
export async function createTicket(input: CreateTicketInput): Promise<Ticket> {
  const priority = input.priority === 'critical' ? 'urgent' : input.priority
  if (USE_MOCK) {
    const ticket: Ticket = {
      id: `ticket-${Date.now()}`,
      userId: 'user-mock',
      subject: input.subject,
      description: input.description,
      category: input.category,
      priority: priority as Ticket['priority'],
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return ticket
  }

  const res = await apiPost<Ticket>('/tickets', { ...input, priority })
  if (res && typeof res === 'object' && 'id' in res) return res as Ticket
  throw new Error('Failed to create ticket')
}

/** GET /tickets?status=&userId= */
export async function getTickets(params?: {
  status?: string
  userId?: string
}): Promise<Ticket[]> {
  if (USE_MOCK) return []
  const q = new URLSearchParams()
  if (params?.status) q.set('status', params.status)
  if (params?.userId) q.set('userId', params.userId)
  const res = await apiGet<Ticket[] | { data?: Ticket[] }>(`/tickets?${q}`)
  return Array.isArray(res) ? res : ensureArray<Ticket>(res?.data)
}
