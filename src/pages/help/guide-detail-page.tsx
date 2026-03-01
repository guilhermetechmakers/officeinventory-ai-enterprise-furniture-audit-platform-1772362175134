/**
 * GuideDetailPage - Full-page view for a single onboarding guide.
 */

import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { DocumentationProvider, useDocumentation } from '@/contexts/documentation-context'
import { GuideDetail } from '@/components/documentation'
import type { Guide } from '@/types/documentation'

function GuideDetailContent() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { guides, fetchDocById } = useDocumentation()
  const [guide, setGuide] = useState<Guide | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const safeGuides = guides ?? []
  const guideFromList = id ? safeGuides.find((g) => g.id === id) : null

  useEffect(() => {
    if (id) {
      if (guideFromList) {
        setGuide(guideFromList as Guide)
        setIsLoading(false)
      } else {
        setIsLoading(true)
        fetchDocById(id).then((doc) => {
          if (doc && doc.category === 'Guides') {
            setGuide(doc as Guide)
          } else {
            setGuide(null)
          }
          setIsLoading(false)
        })
      }
    } else {
      setGuide(null)
      setIsLoading(false)
    }
  }, [id, guideFromList, fetchDocById])

  const handleBack = () => navigate('/help')

  return (
    <div className="max-w-3xl mx-auto">
      <GuideDetail
        guide={guide}
        isLoading={isLoading}
        onBack={handleBack}
      />
    </div>
  )
}

export function GuideDetailPage() {
  return (
    <DocumentationProvider>
      <GuideDetailContent />
    </DocumentationProvider>
  )
}
