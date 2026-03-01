/**
 * DocDetailPage - Full-page view for a single document.
 * Redirects to guides if the document is a guide.
 */

import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DocumentationProvider, useDocumentation } from '@/contexts/documentation-context'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { GuideDetailSkeleton } from '@/components/documentation'
import { ChevronLeft } from 'lucide-react'
import type { Document } from '@/types/documentation'

function DocDetailContent() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { documents, guides, fetchDocById } = useDocumentation()
  const [doc, setDoc] = useState<Document | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const safeGuides = guides ?? []
  const safeDocuments = documents ?? []
  const guideFromList = id ? safeGuides.find((g) => g.id === id) : null
  const docFromList = id ? safeDocuments.find((d) => d.id === id) : null

  useEffect(() => {
    if (id) {
      if (guideFromList) {
        navigate(`/help/guides/${id}`, { replace: true })
        return
      }
      if (docFromList) {
        setDoc(docFromList)
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      fetchDocById(id).then((fetched) => {
        if (fetched) {
          if (fetched.category === 'Guides') {
            navigate(`/help/guides/${id}`, { replace: true })
            return
          }
          setDoc(fetched)
        } else {
          setDoc(null)
        }
        setIsLoading(false)
      })
    } else {
      setDoc(null)
      setIsLoading(false)
    }
  }, [id, guideFromList, docFromList, fetchDocById, navigate])

  if (isLoading) return <GuideDetailSkeleton />

  if (!doc) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 py-16 px-6 text-center">
        <p className="text-muted-foreground mb-4">Document not found.</p>
        <Button variant="outline" asChild>
          <Link to="/help">
            <ChevronLeft className="h-4 w-4" />
            Back to Documentation
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/help" className="flex items-center gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back to Documentation
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{doc.title}</CardTitle>
          <p className="text-muted-foreground">{doc.excerpt}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Updated {doc.lastUpdated}
            {doc.version && ` · v${doc.version}`}
          </p>
        </CardHeader>
      </Card>

      {doc.contentHtml ? (
        <div
          className="prose prose-sm max-w-none rounded-2xl border border-border bg-card p-6"
          dangerouslySetInnerHTML={{ __html: doc.contentHtml }}
        />
      ) : doc.contentMarkdown ? (
        <div className="prose prose-sm max-w-none rounded-2xl border border-border bg-card p-6">
          <pre className="whitespace-pre-wrap">{doc.contentMarkdown}</pre>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 py-12 px-6 text-center">
          <p className="text-muted-foreground">No content available for this document.</p>
        </div>
      )}
    </div>
  )
}

export function DocDetailPage() {
  return (
    <DocumentationProvider>
      <DocDetailContent />
    </DocumentationProvider>
  )
}
