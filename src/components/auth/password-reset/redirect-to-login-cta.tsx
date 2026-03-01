import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export interface RedirectToLoginCTAProps {
  message?: string
  className?: string
}

export function RedirectToLoginCTA({
  message = 'Your password has been reset successfully.',
  className,
}: RedirectToLoginCTAProps) {
  return (
    <div className={className}>
      <p className="text-sm text-muted-foreground mb-4">{message}</p>
      <Link to="/login">
        <Button className="w-full rounded-full gap-2">
          Go to sign in
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  )
}
