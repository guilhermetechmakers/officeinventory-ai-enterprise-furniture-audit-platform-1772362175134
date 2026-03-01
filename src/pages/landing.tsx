import { useState } from 'react'
import {
  LandingHero,
  ValuePropositionGrid,
  FeatureHighlights,
  CustomerLogosCarousel,
  PricingTeaser,
  ContactForm,
  HeaderNav,
  FooterLinks,
  DemoRequestModal,
} from '@/components/landing'
import {
  logosMock,
  testimonialsMock,
  pricingMock,
} from '@/data/landing-mocks'
import { Camera, Sparkles, CheckSquare, FileText, CameraIcon, ListChecks, FileOutput } from 'lucide-react'
import type { ValuePropositionItem, FeatureHighlightSection } from '@/types/landing'

const valueProps: ValuePropositionItem[] = [
  {
    icon: Camera,
    title: 'Capture',
    description:
      'Mobile-first, offline-tolerant photo capture with resumable uploads and batch metadata.',
  },
  {
    icon: Sparkles,
    title: 'AI Detection',
    description:
      'Pluggable vision APIs detect furniture, extract attributes, and produce evidence-backed detections.',
  },
  {
    icon: CheckSquare,
    title: 'Review',
    description:
      'Confidence-driven review queue with human-in-the-loop validation and audit trails.',
  },
  {
    icon: FileText,
    title: 'Reporting',
    description:
      'Export-ready CSV/PDF outputs and analytics for procurement and ESG reporting.',
  },
]

const featureSections: FeatureHighlightSection[] = [
  {
    icon: CameraIcon,
    heading: 'Capture Flow',
    copy:
      'Field teams capture photos on mobile with offline support. Batch upload and metadata tagging streamline data entry.',
  },
  {
    icon: ListChecks,
    heading: 'Review Queue',
    copy:
      'AI-powered confidence scores prioritize items for human review. Approve, reject, or edit with full audit trails.',
  },
  {
    icon: FileOutput,
    heading: 'Exports',
    copy:
      'CSV and PDF exports for procurement, ESG reporting, and compliance. Integrate with your existing systems.',
  },
]

export function LandingPage() {
  const [demoModalOpen, setDemoModalOpen] = useState(false)

  const logos = Array.isArray(logosMock) ? logosMock : []
  const testimonials = Array.isArray(testimonialsMock) ? testimonialsMock : []
  const pricing = Array.isArray(pricingMock) ? pricingMock : []

  return (
    <div className="min-h-screen bg-background">
      {/* Animated gradient hero background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl animate-pulse" />
        <div
          className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
      </div>

      <HeaderNav />

      <main role="main">
        <LandingHero
          ctaLabel="Request a Demo"
          ctaHref="#contact"
          onCtaClick={() => setDemoModalOpen(true)}
        />

        <section id="value-prop" className="scroll-mt-20">
          <ValuePropositionGrid items={valueProps} />
        </section>

        <section id="features" className="scroll-mt-20">
          <FeatureHighlights sections={featureSections} />
        </section>

        <section id="logos" className="scroll-mt-20">
          <CustomerLogosCarousel logos={logos} testimonials={testimonials} />
        </section>

        <section id="pricing" className="scroll-mt-20">
          <PricingTeaser tiers={pricing} onCtaClick={() => setDemoModalOpen(true)} />
        </section>

        <ContactForm id="contact" onSuccess={() => setDemoModalOpen(false)} />
      </main>

      <FooterLinks />

      <DemoRequestModal open={demoModalOpen} onOpenChange={setDemoModalOpen} />
    </div>
  )
}
