import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { PricingTier } from '@/types/landing'

export interface PricingTeaserProps {
  tiers?: PricingTier[]
  onCtaClick?: () => void
}

export function PricingTeaser({ tiers = [], onCtaClick }: PricingTeaserProps) {
  const safeTiers = Array.isArray(tiers) ? tiers : []
  const hasTiers = safeTiers.length > 0

  const handleCta = (e: React.MouseEvent) => {
    if (onCtaClick) {
      e.preventDefault()
      onCtaClick()
    }
  }

  return (
    <section
      className="px-4 py-24 sm:px-6 lg:px-8"
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          id="pricing-heading"
          className="text-center text-3xl font-bold text-foreground mb-4"
        >
          Enterprise pricing
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-16">
          Flexible plans for teams of all sizes. Contact sales for custom enterprise pricing.
        </p>

        {hasTiers ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {safeTiers.map((tier) => (
              <Card
                key={tier?.id ?? tier?.name}
                className={cn(
                  'transition-all duration-300',
                  'hover:shadow-elevated hover:border-primary/30'
                )}
              >
                <CardHeader>
                  <h3 className="text-xl font-semibold text-foreground">
                    {tier?.name ?? 'Plan'}
                  </h3>
                  <p className="text-2xl font-bold text-primary">
                    {tier?.price ?? 'Contact us'}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {(tier?.features ?? []).map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-primary shrink-0" aria-hidden />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="#contact" onClick={handleCta}>
                    <Button className="w-full rounded-full" variant="outline">
                      Contact sales
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-12 text-center shadow-card">
            <h3 className="text-2xl font-bold text-foreground">
              Custom enterprise pricing
            </h3>
            <p className="mt-4 text-muted-foreground">
              Get a tailored quote for your organization. SSO, dedicated support, and custom integrations available.
            </p>
            <Link to="#contact" onClick={handleCta} className="mt-8 inline-block">
              <Button size="lg" className="rounded-full px-8">
                Contact sales
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
