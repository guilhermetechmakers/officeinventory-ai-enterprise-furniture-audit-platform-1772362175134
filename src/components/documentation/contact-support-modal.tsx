/**
 * ContactSupportModal - Quick ticket creation modal with prefill from context.
 */

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { CreateTicketInput } from '@/types/documentation'

const ticketSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(200),
  description: z.string().min(1, 'Description is required').max(2000),
  category: z.string().min(1, 'Category is required'),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
})

type TicketFormData = z.infer<typeof ticketSchema>

export interface ContactSupportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: CreateTicketInput) => Promise<unknown>
  contextSubject?: string
  contextDescription?: string
}

export function ContactSupportModal({
  open,
  onOpenChange,
  onSubmit,
  contextSubject = '',
  contextDescription = '',
}: ContactSupportModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      subject: contextSubject,
      description: contextDescription,
      category: 'general',
      priority: 'medium',
    },
  })

  const category = watch('category')
  const priority = watch('priority')

  useEffect(() => {
    if (open) {
      reset({
        subject: contextSubject,
        description: contextDescription,
        category: 'general',
        priority: 'medium',
      })
    }
  }, [open, contextSubject, contextDescription, reset])

  const handleOpenChange = (next: boolean) => {
    if (!next) reset()
    onOpenChange(next)
  }

  const onFormSubmit = async (data: TicketFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit({
        subject: data.subject,
        description: data.description,
        category: data.category,
        priority: data.priority,
      })
      toast.success('Support ticket created. We\'ll get back to you soon.')
      handleOpenChange(false)
    } catch {
      toast.error('Failed to create ticket. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg" showClose>
        <DialogHeader>
          <DialogTitle>Contact Support</DialogTitle>
          <DialogDescription>
            Create a support ticket and we&apos;ll respond as soon as possible.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              {...register('subject')}
              placeholder="Brief description of your issue"
              className="mt-1.5"
            />
            {errors.subject && (
              <p className="text-sm text-destructive mt-1">{errors.subject.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Provide details about your request..."
              className="mt-1.5 min-h-[120px]"
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={(v) => setValue('category', v)}
            >
              <SelectTrigger id="category" className="mt-1.5">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="api">API</SelectItem>
                <SelectItem value="bug">Bug Report</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={priority}
              onValueChange={(v) => setValue('priority', v as TicketFormData['priority'])}
            >
              <SelectTrigger id="priority" className="mt-1.5">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Create Ticket'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
