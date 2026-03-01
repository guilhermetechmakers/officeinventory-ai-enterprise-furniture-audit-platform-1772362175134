/**
 * Mock data for landing page - swap with CMS/marketing automation data.
 * Use API: GET /api/landing/logos, GET /api/landing/testimonials when connected.
 */
import type { LogoAsset, Testimonial, PricingTier } from '@/types/landing'

/** Placeholder logos - use real URLs when CMS is connected */
export const logosMock: LogoAsset[] = [
  { id: '1', url: 'https://placehold.co/120x40/232323/FFFFFF?text=Acme+Corp', alt: 'Acme Corp' },
  { id: '2', url: 'https://placehold.co/120x40/232323/FFFFFF?text=TechCo', alt: 'TechCo' },
  { id: '3', url: 'https://placehold.co/120x40/232323/FFFFFF?text=Global+Inc', alt: 'Global Inc' },
  { id: '4', url: 'https://placehold.co/120x40/232323/FFFFFF?text=Enterprise+Co', alt: 'Enterprise Co' },
  { id: '5', url: 'https://placehold.co/120x40/232323/FFFFFF?text=Fortune+500', alt: 'Fortune 500' },
]

/** Placeholder testimonials - use real data when CMS is connected */
export const testimonialsMock: Testimonial[] = [
  {
    id: '1',
    author: 'Sarah Chen',
    company: 'Global Facilities Corp',
    text: 'OfficeInventory AI cut our audit time by 60%. The AI detection is remarkably accurate and the review queue keeps our team in sync.',
  },
  {
    id: '2',
    author: 'Marcus Johnson',
    company: 'TechSpace Inc',
    text: 'Finally, a solution built for enterprise scale. Multi-site capture, offline support, and exports that integrate with our procurement systems.',
  },
  {
    id: '3',
    author: 'Elena Rodriguez',
    company: 'Sustainable Offices LLC',
    text: 'The ESG reporting and furniture condition tracking have been game-changers for our sustainability audits.',
  },
]

/** Pricing teaser - contact sales for enterprise pricing */
export const pricingMock: PricingTier[] = [
  {
    id: '1',
    name: 'Starter',
    price: 'Contact us',
    features: ['Up to 5 sites', 'Basic AI detection', 'CSV exports'],
  },
  {
    id: '2',
    name: 'Professional',
    price: 'Contact us',
    features: ['Unlimited sites', 'Advanced AI', 'PDF reports', 'Review queue'],
  },
  {
    id: '3',
    name: 'Enterprise',
    price: 'Contact us',
    features: ['SSO ready', 'Dedicated support', 'Custom integrations', 'Audit trails'],
  },
]
