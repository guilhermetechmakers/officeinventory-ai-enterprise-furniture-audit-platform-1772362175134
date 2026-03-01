/**
 * Privacy Policy content - enterprise-grade data handling disclosure.
 * Used when API/CMS content is unavailable. Safe for null-coalescing.
 */

import type { PolicySection } from '@/types/privacy-policy'

export const PRIVACY_POLICY_SECTIONS: PolicySection[] = [
  {
    id: 'data-collection',
    title: 'Data Collection',
    body: 'We collect information you provide directly (account details, contact information, audit data), information from your use of our services (usage logs, device information, IP address), and information from third-party integrations when you authorize them. We use this data to deliver, improve, and secure our services.',
    subsections: [
      {
        id: 'data-collection-account',
        title: 'Account and Profile Data',
        body: 'When you create an account, we collect your name, email address, organization details, and any profile information you choose to provide.',
        subsections: [],
      },
      {
        id: 'data-collection-audit',
        title: 'Audit and Inventory Data',
        body: 'Furniture audit data, images, site information, and inventory records are stored to support your workflows and reporting.',
        subsections: [],
      },
    ],
  },
  {
    id: 'data-usage',
    title: 'Data Usage',
    body: 'We use your data to operate our platform, provide AI-powered insights, generate reports, support customer service, improve our products, and comply with legal obligations. We do not sell your personal data.',
  },
  {
    id: 'retention',
    title: 'Data Retention',
    body: 'We retain your data for as long as your account is active and as needed to provide services. After account closure, we retain data for a limited period for legal, compliance, and dispute resolution purposes. Audit logs and anonymized analytics may be retained longer.',
    subsections: [
      {
        id: 'retention-timeline',
        title: 'Retention Timelines',
        body: 'Account data: until account closure + 30 days. Audit data: per your retention settings. Logs: up to 90 days. Legal holds may extend retention.',
        subsections: [],
      },
    ],
  },
  {
    id: 'sharing',
    title: 'Sharing with Third Parties',
    body: 'We share data only with service providers who assist in operating our platform (hosting, analytics, support), when required by law, or with your consent. We require processors to protect data under contractual agreements.',
  },
  {
    id: 'security',
    title: 'Security Measures',
    body: 'We implement industry-standard security measures to protect your data.',
    subsections: [
      {
        id: 'security-encryption',
        title: 'Encryption',
        body: 'Data is encrypted at rest (AES-256) and in transit (TLS 1.3). All API communications use HTTPS.',
        subsections: [],
      },
      {
        id: 'security-access',
        title: 'Access Controls',
        body: 'Access is restricted by role and need. We use multi-factor authentication for administrative access and audit logs for security events.',
        subsections: [],
      },
    ],
  },
  {
    id: 'rights',
    title: 'Data Subject Rights',
    body: 'You have the right to access, correct, delete, port, and restrict processing of your personal data. You may also object to processing and withdraw consent where applicable.',
    subsections: [
      {
        id: 'rights-access',
        title: 'Access and Portability',
        body: 'You can request a copy of your data in a portable format. We will respond within 30 days.',
        subsections: [],
      },
      {
        id: 'rights-deletion',
        title: 'Correction and Deletion',
        body: 'You can update or delete your data through account settings or by contacting us. Legal obligations may limit deletion in some cases.',
        subsections: [],
      },
    ],
  },
  {
    id: 'choices',
    title: 'Your Choices',
    body: 'You can manage consent preferences, opt out of marketing communications, and control cookie settings. Some features may require certain data to function.',
  },
  {
    id: 'contact',
    title: 'Contact Information',
    body: 'For privacy inquiries, data requests, or complaints, contact our Data Protection Officer at privacy@officeinventory.ai. For EU users, you may also lodge a complaint with your supervisory authority.',
  },
]

export const PRIVACY_POLICY_VERSION = '1.0.0'
export const PRIVACY_POLICY_LAST_UPDATED = '2025-03-01'
export const PRIVACY_POLICY_REVIEWER = 'Legal & Compliance'
