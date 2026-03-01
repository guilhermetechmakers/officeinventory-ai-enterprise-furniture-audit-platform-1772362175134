/**
 * useBulkExport - Prepares and triggers export with null-safe handling
 */

import { useState, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { exportReviewItems } from '@/api/review-queue'
import { toast } from 'sonner'

export type ExportFormat = 'csv' | 'pdf'

export interface UseBulkExportResult {
  exportItems: (itemIds: string[], format: ExportFormat) => Promise<void>
  isExporting: boolean
}

export function useBulkExport(): UseBulkExportResult {
  const [isExporting, setIsExporting] = useState(false)
  const queryClient = useQueryClient()

  const exportMutation = useMutation({
    mutationFn: async ({ itemIds, format }: { itemIds: string[]; format: ExportFormat }) => {
      const ids = Array.isArray(itemIds) ? itemIds : []
      if (ids.length === 0) throw new Error('No items selected')
      const result = await exportReviewItems(ids, format)
      if (result.error) throw new Error(result.error)
      return result
    },
    onSuccess: (data, variables) => {
      if (data?.url) {
        const a = document.createElement('a')
        a.href = data.url
        a.download = `review-queue-export.${variables.format}`
        a.click()
        URL.revokeObjectURL(data.url)
        toast.success(`Exported ${variables.itemIds.length} items as ${variables.format.toUpperCase()}`)
      }
      queryClient.invalidateQueries({ queryKey: ['review-queue'] })
    },
    onError: (err: Error) => {
      toast.error(err?.message ?? 'Export failed')
    },
    onSettled: () => {
      setIsExporting(false)
    },
  })

  const exportItems = useCallback(
    async (itemIds: string[], format: ExportFormat) => {
      const ids = Array.isArray(itemIds) ? itemIds : []
      if (ids.length === 0) {
        toast.error('No items selected for export')
        return
      }
      setIsExporting(true)
      await exportMutation.mutateAsync({ itemIds: ids, format })
    },
    [exportMutation]
  )

  return {
    exportItems,
    isExporting: isExporting || exportMutation.isPending,
  }
}
