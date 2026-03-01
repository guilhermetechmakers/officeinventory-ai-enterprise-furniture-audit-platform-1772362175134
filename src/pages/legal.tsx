import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

interface LegalPageProps {
  title: string
  content: string
}

export function LegalPage({ title, content }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4">
          <Link to="/" className="font-bold text-xl">
            OfficeInventory AI
          </Link>
        </div>
      </nav>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link to="/">
          <Button variant="ghost" className="mb-8">← Back</Button>
        </Link>
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold mb-8">{title}</h1>
          <div className="text-muted-foreground whitespace-pre-wrap">{content}</div>
        </article>
      </div>
    </div>
  )
}
