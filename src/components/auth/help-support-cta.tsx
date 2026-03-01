import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HelpCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface HelpSupportCTAProps {
  variant?: 'link' | 'button'
  className?: string
}

export function HelpSupportCTA({ variant = 'link', className }: HelpSupportCTAProps) {
  const [open, setOpen] = useState(false)

  if (variant === 'button') {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          className={cn('text-muted-foreground hover:text-foreground', className)}
          onClick={() => setOpen(true)}
        >
          <HelpCircle className="h-4 w-4" />
          Help
        </Button>
        <HelpSupportModal open={open} onOpenChange={setOpen} />
      </>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'text-sm text-muted-foreground hover:text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded',
          className
        )}
      >
        Need help? Contact support
      </button>
      <HelpSupportModal open={open} onOpenChange={setOpen} />
    </>
  )
}

function HelpSupportModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showClose={true} className="rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Help & Support
          </DialogTitle>
          <DialogDescription>
            Get help with login, access requests, or technical issues.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Visit our help center for documentation, guides, and FAQs.
          </p>
          <div className="flex flex-col gap-2">
            <Link to="/help">
              <Button variant="outline" className="w-full rounded-full" onClick={() => onOpenChange(false)}>
                Help & Documentation
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="default" className="w-full rounded-full" onClick={() => onOpenChange(false)}>
                Contact support
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
