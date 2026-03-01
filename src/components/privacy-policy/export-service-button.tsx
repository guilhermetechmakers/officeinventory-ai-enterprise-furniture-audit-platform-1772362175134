/**
 * ExportServiceButton - Handles PDF export request.
 * Shows loading state, success/failure feedback via Sonner.
 */

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { exportPolicyPdf } from '@/api/privacy-policy'

export interface ExportServiceButtonProps {
  className?: string
}

export function ExportServiceButton({ className }: ExportServiceButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleExport = async () => {
    setIsLoading(true)
    toast.loading('Preparing PDF download...', { id: 'pdf-export' })
    try {
      const result = await exportPolicyPdf()
      if ('url' in result && result.url) {
        const a = document.createElement('a')
        a.href = result.url
        a.download = 'OfficeInventory-AI-Privacy-Policy.txt'
        a.rel = 'noopener noreferrer'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        if (result.url.startsWith('blob:')) {
          setTimeout(() => URL.revokeObjectURL(result.url as string), 1000)
        }
      }
      if ('blob' in result && result.blob) {
        const url = URL.createObjectURL(result.blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'OfficeInventory-AI-Privacy-Policy.pdf'
        a.rel = 'noopener noreferrer'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
      toast.success('Download started', { id: 'pdf-export' })
    } catch {
      toast.error('Failed to export. Please try again.', { id: 'pdf-export' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleExport}
      disabled={isLoading}
      className={className}
      aria-busy={isLoading}
      aria-label={isLoading ? 'Exporting PDF...' : 'Download Privacy Policy as PDF'}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : (
        <Download className="h-4 w-4" aria-hidden />
      )}
      {isLoading ? 'Exporting...' : 'Download PDF'}
    </Button>
  )
}
