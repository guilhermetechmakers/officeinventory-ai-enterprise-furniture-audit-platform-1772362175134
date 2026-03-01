/**
 * DocumentationCard - Card for a single document in the grid.
 */

import { Link } from 'react-router-dom'
import { FileText, Book, Code, HelpCircle, Wrench, Megaphone } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Document, DocCategory } from '@/types/documentation'

const CATEGORY_ICONS: Record<DocCategory, React.ComponentType<{ className?: string }>> = {
  Guides: Book,
  API: Code,
  FAQs: HelpCircle,
  Troubleshooting: Wrench,
  ReleaseNotes: Megaphone,
  Contact: HelpCircle,
}

export interface DocumentationCardProps {
  document: Document
  className?: string
}

export function DocumentationCard({ document, className }: DocumentationCardProps) {
  const Icon = CATEGORY_ICONS[document.category] ?? FileText
  const tags = document.tags ?? []
  const safeTags = Array.isArray(tags) ? tags : []

  return (
    <Link to={`/help/docs/${document.id}`}>
      <Card
        className={cn(
          'h-full transition-all duration-200 hover:shadow-elevated hover:scale-[1.01] cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
      >
        <CardHeader>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 mb-2">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-base">{document.title}</CardTitle>
          <CardDescription className="line-clamp-2">{document.excerpt}</CardDescription>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {safeTags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Updated {document.lastUpdated}
            {document.version && ` · v${document.version}`}
          </p>
        </CardHeader>
      </Card>
    </Link>
  )
}
