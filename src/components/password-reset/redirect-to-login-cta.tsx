import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

interface RedirectToLoginCTAProps {
  message?: string
  className?: string
}

export function RedirectToLoginCTA({
  message = 'Your password has been reset successfully. You can now sign in with your new password.',
  className,
}: RedirectToLoginCTAProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2 text-primary mb-4">
        <CheckCircle2 className="h-6 w-6 shrink-0" aria-hidden />
        <span className="font-semibold">Password reset complete</span>
      </div>
      <p className="text-muted-foreground mb-6">{message}</p>
      <Link to="/login">
        <Button
          className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          size="lg"
        >
          Sign in
        </Button>
      </Link>
    </div>
  )
}
