/**
 * GuideDetail - Multi-step onboarding flow with progress indicator.
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { GuideDetailSkeleton } from './documentation-skeleton'
import { cn } from '@/lib/utils'
import type { Guide } from '@/types/documentation'

const PROGRESS_STORAGE_KEY = 'officeinventory-guide-progress'

function getStoredProgress(guideId: string): number {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY)
    const data = raw ? JSON.parse(raw) : {}
    return typeof data[guideId] === 'number' ? data[guideId] : 0
  } catch {
    return 0
  }
}

function setStoredProgress(guideId: string, step: number) {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY)
    const data = raw ? JSON.parse(raw) : {}
    data[guideId] = step
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(data))
  } catch {
    // ignore
  }
}

export interface GuideDetailProps {
  guide: Guide | null
  isLoading?: boolean
  onBack?: () => void
}

export function GuideDetail({ guide, isLoading, onBack }: GuideDetailProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = guide?.steps ?? []
  const safeSteps = Array.isArray(steps) ? steps : []
  const sortedSteps = [...safeSteps].sort((a, b) => a.stepNumber - b.stepNumber)
  const step = sortedSteps[currentStep]
  const progressPercent =
    sortedSteps.length > 0 ? Math.round(((currentStep + 1) / sortedSteps.length) * 100) : 0

  useEffect(() => {
    if (guide?.id) {
      const stored = getStoredProgress(guide.id)
      setCurrentStep(Math.min(stored, Math.max(0, sortedSteps.length - 1)))
    }
  }, [guide?.id, sortedSteps.length])

  useEffect(() => {
    if (guide?.id) setStoredProgress(guide.id, currentStep)
  }, [guide?.id, currentStep])

  if (isLoading) return <GuideDetailSkeleton />

  if (!guide) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 py-16 px-6 text-center">
        <p className="text-muted-foreground mb-4">Guide not found.</p>
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} aria-label="Back">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{guide.title}</h1>
          <p className="text-muted-foreground mt-1">{guide.excerpt}</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>
            Step {currentStep + 1} of {sortedSteps.length}
          </span>
          <span>{progressPercent}% complete</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {sortedSteps.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setCurrentStep(i)}
            className={cn(
              'flex items-center gap-2 shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
              i === currentStep
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:bg-muted/50',
              i < currentStep && 'bg-primary/20 text-primary-foreground'
            )}
          >
            {i < currentStep ? <Check className="h-4 w-4" /> : null}
            {s.title}
          </button>
        ))}
      </div>

      {step && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{step.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-muted-foreground">
              {step.content}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        {currentStep < sortedSteps.length - 1 ? (
          <Button onClick={() => setCurrentStep((p) => p + 1)}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button asChild>
            <Link to="/help">Finish</Link>
          </Button>
        )}
      </div>
    </div>
  )
}
