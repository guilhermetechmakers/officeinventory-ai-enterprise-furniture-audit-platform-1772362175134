/**
 * Merge & Duplicate Resolution page
 * Consolidate duplicate detections into canonical records
 */

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { useMergeData } from '@/hooks/use-merge-data'
import {
  DuplicateGroupPanel,
  EvidenceViewer,
  AttributeMergeEditor,
  MergeConfirmationModal,
  MergeActivityLog,
  MergeToolbar,
} from '@/components/merge'
import { ensureArray } from '@/lib/safe-array'
import { normalizeAttributes } from '@/lib/merge-utils'
import type { AttributeSchemaField, EvidenceItem } from '@/types/merge'

const ATTRIBUTES_SCHEMA: AttributeSchemaField[] = [
  { key: 'category', label: 'Category', type: 'text', required: true },
  { key: 'subtype', label: 'Subtype', type: 'text' },
  { key: 'material', label: 'Material', type: 'text' },
  { key: 'finish', label: 'Finish', type: 'text' },
  { key: 'brandModel', label: 'Brand / Model', type: 'text' },
  {
    key: 'condition',
    label: 'Condition',
    type: 'select',
    options: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
  },
  { key: 'notes', label: 'Notes', type: 'text' },
]

export function MergePage() {
  const {
    groups,
    logs,
    isLoadingGroups,
    isLoadingEvidence,
    isMerging,
    loadEvidence,
    getInitialAttributes,
    getConflictingValues,
    performMerge,
    performUndo,
  } = useMergeData()

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [evidence, setEvidence] = useState<EvidenceItem[]>([])
  const [mergedAttributes, setMergedAttributes] = useState<Record<string, unknown>>({})
  const [auditNote, setAuditNote] = useState('')
  const [canonicalItemId, setCanonicalItemId] = useState<string | null>(null)
  const [confirmationOpen, setConfirmationOpen] = useState(false)

  const selectedGroup = ensureArray(groups).find((g) => g?.id === selectedGroupId) ?? null
  const itemIds = ensureArray(selectedGroup?.itemIds)
  const conflictingValues = selectedGroupId
    ? getConflictingValues(itemIds)
    : {}

  const isMergeEnabled =
    Boolean(auditNote?.trim()) &&
    Boolean(canonicalItemId) &&
    Boolean(selectedGroup?.id)

  const handleSelectGroup = useCallback(
    async (groupId: string) => {
      setSelectedGroupId(groupId)
      setEvidence([])
      const group = ensureArray(groups).find((g) => g?.id === groupId)
      const ids = ensureArray(group?.itemIds)
      if (ids.length > 0) {
        setCanonicalItemId(ids[0])
        setMergedAttributes(normalizeAttributes(getInitialAttributes(ids)))
      }
      const ev = await loadEvidence(groupId)
      setEvidence(ev)
    },
    [groups, loadEvidence, getInitialAttributes]
  )

  const handleMergeGroup = useCallback(
    async (groupId: string) => {
      await handleSelectGroup(groupId)
      setConfirmationOpen(true)
    },
    [handleSelectGroup]
  )

  const handleSelectCanonical = useCallback(
    (itemId: string) => {
      setCanonicalItemId(itemId)
      const attrs = getInitialAttributes([itemId])
      if (attrs && Object.keys(attrs).length > 0) {
        setMergedAttributes((prev) => ({ ...prev, ...attrs }))
      }
    },
    [getInitialAttributes]
  )

  const handleAttributesChange = useCallback((attrs: Record<string, unknown>) => {
    setMergedAttributes(attrs)
  }, [])

  const handleConfirmMerge = useCallback(() => {
    setConfirmationOpen(true)
  }, [])

  const handleConfirmMergePayload = useCallback(
    async (payload: {
      canonicalItemId: string
      mergedAttributes: Record<string, unknown>
      evidenceReferences: string[]
      auditNote: string
      sourceGroupIds: string[]
    }) => {
      const res = await performMerge(payload)
      if (res?.success) {
        setSelectedGroupId(null)
        setEvidence([])
        setAuditNote('')
        setCanonicalItemId(null)
        setMergedAttributes({})
        setConfirmationOpen(false)
        toast.success('Merge completed successfully')
      } else {
        toast.error('Merge failed')
      }
    },
    [performMerge]
  )

  const handleUndo = useCallback(
    async (mergeId: string) => {
      const ok = await performUndo(mergeId)
      if (ok) {
        toast.success('Merge undone')
      } else {
        toast.error('Undo failed')
      }
    },
    [performUndo]
  )

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Merge & Duplicate Resolution
        </h1>
        <p className="text-muted-foreground mt-1">
          Identify duplicate detections, review evidence, and merge into canonical
          records with an auditable trail.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-6">
          <DuplicateGroupPanel
            groups={groups}
            selectedGroupId={selectedGroupId}
            onSelectGroup={handleSelectGroup}
            onMergeGroup={handleMergeGroup}
            isLoading={isLoadingGroups}
          />
          <MergeActivityLog logs={logs} onUndo={handleUndo} maxItems={8} />
        </div>

        <div className="lg:col-span-8 space-y-6">
          {selectedGroup && (
            <>
              <MergeToolbar
                isMergeEnabled={isMergeEnabled}
                onConfirmMerge={handleConfirmMerge}
                isLoading={isMerging}
              />
              <EvidenceViewer
                evidenceList={evidence}
                canonicalItemId={canonicalItemId ?? undefined}
                onSelectCanonical={handleSelectCanonical}
                isLoading={isLoadingEvidence}
              />
              <AttributeMergeEditor
                attributesSchema={ATTRIBUTES_SCHEMA}
                initialAttributes={mergedAttributes}
                conflictingValues={conflictingValues}
                onChange={handleAttributesChange}
                auditNote={auditNote}
                onAuditNoteChange={setAuditNote}
              />
            </>
          )}
          {!selectedGroup && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 py-24">
              <p className="text-sm font-medium text-foreground">
                Select a duplicate group to inspect
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Use Inspect or Merge on a candidate group
              </p>
            </div>
          )}
        </div>
      </div>

      <MergeConfirmationModal
        open={confirmationOpen}
        onOpenChange={setConfirmationOpen}
        selectedGroup={selectedGroup}
        canonicalCandidateId={canonicalItemId}
        mergedAttributes={mergedAttributes}
        auditNote={auditNote}
        onAuditNoteChange={setAuditNote}
        onConfirm={handleConfirmMergePayload}
        onCancel={() => setConfirmationOpen(false)}
        isSubmitting={isMerging}
      />
    </div>
  )
}
