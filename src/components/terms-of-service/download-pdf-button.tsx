/**
 * DownloadPDFButton - Triggers ToS export (text/PDF download).
 * Shows loading state, success/failure feedback via Sonner.
 */

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { downloadToSFile } from '@/lib/tos-download-service'
import type { ToSSection } from '@/types/terms-of-service'

export interface DownloadPDFButtonProps {
  sections?: ToSSection[] | null
  className?: string
}

export function DownloadPDFButton({ sections, className }: DownloadPDFButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = () => {
    setIsLoading(true)
    toast.loading('Preparing download...', { id: 'tos-download' })
    try {
      downloadToSFile(sections)
      toast.success('Download started', { id: 'tos-download' })
    } catch {
      toast.error('Failed to download. Please try again.', { id: 'tos-download' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isLoading}
      className={className}
      aria-busy={isLoading}
      aria-label={isLoading ? 'Preparing download...' : 'Download Terms of Service as PDF'}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : (
        <Download className="h-4 w-4" aria-hidden />
      )}
      {isLoading ? 'Preparing...' : 'Download PDF'}
    </Button>
  )
}
