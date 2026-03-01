import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAccessRequest } from '@/hooks/use-access-request'
import { requestAccessSchema, type RequestAccessFormValues } from '@/lib/auth-validators'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface RequestAccessCardProps {
  onSuccess?: () => void
}

export function RequestAccessCard({ onSuccess }: RequestAccessCardProps) {
  const { submit, isLoading, error, requestId, status, setError } = useAccessRequest()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RequestAccessFormValues>({
    resolver: zodResolver(requestAccessSchema),
    defaultValues: {
      organizationName: '',
      contactEmail: '',
      reason: '',
    },
  })

  const onSubmit = async (data: RequestAccessFormValues) => {
    setError('')
    const result = await submit({
      organizationName: data.organizationName,
      contactEmail: data.contactEmail,
      reason: data.reason,
    })
    if (result?.success) {
      toast.success('Access request submitted. We\'ll be in touch soon.')
      reset()
      onSuccess?.()
    }
  }

  if (requestId) {
    return (
      <Card className="rounded-2xl border border-primary/30 bg-card shadow-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg font-bold">Request received</CardTitle>
          <CardDescription>
            Your access request has been submitted. We&apos;ll review it and contact you shortly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Reference: <span className="font-mono font-medium">{requestId}</span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Status: {status}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-elevated">
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg font-bold">Request access</CardTitle>
        <CardDescription>
          New to OfficeInventory AI? Submit a request and we&apos;ll get you set up.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="org-name">Organization name</Label>
            <Input
              id="org-name"
              placeholder="Acme Corp"
              aria-invalid={!!errors.organizationName}
              {...register('organizationName')}
              className={cn(errors.organizationName && 'border-destructive')}
            />
            {errors.organizationName && (
              <p className="text-sm text-destructive" role="alert">
                {errors.organizationName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-email">Contact email</Label>
            <Input
              id="contact-email"
              type="email"
              placeholder="you@company.com"
              aria-invalid={!!errors.contactEmail}
              {...register('contactEmail')}
              className={cn(errors.contactEmail && 'border-destructive')}
            />
            {errors.contactEmail && (
              <p className="text-sm text-destructive" role="alert">
                {errors.contactEmail.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for access</Label>
            <Input
              id="reason"
              placeholder="We need to audit our office furniture inventory..."
              aria-invalid={!!errors.reason}
              {...register('reason')}
              className={cn(errors.reason && 'border-destructive')}
            />
            {errors.reason && (
              <p className="text-sm text-destructive" role="alert">
                {errors.reason.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full rounded-full"
            disabled={isLoading}
          >
            {isLoading ? (
              'Submitting...'
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit request
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
