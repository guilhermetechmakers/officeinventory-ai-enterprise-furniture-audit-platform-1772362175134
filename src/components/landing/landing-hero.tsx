import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface LandingHeroProps {
  title?: string
  subtitle?: string
  ctaLabel?: string
  ctaHref?: string
  videoThumbnailUrl?: string
  onVideoClick?: () => void
  onCtaClick?: () => void
  className?: string
}

export function LandingHero({
  title = 'AI-powered furniture audit for enterprise portfolios',
  subtitle = 'Inventory, assess, and report on office furniture across multi-site corporate portfolios. Photo-based capture, AI detection, and confidence-driven review—all in one platform.',
  ctaLabel = 'Request a Demo',
  ctaHref = '#contact',
  videoThumbnailUrl,
  onVideoClick,
  onCtaClick,
  className,
}: LandingHeroProps) {
  const handleCta = (e: React.MouseEvent) => {
    if (onCtaClick) {
      e.preventDefault()
      onCtaClick()
    }
  }

  const [firstPart, secondPart] = title.includes(' for ')
    ? title.split(' for ')
    : [title, '']

  return (
    <section
      className={cn('relative px-4 py-24 sm:px-6 lg:px-8 lg:py-32', className)}
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <h1
              id="hero-heading"
              className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl animate-slide-up"
            >
              {firstPart}
              {secondPart && (
                <span className="block bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  {' for '}{secondPart}
                </span>
              )}
            </h1>
            <p
              className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground animate-slide-up"
              style={{ animationDelay: '0.1s' }}
            >
              {subtitle}
            </p>
            <div
              className="mt-10 flex flex-col sm:flex-row gap-4 animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              <Link to={ctaHref} onClick={handleCta}>
                <Button
                  size="lg"
                  className="rounded-full px-8 text-base w-full sm:w-auto"
                  aria-label={ctaLabel}
                >
                  {ctaLabel}
                </Button>
              </Link>
              {videoThumbnailUrl && (
                <button
                  type="button"
                  onClick={onVideoClick}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-border bg-card px-6 py-3 text-sm font-medium hover:bg-muted/50 hover:border-primary/50 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="Play product demo video"
                >
                  <Play className="h-5 w-5 text-primary" aria-hidden />
                  Watch demo
                </button>
              )}
            </div>
          </div>

          {videoThumbnailUrl && (
            <div
              className={cn(
                'relative rounded-2xl overflow-hidden border border-border shadow-elevated',
                'animate-slide-up'
              )}
              style={{ animationDelay: '0.15s' }}
            >
              <button
                type="button"
                onClick={onVideoClick}
                className="block w-full aspect-video bg-card"
                aria-label="Play product demo video"
              >
                <img
                  src={videoThumbnailUrl}
                  alt="Product demo video thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-elevated">
                    <Play className="h-8 w-8 ml-1" aria-hidden />
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
