import { useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ContactForm } from './contact-form'

export interface DemoRequestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DemoRequestModal({ open, onOpenChange }: DemoRequestModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
    }
    if (open) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        aria-labelledby="demo-modal-title"
        aria-describedby="demo-modal-desc"
      >
        <DialogHeader>
          <DialogTitle id="demo-modal-title">Request a demo</DialogTitle>
          <DialogDescription id="demo-modal-desc">
            Schedule a personalized walkthrough. We&apos;ll respond within 1 business day.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ContactForm embedded onSuccess={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
