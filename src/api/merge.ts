/**
 * Merge & Duplicate Resolution API
 * Future-proof for backend integration
 */

import { apiGet, apiPost } from '@/lib/api'
import { ensureArray } from '@/lib/safe-array'
import type {
  Group,
  EvidenceItem,
  LogEntry,
  MergePayload,
  CanonicalItem,
} from '@/types/merge'
import {
  MOCK_GROUPS,
  MOCK_EVIDENCE,
  MOCK_ATTRIBUTES_BY_ITEM,
  MOCK_AUDIT_LOGS,
} from '@/data/merge-mocks'

const USE_MOCK = true // Toggle when backend is ready

export interface MergeResponse {
  success: boolean
  mergeId: string
  canonicalItem: CanonicalItem
}

export interface UndoMergeResponse {
  success: boolean
  restoredItems: string[]
}

export interface AuditLogsResponse {
  logs: LogEntry[]
}

/** Fetch candidate duplicate groups */
export async function fetchDuplicateGroups(): Promise<Group[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400))
    return [...MOCK_GROUPS]
  }
  const data = await apiGet<{ groups?: Group[] }>('/merge/duplicate-groups')
  return Array.isArray(data?.groups) ? data.groups : []
}

/** Fetch evidence for a group */
export async function fetchEvidenceForGroup(groupId: string): Promise<EvidenceItem[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200))
    const list = MOCK_EVIDENCE[groupId] ?? []
    return [...list]
  }
  const data = await apiGet<{ evidence?: EvidenceItem[] }>(
    `/merge/evidence?groupId=${encodeURIComponent(groupId)}`
  )
  return Array.isArray(data?.evidence) ? data.evidence : []
}

/** Fetch attributes for items in a group (for conflict detection) */
export function getAttributesForItems(itemIds: string[]): Record<string, unknown>[] {
  const ids = ensureArray(itemIds)
  return ids.map((id) => MOCK_ATTRIBUTES_BY_ITEM[id] ?? {})
}

/** Build conflicting values map from item attributes */
export function buildConflictingValues(
  itemAttributes: Record<string, unknown>[]
): Record<string, unknown[]> {
  const list = ensureArray(itemAttributes)
  const result: Record<string, unknown[]> = {}
  const allKeys = new Set<string>()
  list.forEach((attrs) => {
    if (attrs && typeof attrs === 'object') {
      Object.keys(attrs).forEach((k) => allKeys.add(k))
    }
  })
  for (const key of allKeys) {
    const values = list
      .map((a) => a?.[key])
      .filter((v) => v != null && String(v).trim() !== '')
    const seen = new Set<string>()
    const unique: unknown[] = []
    for (const v of values) {
      const s = String(v)
      if (!seen.has(s)) {
        seen.add(s)
        unique.push(v)
      }
    }
    if (unique.length > 1) {
      result[key] = unique
    }
  }
  return result
}

/** Merge duplicates - POST /merge-duplicates */
export async function mergeDuplicates(payload: MergePayload): Promise<MergeResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600))
    return {
      success: true,
      mergeId: `merge-${Date.now()}`,
      canonicalItem: {
        id: payload.canonicalItemId,
        attributes: payload.mergedAttributes,
        sourceItemIds: payload.evidenceReferences,
        mergedAt: new Date().toISOString(),
        auditNote: payload.auditNote,
      },
    }
  }
  return apiPost<MergeResponse>('/merge/merge-duplicates', payload)
}

/** Undo merge - POST /undo-merge */
export async function undoMerge(mergeId: string): Promise<UndoMergeResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400))
    return {
      success: true,
      restoredItems: [],
    }
  }
  return apiPost<UndoMergeResponse>('/merge/undo-merge', { mergeId })
}

/** Fetch audit logs */
export async function fetchAuditLogs(limit = 20): Promise<LogEntry[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200))
    return [...MOCK_AUDIT_LOGS]
  }
  const data = await apiGet<AuditLogsResponse>(
    `/merge/audit-logs?limit=${limit}`
  )
  return Array.isArray(data?.logs) ? data.logs : []
}
