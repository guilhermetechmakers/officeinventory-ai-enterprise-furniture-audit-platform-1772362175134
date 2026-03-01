/**
 * GuideCard - Onboarding guide card with steps overview and CTA.
 */

import { Link } from 'react-router-dom'
import { Book, Play } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { Guide } from '@/types/documentation'

export interface GuideCardProps {
  guide: Guide
  progress?: number
  className?: string
}

export function GuideCard({ guide, progress = 0, className }: GuideCardProps) {
  const steps = guide.steps ?? []
  const safeSteps = Array.isArray(steps) ? steps : []
  const stepCount = safeSteps.length
  const progressPercent = stepCount > 0 ? Math.round((progress / stepCount) * 100) : 0

  return (
    <Card
      className={cn(
        'h-full transition-all duration-200 hover:shadow-elevated hover:scale-[1.01]',
        className
      )}
    >
      <CardHeader>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 mb-2">
          <Book className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-base">{guide.title}</CardTitle>
        <CardDescription className="line-clamp-2">{guide.excerpt}</CardDescription>
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>{stepCount} steps</span>
            {progressPercent > 0 && <span>{progressPercent}% complete</span>}
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </CardHeader>
      <CardFooter className="pt-0">
        <Button asChild variant="default" size="sm" className="rounded-full">
          <Link to={`/help/guides/${guide.id}`}>
            {progressPercent > 0 ? (
              <>
                <Play className="h-4 w-4" />
                Continue
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Start guide
              </>
            )}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
