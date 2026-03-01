/**
 * useMergeData - Data fetching for Merge & Duplicate Resolution page
 */

import { useState, useCallback, useEffect } from 'react'
import {
  fetchDuplicateGroups,
  fetchEvidenceForGroup,
  getAttributesForItems,
  buildConflictingValues,
  mergeDuplicates,
  undoMerge,
  fetchAuditLogs,
} from '@/api/merge'
import { resolveConflicts } from '@/lib/merge-utils'
import type {
  Group,
  EvidenceItem,
  LogEntry,
  MergePayload,
} from '@/types/merge'

export function useMergeData() {
  const [groups, setGroups] = useState<Group[]>([])
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isLoadingGroups, setIsLoadingGroups] = useState(true)
  const [isLoadingEvidence, setIsLoadingEvidence] = useState(false)
  const [isMerging, setIsMerging] = useState(false)

  const loadGroups = useCallback(async () => {
    setIsLoadingGroups(true)
    try {
      const data = await fetchDuplicateGroups()
      setGroups(Array.isArray(data) ? data : [])
    } catch {
      setGroups([])
    } finally {
      setIsLoadingGroups(false)
    }
  }, [])

  const loadLogs = useCallback(async () => {
    try {
      const data = await fetchAuditLogs(20)
      setLogs(Array.isArray(data) ? data : [])
    } catch {
      setLogs([])
    }
  }, [])

  useEffect(() => {
    loadGroups()
    loadLogs()
  }, [loadGroups, loadLogs])

  const loadEvidence = useCallback(async (groupId: string): Promise<EvidenceItem[]> => {
    setIsLoadingEvidence(true)
    try {
      const data = await fetchEvidenceForGroup(groupId)
      return Array.isArray(data) ? data : []
    } catch {
      return []
    } finally {
      setIsLoadingEvidence(false)
    }
  }, [])

  const getInitialAttributes = useCallback(
    (itemIds: string[]): Record<string, unknown> => {
      const attrsList = getAttributesForItems(itemIds)
      if (attrsList.length === 0) return {}
      const merged: Record<string, unknown> = {}
      for (const attrs of attrsList) {
        if (!attrs || typeof attrs !== 'object') continue
        for (const [key, val] of Object.entries(attrs)) {
          if (val != null && String(val).trim() !== '') {
            const { suggested } = resolveConflicts(merged[key], val)
            merged[key] = suggested ?? val
          }
        }
      }
      return merged
    },
    []
  )

  const getConflictingValues = useCallback((itemIds: string[]) => {
    const attrsList = getAttributesForItems(itemIds)
    return buildConflictingValues(attrsList)
  }, [])

  const performMerge = useCallback(async (payload: MergePayload) => {
    setIsMerging(true)
    try {
      const res = await mergeDuplicates(payload)
      if (res?.success) {
        await loadGroups()
        await loadLogs()
        return res
      }
      return null
    } catch {
      return null
    } finally {
      setIsMerging(false)
    }
  }, [loadGroups, loadLogs])

  const performUndo = useCallback(
    async (mergeId: string) => {
      try {
        const res = await undoMerge(mergeId)
        if (res?.success) {
          await loadGroups()
          await loadLogs()
          return true
        }
      } catch {
        // ignore
      }
      return false
    },
    [loadGroups, loadLogs]
  )

  return {
    groups,
    logs,
    isLoadingGroups,
    isLoadingEvidence,
    isMerging,
    loadGroups,
    loadLogs,
    loadEvidence,
    getInitialAttributes,
    getConflictingValues,
    performMerge,
    performUndo,
  }
}
