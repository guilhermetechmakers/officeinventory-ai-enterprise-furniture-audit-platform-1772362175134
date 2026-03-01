import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { submitLead } from '@/api/lead'

const contactSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().min(1, 'Company is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  phone: z.string().optional(),
  message: z.string().max(1000).optional(),
  consent: z.boolean().refine((v) => v === true, { message: 'You must agree to be contacted' }),
})

type ContactFormValues = z.infer<typeof contactSchema>

export interface ContactFormProps {
  id?: string
  onSuccess?: () => void
  className?: string
  /** When true, renders only the form (no section/card) for use in modals */
  embedded?: boolean
}

export function ContactForm({ id = 'contact', onSuccess, className, embedded }: ContactFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: '',
      email: '',
      company: '',
      jobTitle: '',
      phone: '',
      message: '',
      consent: false,
    },
  })

  const onSubmit = async (data: ContactFormValues) => {
    try {
      const payload = {
        fullName: data.fullName ?? '',
        email: data.email ?? '',
        company: data.company ?? '',
        jobTitle: data.jobTitle ?? '',
        phone: data.phone ?? undefined,
        message: data.message ?? undefined,
        consent: data.consent ?? false,
      }
      const res = await submitLead(payload)
      if (!res?.success) {
        throw new Error(res?.message ?? 'Submission failed')
      }
      toast.success('Thank you! Our sales team will reach out within 1 business day.')
      reset()
      onSuccess?.()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      toast.error(message)
    }
  }

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name *</Label>
                  <Input
                    id="fullName"
                    {...register('fullName')}
                    placeholder="Jane Smith"
                    aria-invalid={!!errors.fullName}
                    aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                  />
                  {errors.fullName && (
                    <p id="fullName-error" className="text-sm text-destructive">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="jane@company.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    {...register('company')}
                    placeholder="Acme Corp"
                    aria-invalid={!!errors.company}
                    aria-describedby={errors.company ? 'company-error' : undefined}
                  />
                  {errors.company && (
                    <p id="company-error" className="text-sm text-destructive">
                      {errors.company.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job title *</Label>
                  <Input
                    id="jobTitle"
                    {...register('jobTitle')}
                    placeholder="Facilities Manager"
                    aria-invalid={!!errors.jobTitle}
                    aria-describedby={errors.jobTitle ? 'jobTitle-error' : undefined}
                  />
                  {errors.jobTitle && (
                    <p id="jobTitle-error" className="text-sm text-destructive">
                      {errors.jobTitle.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  placeholder="+1 (555) 000-0000"
                  aria-describedby="phone-hint"
                />
                <p id="phone-hint" className="text-xs text-muted-foreground">
                  Preferred contact method
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message (optional)</Label>
                <textarea
                  id="message"
                  {...register('message')}
                  placeholder="Tell us about your needs or preferred demo date..."
                  rows={4}
                  className={cn(
                    'flex w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm',
                    'placeholder:text-muted-foreground',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    'disabled:cursor-not-allowed disabled:opacity-50'
                  )}
                  aria-invalid={!!errors.message}
                />
                {errors.message && (
                  <p className="text-sm text-destructive">{errors.message.message}</p>
                )}
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consent"
                  {...register('consent')}
                  className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-ring"
                  aria-invalid={!!errors.consent}
                  aria-describedby={errors.consent ? 'consent-error' : 'consent-hint'}
                />
                <div>
                  <Label htmlFor="consent" className="font-normal cursor-pointer">
                    I agree to be contacted by OfficeInventory AI regarding my demo request. *
                  </Label>
                  <p id="consent-hint" className="text-xs text-muted-foreground mt-1">
                    We respect your privacy and will not share your information.
                  </p>
                  {errors.consent && (
                    <p id="consent-error" className="text-sm text-destructive mt-1">
                      {errors.consent.message}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full rounded-full"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Submitting...
                  </>
                ) : (
                  'Submit request'
                )}
              </Button>
            </form>
  )

  if (embedded) {
    return <div className={cn(className)}>{formContent}</div>
  }

  return (
    <section
      id={id}
      className={cn('px-4 py-24 sm:px-6 lg:px-8 scroll-mt-20', className)}
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-2xl">
        <h2 id="contact-heading" className="text-center text-3xl font-bold text-foreground mb-4">
          Request a demo
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Get in touch to schedule a personalized demo or start a free trial.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Contact details</CardTitle>
            <CardDescription>
              We&apos;ll get back to you within 1 business day.
            </CardDescription>
          </CardHeader>
          <CardContent>{formContent}</CardContent>
        </Card>
      </div>
    </section>
  )
}
