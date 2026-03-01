import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useInvitation } from '@/hooks/use-invitation'

interface InvitationSignupCardProps {
  onContinue?: () => void
}

export function InvitationSignupCard({ onContinue }: InvitationSignupCardProps) {
  const navigate = useNavigate()
  const {
    invitationId,
    invitation,
    isValidating,
    isAccepting,
    error,
    checkInvitation,
    accept,
    setError,
  } = useInvitation()

  useEffect(() => {
    if (invitationId) checkInvitation()
  }, [invitationId, checkInvitation])

  if (!invitationId) return null
  if (isValidating) {
    return (
      <Card className="rounded-2xl border border-border bg-card shadow-card">
        <CardContent className="py-8">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-pulse rounded-full bg-primary/30" />
            <p className="text-sm text-muted-foreground">Validating invitation...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!invitation) return null

  const handleContinue = async () => {
    setError('')
    const result = await accept({})
    if (result?.success) {
      if (onContinue) onContinue()
      else navigate('/dashboard', { replace: true })
    }
  }

  return (
    <Card className="rounded-2xl border border-primary/30 bg-card shadow-card transition-all duration-300 hover:shadow-elevated">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <Mail className="h-5 w-5 text-primary" />
          You&apos;re invited
        </CardTitle>
        <CardDescription>
          Complete your onboarding to join {invitation.organization}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </div>
        )}
        <div className="flex items-center gap-3 rounded-xl bg-muted/30 px-4 py-3">
          <Building2 className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">{invitation.organization}</p>
            <p className="text-xs text-muted-foreground">{invitation.email}</p>
          </div>
        </div>
        <Button
          className="w-full rounded-full"
          onClick={handleContinue}
          disabled={isAccepting}
        >
          {isAccepting ? 'Accepting...' : 'Continue to onboarding'}
        </Button>
      </CardContent>
    </Card>
  )
}
