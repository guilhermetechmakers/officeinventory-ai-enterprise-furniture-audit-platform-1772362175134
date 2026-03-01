import { Link } from 'react-router-dom'
import { RequestAccessCard } from '@/components/auth'

export function SignupPage() {
  return (
    <div className="w-full space-y-6 animate-fade-in">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
          Request access
        </h1>
        <p className="text-muted-foreground">
          New to OfficeInventory AI? Submit a request and we&apos;ll get you set up.
        </p>
      </div>

      <RequestAccessCard />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
