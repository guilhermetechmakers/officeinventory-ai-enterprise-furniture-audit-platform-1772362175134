/**
 * Mock location data for Capture Upload - hierarchical site/floor/room
 * In production, this would come from Supabase or API
 */

import type { Floor, Room, Site } from '@/types/capture-upload'

export const MOCK_SITES: Site[] = [
  { id: 'site-1', name: 'Building A' },
  { id: 'site-2', name: 'Building B' },
  { id: 'site-3', name: 'HQ Campus' },
]

export const MOCK_FLOORS: Floor[] = [
  { id: 'floor-1', siteId: 'site-1', name: 'Floor 1' },
  { id: 'floor-2', siteId: 'site-1', name: 'Floor 2' },
  { id: 'floor-3', siteId: 'site-1', name: 'Floor 3' },
  { id: 'floor-4', siteId: 'site-2', name: 'Ground' },
  { id: 'floor-5', siteId: 'site-2', name: 'Level 1' },
  { id: 'floor-6', siteId: 'site-3', name: 'West Wing' },
  { id: 'floor-7', siteId: 'site-3', name: 'East Wing' },
]

export const MOCK_ROOMS: Room[] = [
  { id: 'room-1', floorId: 'floor-1', name: 'Room 101' },
  { id: 'room-2', floorId: 'floor-1', name: 'Room 102' },
  { id: 'room-3', floorId: 'floor-1', name: 'Conference A' },
  { id: 'room-4', floorId: 'floor-2', name: 'Room 201' },
  { id: 'room-5', floorId: 'floor-2', name: 'Room 202' },
  { id: 'room-6', floorId: 'floor-2', name: 'Open Plan West' },
  { id: 'room-7', floorId: 'floor-3', name: 'Room 301' },
  { id: 'room-8', floorId: 'floor-4', name: 'Lobby' },
  { id: 'room-9', floorId: 'floor-4', name: 'Reception' },
  { id: 'room-10', floorId: 'floor-5', name: 'Office Suite 1' },
  { id: 'room-11', floorId: 'floor-6', name: 'Meeting Room 1' },
  { id: 'room-12', floorId: 'floor-7', name: 'Lab Area' },
]
