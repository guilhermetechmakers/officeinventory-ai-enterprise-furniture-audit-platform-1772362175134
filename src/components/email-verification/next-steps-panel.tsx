import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface NextStepsPanelProps {
  isVerified: boolean
  onProceed?: () => void
  proceedLabel?: string
  proceedTo?: string
  className?: string
}

export function NextStepsPanel({
  isVerified,
  onProceed,
  proceedLabel = 'Continue to Dashboard',
  proceedTo = '/dashboard',
  className,
}: NextStepsPanelProps) {
  const navigate = useNavigate()

  const handleProceed = () => {
    if (onProceed) {
      onProceed()
    } else if (proceedTo) {
      navigate(proceedTo)
    }
  }

  if (isVerified) {
    return (
      <Card
        className={cn(
          'rounded-2xl border-2 border-primary/30 bg-primary/5 shadow-card transition-all duration-300 hover:shadow-elevated',
          className
        )}
      >
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-primary">
            <ArrowRight className="h-5 w-5" aria-hidden />
            You&apos;re all set
          </CardTitle>
          <CardDescription>
            Your email has been verified. You can now access the full platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleProceed}
            className="w-full rounded-full"
            aria-label={proceedLabel}
          >
            {proceedLabel}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        'rounded-2xl border border-border bg-card shadow-card',
        className
      )}
    >
      <CardHeader className="space-y-1">
        <CardTitle>Next steps</CardTitle>
        <CardDescription>
          Click the verification link in your email to complete sign-up. Verification may take a
          few minutes. Once verified, you&apos;ll be able to continue to the dashboard.
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
