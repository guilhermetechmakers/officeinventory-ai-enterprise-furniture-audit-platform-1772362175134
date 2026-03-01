import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { ValuePropositionItem } from '@/types/landing'

export interface ValuePropositionGridProps {
  items?: ValuePropositionItem[]
}

const defaultItems: ValuePropositionItem[] = []

export function ValuePropositionGrid({ items = defaultItems }: ValuePropositionGridProps) {
  const safeItems = Array.isArray(items) ? items : []
  const hasItems = safeItems.length > 0

  if (!hasItems) {
    return null
  }

  return (
    <section
      className="px-4 py-24 sm:px-6 lg:px-8"
      aria-labelledby="value-prop-heading"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          id="value-prop-heading"
          className="text-center text-3xl font-bold text-foreground mb-4"
        >
          Built for enterprise scale
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-16">
          From capture to export—every step designed for field teams, reviewers, and procurement.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {safeItems.map((item, i) => {
            const Icon = item?.icon
            return (
              <Card
                key={item?.title ?? i}
                className={cn(
                  'group transition-all duration-300',
                  'hover:shadow-elevated hover:-translate-y-1',
                  'hover:border-primary/30 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'
                )}
                tabIndex={0}
              >
                <CardHeader>
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-xl',
                      'bg-primary/20 text-primary',
                      'group-hover:bg-primary group-hover:text-primary-foreground transition-colors'
                    )}
                  >
                    {Icon ? <Icon className="h-6 w-6" aria-hidden /> : null}
                  </div>
                  <CardTitle className="mt-4">{item?.title ?? 'Feature'}</CardTitle>
                  <CardDescription>
                    {item?.description ?? 'Description placeholder'}
                  </CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
