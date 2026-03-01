/**
 * LocationSelector - Hierarchical picker for site → floor/zone → room
 * Quick-recent list for recently used rooms
 */

import { useMemo } from 'react'
import { MapPin } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MOCK_FLOORS, MOCK_ROOMS, MOCK_SITES } from '@/data/capture-locations'
import {
  getRecentRooms,
  addRecentRoom,
} from '@/stores/offline-queue-store'
import type { Location } from '@/types/capture-upload'
import { cn } from '@/lib/utils'

interface LocationSelectorProps {
  value: Location
  onChange: (location: Location) => void
  disabled?: boolean
  error?: string
}

export function LocationSelector({
  value,
  onChange,
  disabled = false,
  error,
}: LocationSelectorProps) {
  const recentRoomKeys = useMemo(() => getRecentRooms(), [])

  const floorsForSite = useMemo(
    () => (value.siteId ? MOCK_FLOORS.filter((f) => f.siteId === value.siteId) : []),
    [value.siteId]
  )

  const roomsForFloor = useMemo(
    () => (value.floorId ? MOCK_ROOMS.filter((r) => r.floorId === value.floorId) : []),
    [value.floorId]
  )

  const handleSiteChange = (siteId: string) => {
    onChange({
      siteId,
      floorId: '',
      roomId: '',
    })
  }

  const handleFloorChange = (floorId: string) => {
    onChange({
      ...value,
      floorId,
      roomId: '',
    })
  }

  const handleRoomChange = (roomId: string) => {
    const room = MOCK_ROOMS.find((r) => r.id === roomId)
    const floor = room ? MOCK_FLOORS.find((f) => f.id === room.floorId) : undefined
    const site = floor ? MOCK_SITES.find((s) => s.id === floor.siteId) : undefined
    if (site && floor && room) {
      onChange({
        siteId: site.id,
        floorId: floor.id,
        roomId: room.id,
      })
      addRecentRoom(`${site.name} / ${floor.name} / ${room.name}`)
    }
  }

  const recentItems = useMemo(() => {
    return recentRoomKeys
      .map((key) => {
        const parts = key.split(' / ')
        if (parts.length < 3) return null
        const site = MOCK_SITES.find((s) => s.name === parts[0])
        const floor = MOCK_FLOORS.find(
          (f) => f.siteId === site?.id && f.name === parts[1]
        )
        const room = MOCK_ROOMS.find(
          (r) => r.floorId === floor?.id && r.name === parts[2]
        )
        return site && floor && room ? { key, site, floor, room } : null
      })
      .filter(Boolean) as Array<{ key: string; site: { id: string }; floor: { id: string }; room: { id: string } }>
  }, [recentRoomKeys])

  const isComplete = Boolean(value.siteId && value.floorId && value.roomId)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location</CardTitle>
        <CardDescription>Select site, floor, and room</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="site-select">Site</Label>
          <Select
            value={value.siteId || undefined}
            onValueChange={handleSiteChange}
            disabled={disabled}
          >
            <SelectTrigger id="site-select" className="w-full rounded-xl">
              <SelectValue placeholder="Select site" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sites</SelectLabel>
                {MOCK_SITES.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="floor-select">Floor / Zone</Label>
          <Select
            value={value.floorId || undefined}
            onValueChange={handleFloorChange}
            disabled={disabled || !value.siteId}
          >
            <SelectTrigger id="floor-select" className="w-full rounded-xl">
              <SelectValue placeholder="Select floor" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Floors</SelectLabel>
                {(floorsForSite ?? []).map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="room-select">Room</Label>
          <Select
            value={value.roomId || undefined}
            onValueChange={handleRoomChange}
            disabled={disabled || !value.floorId}
          >
            <SelectTrigger
              id="room-select"
              className={cn(
                'w-full rounded-xl',
                error && 'border-destructive focus:ring-destructive'
              )}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'room-error' : undefined}
            >
              <SelectValue placeholder="Select room" />
            </SelectTrigger>
            <SelectContent>
              {recentItems.length > 0 && (
                <SelectGroup>
                  <SelectLabel>Recent</SelectLabel>
                  {recentItems.map((item) => (
                    <SelectItem
                      key={item.key}
                      value={item.room.id}
                    >
                      {item.key}
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
              <SelectGroup>
                <SelectLabel>Rooms</SelectLabel>
                {(roomsForFloor ?? []).map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {error && (
            <p id="room-error" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </div>

        {recentRoomKeys.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden />
            <span>Recent: {recentRoomKeys[0] ?? '—'}</span>
          </div>
        )}

        {!isComplete && (
          <p className="text-sm text-muted-foreground">
            Select site, floor, and room before queuing for upload.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
