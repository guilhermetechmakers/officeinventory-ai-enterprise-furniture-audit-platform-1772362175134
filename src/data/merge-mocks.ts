/**
 * Mock data for Merge & Duplicate Resolution
 * Used when no backend is connected
 */

import type { Group, EvidenceItem, LogEntry } from '@/types/merge'

const PLACEHOLDER_IMG = 'https://placehold.co/200x200/e8e9ec/b6b7ba?text=Item'

export const MOCK_GROUPS: Group[] = [
  {
    id: 'grp-1',
    similarityScore: 0.92,
    itemIds: ['item-1', 'item-2', 'item-3'],
    previewAssets: [
      { itemId: 'item-1', thumbnailUrl: PLACEHOLDER_IMG },
      { itemId: 'item-2', thumbnailUrl: PLACEHOLDER_IMG },
      { itemId: 'item-3', thumbnailUrl: PLACEHOLDER_IMG },
    ],
  },
  {
    id: 'grp-2',
    similarityScore: 0.88,
    itemIds: ['item-4', 'item-5'],
    previewAssets: [
      { itemId: 'item-4', thumbnailUrl: PLACEHOLDER_IMG },
      { itemId: 'item-5', thumbnailUrl: PLACEHOLDER_IMG },
    ],
  },
  {
    id: 'grp-3',
    similarityScore: 0.95,
    itemIds: ['item-6', 'item-7', 'item-8', 'item-9'],
    previewAssets: [
      { itemId: 'item-6', thumbnailUrl: PLACEHOLDER_IMG },
      { itemId: 'item-7', thumbnailUrl: PLACEHOLDER_IMG },
      { itemId: 'item-8', thumbnailUrl: PLACEHOLDER_IMG },
    ],
  },
]

export const MOCK_EVIDENCE: Record<string, EvidenceItem[]> = {
  'grp-1': [
    {
      id: 'ev-1a',
      itemId: 'item-1',
      imageUrl: PLACEHOLDER_IMG,
      croppedUrl: PLACEHOLDER_IMG,
      metadata: { confidence: 0.94 },
    },
    {
      id: 'ev-1b',
      itemId: 'item-2',
      imageUrl: PLACEHOLDER_IMG,
      croppedUrl: PLACEHOLDER_IMG,
      metadata: { confidence: 0.91 },
    },
    {
      id: 'ev-1c',
      itemId: 'item-3',
      imageUrl: PLACEHOLDER_IMG,
      croppedUrl: PLACEHOLDER_IMG,
      metadata: { confidence: 0.89 },
    },
  ],
  'grp-2': [
    {
      id: 'ev-2a',
      itemId: 'item-4',
      imageUrl: PLACEHOLDER_IMG,
      croppedUrl: PLACEHOLDER_IMG,
    },
    {
      id: 'ev-2b',
      itemId: 'item-5',
      imageUrl: PLACEHOLDER_IMG,
      croppedUrl: PLACEHOLDER_IMG,
    },
  ],
  'grp-3': [
    {
      id: 'ev-3a',
      itemId: 'item-6',
      imageUrl: PLACEHOLDER_IMG,
      croppedUrl: PLACEHOLDER_IMG,
    },
    {
      id: 'ev-3b',
      itemId: 'item-7',
      imageUrl: PLACEHOLDER_IMG,
      croppedUrl: PLACEHOLDER_IMG,
    },
    {
      id: 'ev-3c',
      itemId: 'item-8',
      imageUrl: PLACEHOLDER_IMG,
      croppedUrl: PLACEHOLDER_IMG,
    },
    {
      id: 'ev-3d',
      itemId: 'item-9',
      imageUrl: PLACEHOLDER_IMG,
      croppedUrl: PLACEHOLDER_IMG,
    },
  ],
}

export const MOCK_ATTRIBUTES_BY_ITEM: Record<string, Record<string, unknown>> = {
  'item-1': {
    category: 'Office Chair',
    subtype: 'Executive',
    material: 'Leather',
    finish: 'Black',
    brandModel: 'Herman Miller Aeron',
    condition: 'Good',
    notes: '',
  },
  'item-2': {
    category: 'Office Chair',
    subtype: 'Executive',
    material: 'Mesh',
    finish: 'Gray',
    brandModel: 'Herman Miller Aeron',
    condition: 'Like New',
    notes: '',
  },
  'item-3': {
    category: 'Office Chair',
    subtype: 'Executive',
    material: 'Leather',
    finish: 'Black',
    brandModel: 'Herman Miller Aeron',
    condition: 'Good',
    notes: 'Slight wear on armrests',
  },
  'item-4': {
    category: 'Desk',
    subtype: 'Standing',
    material: 'Wood',
    finish: 'Walnut',
    brandModel: 'Uplift V2',
    condition: 'New',
    notes: '',
  },
  'item-5': {
    category: 'Desk',
    subtype: 'Standing',
    material: 'Wood',
    finish: 'Walnut',
    brandModel: 'Uplift V2',
    condition: 'New',
    notes: '',
  },
  'item-6': {
    category: 'Monitor',
    subtype: 'LED',
    material: 'Plastic',
    finish: 'Black',
    brandModel: 'Dell U2720Q',
    condition: 'Good',
    notes: '',
  },
  'item-7': {
    category: 'Monitor',
    subtype: 'LED',
    material: 'Plastic',
    finish: 'Black',
    brandModel: 'Dell U2720Q',
    condition: 'Like New',
    notes: '',
  },
  'item-8': {
    category: 'Monitor',
    subtype: 'LED',
    material: 'Plastic',
    finish: 'Black',
    brandModel: 'Dell U2720Q',
    condition: 'Good',
    notes: '',
  },
  'item-9': {
    category: 'Monitor',
    subtype: 'LED',
    material: 'Plastic',
    finish: 'Black',
    brandModel: 'Dell U2720Q',
    condition: 'Fair',
    notes: 'Minor scratch on bezel',
  },
}

export const MOCK_AUDIT_LOGS: LogEntry[] = [
  {
    id: 'log-1',
    action: 'Merged duplicates',
    mergeId: 'merge-abc',
    itemsAffected: ['item-x', 'item-y'],
    note: 'Consolidated two desk detections from Floor 2',
    userId: 'user-1',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'log-2',
    action: 'Merged duplicates',
    mergeId: 'merge-def',
    itemsAffected: ['item-a', 'item-b', 'item-c'],
    note: 'Three chair detections merged into canonical record',
    userId: 'user-1',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
]
