/**
 * LocationSelector: Hierarchical picker for site → floor → room with recent rooms.
 */

import { useMemo } from 'react'
import { MapPin } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { Location, Site, Floor, Room } from '@/types/capture'
import type { RecentRoom } from '@/lib/offline-queue'

export interface LocationSelectorProps {
  location: Partial<Location>
  onLocationChange: (loc: Partial<Location>) => void
  getSites: () => Site[]
  getFloors: (siteId: string) => Floor[]
  getRooms: (floorId: string) => Room[]
  recentRooms: RecentRoom[]
  onRecentRoomSelect: (room: RecentRoom) => void
  disabled?: boolean
}

export function LocationSelector({
  location,
  onLocationChange,
  getSites,
  getFloors,
  getRooms,
  recentRooms,
  onRecentRoomSelect,
  disabled,
}: LocationSelectorProps) {
  const sites = useMemo(() => getSites() ?? [], [getSites])
  const floors = useMemo(
    () => (location.siteId ? getFloors(location.siteId) : []),
    [location.siteId, getFloors]
  )
  const rooms = useMemo(
    () => (location.floorId ? getRooms(location.floorId) : []),
    [location.floorId, getRooms]
  )

  const handleSiteChange = (siteId: string) => {
    onLocationChange({ siteId, floorId: '', roomId: '' })
  }
  const handleFloorChange = (floorId: string) => {
    onLocationChange({ ...location, floorId, roomId: '' })
  }
  const handleRoomChange = (roomId: string) => {
    onLocationChange({ ...location, roomId })
  }

  const recentList = recentRooms ?? []

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
            value={location.siteId ?? ''}
            onValueChange={handleSiteChange}
            disabled={disabled}
          >
            <SelectTrigger id="site-select" className="min-h-[48px]">
              <SelectValue placeholder="Select site" />
            </SelectTrigger>
            <SelectContent>
              {(sites ?? []).map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="floor-select">Floor / Zone</Label>
          <Select
            value={location.floorId ?? ''}
            onValueChange={handleFloorChange}
            disabled={disabled || !location.siteId}
          >
            <SelectTrigger id="floor-select" className="min-h-[48px]">
              <SelectValue placeholder="Select floor" />
            </SelectTrigger>
            <SelectContent>
              {(floors ?? []).map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="room-select">Room</Label>
          <Select
            value={location.roomId ?? ''}
            onValueChange={handleRoomChange}
            disabled={disabled || !location.floorId}
          >
            <SelectTrigger id="room-select" className="min-h-[48px]">
              <SelectValue placeholder="Select room" />
            </SelectTrigger>
            <SelectContent>
              {(rooms ?? []).map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {recentList.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden />
              <span>Recent rooms</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentList.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onRecentRoomSelect(r)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-sm border border-border bg-secondary',
                    'hover:bg-primary/10 hover:border-primary/50 transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                    'min-h-[44px]'
                  )}
                  aria-label={`Select ${r.roomName}, ${r.floorName}, ${r.siteName}`}
                >
                  {r.siteName} → {r.floorName} → {r.roomName}
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
