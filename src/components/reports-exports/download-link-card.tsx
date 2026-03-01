import { Download, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface DownloadLinkCardProps {
  title: string
  format: 'CSV' | 'PDF'
  downloadUrl: string | null
  fileSizeBytes?: number | null
  expiresAt?: string | null
  status?: 'completed' | 'expired' | 'pending'
  onRetry?: () => void
  className?: string
}

export function DownloadLinkCard({
  title,
  format,
  downloadUrl,
  fileSizeBytes,
  expiresAt,
  status = 'completed',
  onRetry,
  className,
}: DownloadLinkCardProps) {
  const sizeStr =
    fileSizeBytes != null && fileSizeBytes > 0
      ? fileSizeBytes < 1024
        ? `${fileSizeBytes} B`
        : fileSizeBytes < 1024 * 1024
          ? `${(fileSizeBytes / 1024).toFixed(1)} KB`
          : `${(fileSizeBytes / (1024 * 1024)).toFixed(1)} MB`
      : null

  const isExpired = status === 'expired' || (expiresAt && new Date(expiresAt) < new Date())
  const canDownload = !!downloadUrl && !isExpired

  return (
    <Card
      className={cn(
        'rounded-2xl border border-border shadow-card transition-all duration-300 hover:shadow-elevated',
        className
      )}
    >
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="min-w-0">
          <p className="font-medium truncate">{title}</p>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <Badge variant="secondary" className="rounded-full text-xs">
              {format}
            </Badge>
            {sizeStr && <span>{sizeStr}</span>}
          </div>
          {isExpired && (
            <p className="flex items-center gap-1 text-xs text-destructive mt-1">
              <AlertCircle className="h-3 w-3" />
              Link expired
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {canDownload ? (
            <Button size="sm" asChild className="rounded-full">
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </a>
            </Button>
          ) : onRetry ? (
            <Button size="sm" variant="outline" onClick={onRetry} className="rounded-full">
              Retry
            </Button>
          ) : (
            <span className="text-sm text-muted-foreground">Link expired</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
