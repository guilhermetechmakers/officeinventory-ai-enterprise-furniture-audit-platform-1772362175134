import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { LogoAsset, Testimonial } from '@/types/landing'

export interface CustomerLogosCarouselProps {
  logos?: LogoAsset[]
  testimonials?: Testimonial[]
}

export function CustomerLogosCarousel({
  logos = [],
  testimonials = [],
}: CustomerLogosCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const safeLogos = Array.isArray(logos) ? logos : []
  const safeTestimonials = Array.isArray(testimonials) ? testimonials : []
  const hasContent = safeLogos.length > 0 || safeTestimonials.length > 0

  useEffect(() => {
    if (!scrollRef.current || isPaused || safeLogos.length === 0) return
    const el = scrollRef.current
    const scroll = () => {
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
        el.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        el.scrollBy({ left: 1, behavior: 'auto' })
      }
    }
    const id = setInterval(scroll, 30)
    return () => clearInterval(id)
  }, [isPaused, safeLogos.length])

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const step = scrollRef.current.clientWidth
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -step : step,
      behavior: 'smooth',
    })
  }

  if (!hasContent) {
    return (
      <section className="px-4 py-24 sm:px-6 lg:px-8" aria-label="Trusted by enterprises">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-bold text-foreground mb-4">
            Trusted by enterprise teams
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            Facilities, procurement, and IT teams rely on OfficeInventory AI.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section
      className="px-4 py-24 sm:px-6 lg:px-8"
      aria-label="Customer logos and testimonials"
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-3xl font-bold text-foreground mb-4">
          Trusted by enterprise teams
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Facilities, procurement, and IT teams rely on OfficeInventory AI.
        </p>

        {safeTestimonials.length > 0 && (
          <div className="mb-16 rounded-2xl border border-border bg-card p-8 shadow-card">
            <blockquote className="text-lg text-foreground italic">
              &ldquo;{(safeTestimonials[0]?.text ?? '')}&rdquo;
            </blockquote>
            <footer className="mt-4 text-muted-foreground">
              — {safeTestimonials[0]?.author ?? ''}
              {safeTestimonials[0]?.company ? (
                <span>, {safeTestimonials[0].company}</span>
              ) : null}
            </footer>
          </div>
        )}

        {safeLogos.length > 0 && (
          <div className="relative">
            <div
              ref={scrollRef}
              className="flex gap-12 overflow-x-auto scroll-smooth scrollbar-hide py-4"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
              role="region"
              aria-label="Customer logos carousel"
            >
              {safeLogos.map((logo) => (
                <div
                  key={logo?.id ?? logo?.url}
                  className="flex h-16 w-32 shrink-0 items-center justify-center rounded-lg bg-secondary/50"
                >
                  {logo?.url ? (
                    <img
                      src={logo.url}
                      alt={logo?.alt ?? 'Customer logo'}
                      className="max-h-12 max-w-24 object-contain"
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {logo?.alt ?? 'Logo'}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll('left')}
                aria-label="Previous logos"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll('right')}
                aria-label="Next logos"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
