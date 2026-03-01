/**
 * Capture Upload (Mobile) - Data models for offline-first photo capture and batch upload
 */

export interface Location {
  siteId: string
  floorId: string
  roomId: string
}

export interface Batch {
  id: string
  siteId: string
  floorId: string
  roomId: string
  batchName: string
  inspector: string
  timestamp: string
  notes: string
  tags: string[]
}

export type ImageItemStatus =
  | 'queued'
  | 'uploading'
  | 'uploaded'
  | 'failed'
  | 'retrying'

export interface ImageItem {
  id: string
  batchId: string
  imageUri: string
  mimeType: string
  size: number
  status: ImageItemStatus
  progress: number
  retryCount: number
  uploadedAt?: string
}

export interface QueuedBatch {
  batch: Batch
  images: ImageItem[]
  createdAt: string
}

export interface Site {
  id: string
  name: string
}

export interface Floor {
  id: string
  siteId: string
  name: string
}

export interface Room {
  id: string
  floorId: string
  name: string
}
