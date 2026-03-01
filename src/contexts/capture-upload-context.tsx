/**
 * Capture Upload context: manages batch state, images, location, and queue.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { offlineQueue, type RecentRoom } from '@/lib/offline-queue'
import type { Batch, ImageItem, Location, Site, Floor, Room } from '@/types/capture'

/** Mock location data for MVP - replace with API/Supabase in production */
const MOCK_SITES: Site[] = [
  { id: 'site-1', name: 'Building A' },
  { id: 'site-2', name: 'Building B' },
  { id: 'site-3', name: 'HQ Campus' },
]

const MOCK_FLOORS: Floor[] = [
  { id: 'floor-1', siteId: 'site-1', name: 'Floor 1' },
  { id: 'floor-2', siteId: 'site-1', name: 'Floor 2' },
  { id: 'floor-3', siteId: 'site-1', name: 'Floor 3' },
  { id: 'floor-4', siteId: 'site-2', name: 'Ground' },
  { id: 'floor-5', siteId: 'site-2', name: 'Level 1' },
  { id: 'floor-6', siteId: 'site-3', name: 'North Wing' },
]

const MOCK_ROOMS: Room[] = [
  { id: 'room-1', floorId: 'floor-1', name: 'Room 101' },
  { id: 'room-2', floorId: 'floor-1', name: 'Room 102' },
  { id: 'room-3', floorId: 'floor-2', name: 'Conference A' },
  { id: 'room-4', floorId: 'floor-2', name: 'Open Area' },
  { id: 'room-5', floorId: 'floor-3', name: 'Storage' },
  { id: 'room-6', floorId: 'floor-4', name: 'Lobby' },
  { id: 'room-7', floorId: 'floor-5', name: 'Office 201' },
  { id: 'room-8', floorId: 'floor-6', name: 'Lab' },
]

export interface CaptureUploadState {
  /** Current batch being composed */
  batch: Partial<Batch>
  /** Images selected for current batch */
  images: ImageItem[]
  /** Location selection */
  location: Partial<Location>
  /** Sites, floors, rooms (from API in prod) */
  sites: Site[]
  floors: Floor[]
  rooms: Room[]
  recentRooms: RecentRoom[]
  /** Queue batches from IndexedDB */
  queuedBatches: Array<{ batch: Batch; images: ImageItem[] }>
  /** Online status */
  isOnline: boolean
}

interface CaptureUploadContextValue extends CaptureUploadState {
  setBatch: (updates: Partial<Batch>) => void
  setImages: (images: ImageItem[]) => void
  setLocation: (loc: Partial<Location>) => void
  addRecentRoom: (room: RecentRoom) => Promise<void>
  queueBatch: () => Promise<boolean>
  refreshQueue: () => Promise<void>
  removeFromQueue: (batchId: string) => Promise<void>
  updateQueueImage: (image: ImageItem) => Promise<void>
  getSites: () => Site[]
  getFloors: (siteId: string) => Floor[]
  getRooms: (floorId: string) => Room[]
}

const CaptureUploadContext = createContext<CaptureUploadContextValue | null>(null)

export function CaptureUploadProvider({ children }: { children: ReactNode }) {
  const [batch, setBatchState] = useState<Partial<Batch>>({})
  const [images, setImagesState] = useState<ImageItem[]>([])
  const [location, setLocationState] = useState<Partial<Location>>({})
  const [recentRooms, setRecentRooms] = useState<RecentRoom[]>([])
  const [queuedBatches, setQueuedBatches] = useState<Array<{ batch: Batch; images: ImageItem[] }>>([])
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true)

  const setBatch = useCallback((updates: Partial<Batch>) => {
    setBatchState((prev) => ({ ...prev, ...updates }))
  }, [])

  const setImages = useCallback((imgs: ImageItem[]) => {
    setImagesState(Array.isArray(imgs) ? imgs : [])
  }, [])

  const setLocation = useCallback((loc: Partial<Location>) => {
    setLocationState((prev) => ({ ...prev, ...loc }))
  }, [])

  const addRecentRoom = useCallback(async (room: RecentRoom) => {
    await offlineQueue.addRecentRoom(room)
    setRecentRooms(await offlineQueue.getRecentRooms())
  }, [])

  const getSites = useCallback(() => MOCK_SITES, [])
  const getFloors = useCallback((siteId: string) => {
    return (MOCK_FLOORS ?? []).filter((f) => f.siteId === siteId)
  }, [])
  const getRooms = useCallback((floorId: string) => {
    return (MOCK_ROOMS ?? []).filter((r) => r.floorId === floorId)
  }, [])

  const refreshQueue = useCallback(async () => {
    const batches = await offlineQueue.getQueuedBatches()
    setQueuedBatches(batches ?? [])
  }, [])

  const queueBatch = useCallback(async (): Promise<boolean> => {
    const siteId = location.siteId ?? ''
    const floorId = location.floorId ?? ''
    const roomId = location.roomId ?? ''
    const imgs = images ?? []

    if (!siteId || !floorId || !roomId) return false
    if (!Array.isArray(imgs) || imgs.length === 0) return false

    const batchId = `batch-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    const fullBatch: Batch = {
      id: batchId,
      siteId,
      floorId,
      roomId,
      batchName: batch.batchName ?? `Batch ${new Date().toLocaleDateString()}`,
      inspector: batch.inspector ?? '',
      timestamp: new Date().toISOString(),
      notes: batch.notes ?? '',
      tags: Array.isArray(batch.tags) ? batch.tags : [],
    }

    const imageItems: ImageItem[] = imgs.map((img) => ({
      id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      batchId,
      imageUri: img.imageUri,
      mimeType: img.mimeType ?? 'image/jpeg',
      size: img.size ?? 0,
      status: 'queued' as const,
      progress: 0,
      retryCount: 0,
    }))

    await offlineQueue.addBatch(fullBatch, imageItems)
    await refreshQueue()
    setImagesState([])
    setBatchState({})
    return true
  }, [batch, images, location, refreshQueue])

  const removeFromQueue = useCallback(
    async (batchId: string) => {
      await offlineQueue.removeBatch(batchId)
      await refreshQueue()
    },
    [refreshQueue]
  )

  const updateQueueImage = useCallback(async (image: ImageItem) => {
    await offlineQueue.updateImage(image)
    await refreshQueue()
  }, [refreshQueue])

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    offlineQueue.getRecentRooms().then(setRecentRooms)
    refreshQueue()
  }, [refreshQueue])

  const value = useMemo<CaptureUploadContextValue>(
    () => ({
      batch,
      images,
      location,
      sites: MOCK_SITES,
      floors: MOCK_FLOORS,
      rooms: MOCK_ROOMS,
      recentRooms,
      queuedBatches,
      isOnline,
      setBatch,
      setImages,
      setLocation,
      addRecentRoom,
      queueBatch,
      refreshQueue,
      removeFromQueue,
      updateQueueImage,
      getSites,
      getFloors,
      getRooms,
    }),
    [
      batch,
      images,
      location,
      recentRooms,
      queuedBatches,
      isOnline,
      setBatch,
      setImages,
      setLocation,
      addRecentRoom,
      queueBatch,
      refreshQueue,
      removeFromQueue,
      updateQueueImage,
      getSites,
      getFloors,
      getRooms,
    ]
  )

  return (
    <CaptureUploadContext.Provider value={value}>
      {children}
    </CaptureUploadContext.Provider>
  )
}

export function useCaptureUpload() {
  const ctx = useContext(CaptureUploadContext)
  if (!ctx) throw new Error('useCaptureUpload must be used within CaptureUploadProvider')
  return ctx
}
