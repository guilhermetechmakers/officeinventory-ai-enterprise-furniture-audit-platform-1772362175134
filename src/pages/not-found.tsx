import { Link } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-muted">
            <FileQuestion className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Page not found</h1>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link to="/">
          <Button size="lg" className="rounded-full">
            Go home
          </Button>
        </Link>
      </div>
    </div>
  )
}
