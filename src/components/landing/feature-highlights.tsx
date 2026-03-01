import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { FeatureHighlightSection } from '@/types/landing'

export interface FeatureHighlightsProps {
  sections?: FeatureHighlightSection[]
}

const defaultSections: FeatureHighlightSection[] = []

export function FeatureHighlights({ sections = defaultSections }: FeatureHighlightsProps) {
  const safeSections = Array.isArray(sections) ? sections : []
  const hasSections = safeSections.length > 0

  if (!hasSections) {
    return null
  }

  return (
    <section
      className="px-4 py-24 sm:px-6 lg:px-8"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          id="features-heading"
          className="text-center text-3xl font-bold text-foreground mb-4"
        >
          How it works
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-16">
          Capture, review, and export—streamlined for enterprise workflows.
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {safeSections.map((section, i) => {
            const Icon = section?.icon
            return (
              <Card
                key={section?.heading ?? i}
                className={cn(
                  'transition-all duration-300',
                  'hover:shadow-elevated hover:border-primary/30'
                )}
              >
                <CardContent className="pt-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20 text-primary mb-4">
                    {Icon ? <Icon className="h-7 w-7" aria-hidden /> : null}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {section?.heading ?? 'Feature'}
                  </h3>
                  <p className="text-muted-foreground">
                    {section?.copy ?? 'Description placeholder'}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
