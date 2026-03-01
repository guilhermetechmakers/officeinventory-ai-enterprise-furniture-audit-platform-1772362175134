/**
 * Mock data for landing page.
 * Swap with CMS/API data when connecting live sources.
 */

export interface LogoAsset {
  id: string
  url: string
  alt?: string
}

export interface Testimonial {
  id: string
  author: string
  text: string
  company?: string
}

export interface PricingTier {
  id: string
  name: string
  price?: string
  features: string[]
}

export const logosMock: LogoAsset[] = [
  { id: '1', url: 'https://placehold.co/120x40/232323/FFFFFF?text=Acme+Corp', alt: 'Acme Corp' },
  { id: '2', url: 'https://placehold.co/120x40/232323/FFFFFF?text=TechCo', alt: 'TechCo' },
  { id: '3', url: 'https://placehold.co/120x40/232323/FFFFFF?text=Global+Inc', alt: 'Global Inc' },
  { id: '4', url: 'https://placehold.co/120x40/232323/FFFFFF?text=Enterprise+Co', alt: 'Enterprise Co' },
  { id: '5', url: 'https://placehold.co/120x40/232323/FFFFFF?text=Fortune+500', alt: 'Fortune 500' },
]

export const testimonialsMock: Testimonial[] = [
  {
    id: '1',
    author: 'Sarah Chen',
    company: 'Acme Corp',
    text: 'OfficeInventory AI cut our audit time by 60%. The AI detection is remarkably accurate and the review queue keeps our team in sync.',
  },
  {
    id: '2',
    author: 'Marcus Johnson',
    company: 'TechCo',
    text: 'Finally, a solution built for enterprise scale. SSO, audit trails, and export-ready reports—exactly what we needed.',
  },
  {
    id: '3',
    author: 'Elena Rodriguez',
    company: 'Global Inc',
    text: 'The mobile capture with offline support is a game-changer for our field teams. No more lost data or duplicate work.',
  },
]

export const pricingMock: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'Contact for pricing',
    features: ['Up to 5 sites', 'Basic AI detection', 'CSV exports', 'Email support'],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 'Contact for pricing',
    features: ['Unlimited sites', 'Advanced AI detection', 'CSV + PDF exports', 'Priority support', 'Review queue'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Contact for pricing',
    features: ['Everything in Professional', 'SSO/SAML', 'Dedicated success manager', 'Custom integrations', 'Audit logs'],
  },
]
