/**
 * Offline-first upload queue with IndexedDB persistence.
 * Stores batch metadata and image references for reliable uploads when offline.
 */

import type { Batch, ImageItem, QueuedBatch } from '@/types/capture'

const DB_NAME = 'officeinventory-capture-queue'
const DB_VERSION = 1
const STORE_BATCHES = 'batches'
const STORE_IMAGES = 'images'
const STORE_RECENT_ROOMS = 'recent-rooms'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_BATCHES)) {
        db.createObjectStore(STORE_BATCHES, { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains(STORE_IMAGES)) {
        const imgStore = db.createObjectStore(STORE_IMAGES, { keyPath: 'id' })
        imgStore.createIndex('batchId', 'batchId', { unique: false })
        imgStore.createIndex('status', 'status', { unique: false })
      }
      if (!db.objectStoreNames.contains(STORE_RECENT_ROOMS)) {
        db.createObjectStore(STORE_RECENT_ROOMS, { keyPath: 'id' })
      }
    }
  })
}

function getAll<T>(storeName: string): Promise<T[]> {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly')
      const store = tx.objectStore(storeName)
      const request = store.getAll()
      request.onerror = () => {
        db.close()
        reject(request.error)
      }
      request.onsuccess = () => {
        db.close()
        resolve((request.result ?? []) as T[])
      }
    })
  })
}

function put<T>(storeName: string, value: T): Promise<void> {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite')
      const store = tx.objectStore(storeName)
      const request = store.put(value)
      request.onerror = () => {
        db.close()
        reject(request.error)
      }
      request.onsuccess = () => {
        db.close()
        resolve()
      }
    })
  })
}

function putMany<T extends { id: string }>(storeName: string, values: T[]): Promise<void> {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite')
      const store = tx.objectStore(storeName)
      for (const v of values) {
        store.put(v)
      }
      tx.onerror = () => {
        db.close()
        reject(tx.error)
      }
      tx.oncomplete = () => {
        db.close()
        resolve()
      }
    })
  })
}

function deleteItem(storeName: string, id: string): Promise<void> {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite')
      const store = tx.objectStore(storeName)
      const request = store.delete(id)
      request.onerror = () => {
        db.close()
        reject(request.error)
      }
      request.onsuccess = () => {
        db.close()
        resolve()
      }
    })
  })
}

function deleteByIndex(storeName: string, indexName: string, value: string): Promise<void> {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite')
      const store = tx.objectStore(storeName)
      const index = store.index(indexName)
      const request = index.openCursor(IDBKeyRange.only(value))
      request.onerror = () => {
        db.close()
        reject(request.error)
      }
      request.onsuccess = () => {
        const cursor = request.result
        if (cursor) {
          cursor.delete()
          cursor.continue()
        } else {
          db.close()
          resolve()
        }
      }
    })
  })
}

export interface RecentRoom {
  id: string
  siteId: string
  floorId: string
  roomId: string
  siteName: string
  floorName: string
  roomName: string
  usedAt: number
}

export const offlineQueue = {
  async getBatches(): Promise<Batch[]> {
    return getAll<Batch>(STORE_BATCHES)
  },

  async getImages(batchId?: string): Promise<ImageItem[]> {
    const all = await getAll<ImageItem>(STORE_IMAGES)
    if (!batchId) return all
    return (all ?? []).filter((i) => i.batchId === batchId)
  },

  async getQueuedBatches(): Promise<QueuedBatch[]> {
    const batches = await this.getBatches()
    const result: QueuedBatch[] = []
    for (const batch of batches ?? []) {
      const images = (await this.getImages(batch.id)) ?? []
      const pending = images.filter(
        (i) => i.status === 'queued' || i.status === 'failed' || i.status === 'retrying'
      )
      if (pending.length > 0) {
        result.push({ batch, images })
      }
    }
    return result
  },

  async addBatch(batch: Batch, images: ImageItem[]): Promise<void> {
    await put(STORE_BATCHES, batch)
    if (Array.isArray(images) && images.length > 0) {
      await putMany(STORE_IMAGES, images)
    }
  },

  async updateImage(image: ImageItem): Promise<void> {
    await put(STORE_IMAGES, image)
  },

  async updateImages(images: ImageItem[]): Promise<void> {
    if (Array.isArray(images) && images.length > 0) {
      await putMany(STORE_IMAGES, images)
    }
  },

  async removeBatch(batchId: string): Promise<void> {
    await deleteItem(STORE_BATCHES, batchId)
    await deleteByIndex(STORE_IMAGES, 'batchId', batchId)
  },

  async addRecentRoom(room: RecentRoom): Promise<void> {
    const existing = await getAll<RecentRoom>(STORE_RECENT_ROOMS)
    const filtered = (existing ?? [])
      .filter((r) => r.id !== room.id)
      .sort((a, b) => b.usedAt - a.usedAt)
      .slice(0, 4)
    const updated = [{ ...room, usedAt: Date.now() }, ...filtered]
    await openDB().then((db) => {
      return new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_RECENT_ROOMS, 'readwrite')
        const store = tx.objectStore(STORE_RECENT_ROOMS)
        store.clear()
        for (const r of updated) {
          store.put(r)
        }
        tx.onerror = () => {
          db.close()
          reject(tx.error)
        }
        tx.oncomplete = () => {
          db.close()
          resolve()
        }
      })
    })
  },

  async getRecentRooms(): Promise<RecentRoom[]> {
    const all = await getAll<RecentRoom>(STORE_RECENT_ROOMS)
    return (all ?? []).sort((a, b) => b.usedAt - a.usedAt).slice(0, 5)
  },
}
