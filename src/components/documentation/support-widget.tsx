/**
 * SupportWidget - Create Ticket form and link to live chat; displays status.
 */

import { useState } from 'react'
import { MessageCircle, Ticket, ExternalLink } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ContactSupportModal } from './contact-support-modal'
import { cn } from '@/lib/utils'
import type { CreateTicketInput } from '@/types/documentation'

const LIVE_CHAT_LINK = '#' // Replace with actual chat URL when available

export interface SupportWidgetProps {
  onCreateTicket: (input: CreateTicketInput) => Promise<unknown>
  ticketCount?: number
  className?: string
}

export function SupportWidget({
  onCreateTicket,
  ticketCount = 0,
  className,
}: SupportWidgetProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className={cn('space-y-4', className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Support Center
          </CardTitle>
          <CardDescription>
            Create a ticket or start a live chat for immediate assistance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            className="w-full rounded-full"
            onClick={() => setModalOpen(true)}
          >
            <Ticket className="h-4 w-4" />
            Create Ticket
          </Button>
          {LIVE_CHAT_LINK && (
            <Button
              variant="outline"
              className="w-full rounded-full"
              asChild
            >
              <a href={LIVE_CHAT_LINK} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                Live Chat
              </a>
            </Button>
          )}
          {ticketCount > 0 && (
            <p className="text-sm text-muted-foreground text-center">
              You have {ticketCount} open ticket{ticketCount !== 1 ? 's' : ''}.
            </p>
          )}
        </CardContent>
      </Card>

      <ContactSupportModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={onCreateTicket}
      />
    </div>
  )
}
