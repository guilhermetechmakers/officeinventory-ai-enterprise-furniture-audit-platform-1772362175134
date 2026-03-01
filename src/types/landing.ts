/** Landing page data models - ready for CMS/marketing automation integration */

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

export interface ValuePropositionItem {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}

export interface FeatureHighlightSection {
  heading: string
  copy: string
  icon: React.ComponentType<{ className?: string }>
}

export interface LeadSubmissionPayload {
  fullName: string
  email: string
  company: string
  jobTitle: string
  phone?: string
  message?: string
  consent: boolean
}

export interface LeadSubmissionResponse {
  success: boolean
  id?: string
  message?: string
}
