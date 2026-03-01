/**
 * StatusPanel: Summary of queue - total items, success rate, last upload, offline indicator.
 */

import { Upload, CheckCircle, XCircle, Clock, WifiOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
export interface StatusPanelProps {
  totalItems: number
  uploadedCount: number
  failedCount: number
  queuedCount: number
  isOnline: boolean
  lastUploadTime?: string
  className?: string
}

export function StatusPanel({
  totalItems,
  uploadedCount,
  failedCount,
  queuedCount,
  isOnline,
  lastUploadTime,
  className,
}: StatusPanelProps) {
  const successRate =
    totalItems > 0 ? Math.round((uploadedCount / totalItems) * 100) : 100

  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Upload className="h-4 w-4" aria-hidden />
          Queue status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!isOnline && (
          <div className="flex items-center gap-2 text-warning">
            <WifiOff className="h-4 w-4 shrink-0" aria-hidden />
            <span className="text-sm font-medium">Offline — uploads will sync when online</span>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="gap-1">
            <span aria-hidden>{totalItems}</span>
            <span>total</span>
          </Badge>
          <Badge variant="success" className="gap-1">
            <CheckCircle className="h-3 w-3" aria-hidden />
            <span>{uploadedCount}</span>
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" aria-hidden />
            <span>{queuedCount}</span>
          </Badge>
          {failedCount > 0 && (
            <Badge variant="destructive" className="gap-1">
              <XCircle className="h-3 w-3" aria-hidden />
              <span>{failedCount}</span>
            </Badge>
          )}
        </div>

        {totalItems > 0 && (
          <p className="text-sm text-muted-foreground">
            Success rate: <span className="font-medium text-foreground">{successRate}%</span>
          </p>
        )}

        {lastUploadTime && (
          <p className="text-xs text-muted-foreground">
            Last upload: {new Date(lastUploadTime).toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
