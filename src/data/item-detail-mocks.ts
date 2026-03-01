/**
 * Mock data for Item Detail & Evidence page
 * Used when APIs are not yet wired
 */

import type { ItemDetail } from '@/types/item-detail'

export const mockItemDetail: ItemDetail = {
  id: 'di1',
  auditId: 'a1',
  croppedDetectionImageUrl:
    'https://placehold.co/400x300/e8e9ec/6b6b6b?text=Chair+Crop',
  sourceImages: [
    {
      id: 'si1',
      url: 'https://placehold.co/800x600/e8e9ec/6b6b6b?text=Source+1',
      thumbnailUrl: 'https://placehold.co/120x90/e8e9ec/6b6b6b?text=S1',
    },
    {
      id: 'si2',
      url: 'https://placehold.co/800x600/e8e9ec/6b6b6b?text=Source+2',
      thumbnailUrl: 'https://placehold.co/120x90/e8e9ec/6b6b6b?text=S2',
    },
  ],
  attributes: {
    category: 'Office Chair',
    subtype: 'Task Chair',
    material: 'Mesh',
    finish: 'Black',
    brandModel: 'Herman Miller Aeron',
    condition: 'Good',
    notes: 'Size B, fully adjustable',
  },
  confidenceHistory: [
    {
      versionId: 'v1',
      score: 92,
      changedAt: '2025-03-01T09:15:00Z',
      changedBy: 'AI Pipeline',
      notes: 'Initial detection',
    },
    {
      versionId: 'v2',
      score: 95,
      changedAt: '2025-03-01T10:30:00Z',
      changedBy: 'Jane Smith',
      notes: 'Manual correction after review',
    },
  ],
  edits: [
    {
      field: 'category',
      from: 'Chair',
      to: 'Office Chair',
      changedAt: '2025-03-01T10:30:00Z',
      changedBy: 'Jane Smith',
    },
  ],
  activityLog: [
    {
      id: 'al1',
      actor: 'AI Pipeline',
      action: 'Item detected',
      timestamp: '2025-03-01T09:15:00Z',
    },
    {
      id: 'al2',
      actor: 'Jane Smith',
      action: 'Attribute updated',
      timestamp: '2025-03-01T10:30:00Z',
      changes: { category: { from: 'Chair', to: 'Office Chair' } },
    },
    {
      id: 'al3',
      actor: 'Jane Smith',
      action: 'Confidence corrected',
      timestamp: '2025-03-01T10:30:00Z',
      changes: { score: { from: 92, to: 95 } },
    },
  ],
  status: 'confirmed',
  isDuplicate: false,
  isException: false,
  detectedAt: '2025-03-01T09:15:00Z',
}

export function getMockItemDetail(itemId: string): ItemDetail | null {
  const base = { ...mockItemDetail, id: itemId }
  return base
}
