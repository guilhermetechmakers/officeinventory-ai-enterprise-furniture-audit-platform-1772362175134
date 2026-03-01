/**
 * StatusPanel - Summary of queue: total items, success rate, last upload time
 * Visual indicators with color states
 */

import { CheckCircle, Clock, AlertCircle, Wifi, WifiOff } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface StatusPanelProps {
  totalItems: number
  uploadedCount: number
  failedCount: number
  queuedCount: number
  uploadingCount: number
  lastUploadTime?: string
  isOnline: boolean
  className?: string
}

export function StatusPanel({
  totalItems,
  uploadedCount,
  failedCount,
  queuedCount,
  uploadingCount,
  lastUploadTime,
  isOnline,
  className,
}: StatusPanelProps) {
  const successRate =
    totalItems > 0 ? Math.round((uploadedCount / totalItems) * 100) : 100

  return (
    <Card className={cn('', className)}>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="h-5 w-5 text-primary" aria-hidden />
            ) : (
              <WifiOff className="h-5 w-5 text-muted-foreground" aria-hidden />
            )}
            <span className="text-sm font-medium">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          <Badge variant="secondary" className="rounded-full">
            {totalItems} total
          </Badge>

          {uploadedCount > 0 && (
            <Badge variant="success" className="rounded-full gap-1">
              <CheckCircle className="h-3 w-3" />
              {uploadedCount} uploaded
            </Badge>
          )}

          {queuedCount > 0 && (
            <Badge variant="info" className="rounded-full gap-1">
              <Clock className="h-3 w-3" />
              {queuedCount} queued
            </Badge>
          )}

          {uploadingCount > 0 && (
            <Badge variant="warning" className="rounded-full gap-1">
              <Clock className="h-3 w-3 animate-pulse" />
              {uploadingCount} uploading
            </Badge>
          )}

          {failedCount > 0 && (
            <Badge variant="destructive" className="rounded-full gap-1">
              <AlertCircle className="h-3 w-3" />
              {failedCount} failed
            </Badge>
          )}

          {totalItems > 0 && (
            <span className="text-sm text-muted-foreground">
              {successRate}% success
            </span>
          )}

          {lastUploadTime && (
            <span className="text-xs text-muted-foreground">
              Last upload: {lastUploadTime}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
