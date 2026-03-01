/** React Query hooks for Documentation Center */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchDocuments,
  fetchDocument,
  fetchGuideSteps,
  fetchEndpoints,
  fetchFaqs,
  fetchReleaseNotes,
  createTicket,
} from '@/api/documentation'
import type { FAQ, DocsListParams } from '@/types/documentation'

const DOCS_KEYS = {
  all: ['docs'] as const,
  list: (params: DocsListParams) => ['docs', 'list', params] as const,
  detail: (id: string) => ['docs', 'detail', id] as const,
  steps: (guideId: string) => ['docs', 'steps', guideId] as const,
  endpoints: () => ['docs', 'endpoints'] as const,
  faqs: () => ['docs', 'faqs'] as const,
  releaseNotes: () => ['docs', 'release-notes'] as const,
}

export function useDocsList(params: DocsListParams) {
  return useQuery({
    queryKey: DOCS_KEYS.list(params),
    queryFn: () => fetchDocuments(params),
  })
}

export function useDocDetail(id: string | null) {
  return useQuery({
    queryKey: DOCS_KEYS.detail(id ?? ''),
    queryFn: () => fetchDocument(id!),
    enabled: !!id,
  })
}

export function useGuideSteps(guideId: string | null) {
  return useQuery({
    queryKey: DOCS_KEYS.steps(guideId ?? ''),
    queryFn: () => fetchGuideSteps(guideId!),
    enabled: !!guideId,
  })
}

export function useApiEndpoints() {
  return useQuery({
    queryKey: DOCS_KEYS.endpoints(),
    queryFn: fetchEndpoints,
  })
}

export function useFaqs(search?: string) {
  return useQuery({
    queryKey: DOCS_KEYS.faqs(),
    queryFn: fetchFaqs,
    select: (data: FAQ[] | undefined) => {
      const items = (data ?? []) as FAQ[]
      if (!search?.trim()) return items
      const q = search.toLowerCase()
      return items.filter(
        (f: FAQ) =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q) ||
          (f.tags ?? []).some((t: string) => t.toLowerCase().includes(q))
      )
    },
  })
}

export function useReleaseNotes() {
  return useQuery({
    queryKey: DOCS_KEYS.releaseNotes(),
    queryFn: fetchReleaseNotes,
  })
}

export function useCreateTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCS_KEYS.all })
    },
  })
}
