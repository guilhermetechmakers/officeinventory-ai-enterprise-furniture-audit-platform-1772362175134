/**
 * DpaLink - Accessible link/button to Data Processing Addendum.
 * For enterprise customers. Opens in new tab.
 */

import { useState, useEffect } from 'react'
import { FileCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { fetchDpaLink } from '@/api/privacy-policy'

export interface DpaLinkProps {
  className?: string
}

export function DpaLink({ className }: DpaLinkProps) {
  const [dpaUrl, setDpaUrl] = useState<string>('/dpa')

  useEffect(() => {
    fetchDpaLink()
      .then((url) => setDpaUrl(url ?? '/dpa'))
      .catch(() => setDpaUrl('/dpa'))
  }, [])

  return (
    <Button
      variant="outline"
      asChild
      className={className}
      aria-label="View Data Processing Addendum for enterprise customers"
    >
      <a
        href={dpaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2"
      >
        <FileCheck className="h-4 w-4" aria-hidden />
        Data Processing Addendum (DPA)
      </a>
    </Button>
  )
}
