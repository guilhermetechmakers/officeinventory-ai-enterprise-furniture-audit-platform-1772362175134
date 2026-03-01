/**
 * Offline Queue Store - IndexedDB-backed persistent queue for capture uploads
 * Supports offline-first behavior with hydration on app startup
 */

import type { Batch, ImageItem, QueuedBatch } from '@/types/capture-upload'

const DB_NAME = 'officeinventory-offline-queue'
const DB_VERSION = 1
const STORE_NAME = 'queued-batches'
const RECENT_ROOMS_KEY = 'capture-recent-rooms'

export interface StoredQueuedBatch {
  id: string
  batch: Batch
  images: ImageItem[]
  createdAt: string
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })
}

export async function getAllQueuedBatches(): Promise<StoredQueuedBatch[]> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const request = store.getAll()
      request.onsuccess = () => {
        const data = request.result ?? []
        resolve(Array.isArray(data) ? data : [])
      }
      request.onerror = () => reject(request.error)
      tx.oncomplete = () => db.close()
    })
  } catch {
    return []
  }
}

export async function saveQueuedBatch(batch: QueuedBatch): Promise<StoredQueuedBatch> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const stored: StoredQueuedBatch = {
      id: batch.batch.id,
      batch: batch.batch,
      images: batch.images,
      createdAt: batch.createdAt,
    }
    store.put(stored)
    tx.oncomplete = () => {
      db.close()
      resolve(stored)
    }
    tx.onerror = () => reject(tx.error)
  })
}

export async function updateQueuedBatch(
  batchId: string,
  updates: Partial<{ batch: Batch; images: ImageItem[] }>
): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const getRequest = store.get(batchId)
    getRequest.onsuccess = () => {
      const existing = getRequest.result
      if (existing) {
        const updated: StoredQueuedBatch = {
          ...existing,
          ...(updates.batch && { batch: updates.batch }),
          ...(updates.images && { images: updates.images }),
        }
        store.put(updated)
      }
      tx.oncomplete = () => {
        db.close()
        resolve()
      }
    }
    getRequest.onerror = () => reject(getRequest.error)
    tx.onerror = () => reject(tx.error)
  })
}

export async function removeQueuedBatch(batchId: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    store.delete(batchId)
    tx.oncomplete = () => {
      db.close()
      resolve()
    }
    tx.onerror = () => reject(tx.error)
  })
}

export function getRecentRooms(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_ROOMS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function addRecentRoom(roomKey: string): void {
  const recent = getRecentRooms()
  const filtered = recent.filter((r) => r !== roomKey)
  const updated = [roomKey, ...filtered].slice(0, 5)
  localStorage.setItem(RECENT_ROOMS_KEY, JSON.stringify(updated))
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}
