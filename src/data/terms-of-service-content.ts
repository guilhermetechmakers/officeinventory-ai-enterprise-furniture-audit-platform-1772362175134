/**
 * Terms of Service content - enterprise-grade legal terms.
 * Used when API/CMS content is unavailable. Safe for null-coalescing.
 */

import type { ToSSection } from '@/types/terms-of-service'

export const TOS_CONTENT_SECTIONS: ToSSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    body: 'Welcome to OfficeInventory AI. These Terms of Service ("Terms") govern your access to and use of the OfficeInventory AI platform, including our web applications, APIs, and related services (collectively, the "Services"). By accessing or using the Services, you agree to be bound by these Terms. If you do not agree, do not use the Services.',
  },
  {
    id: 'definitions',
    title: 'Definitions',
    body: 'For purposes of these Terms: "Platform" means the OfficeInventory AI software and infrastructure; "User" means any individual or entity that accesses the Services; "Content" means data, images, text, and materials you upload or generate through the Services; "Account" means your registered user account.',
  },
  {
    id: 'license-grant',
    title: 'License Grant',
    body: 'Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Services for your internal business purposes. This license does not include the right to sublicense, resell, or commercially exploit the Services.',
    subsections: [
      {
        id: 'license-scope',
        title: 'Scope of License',
        body: 'The license covers use of the platform for furniture inventory audits, AI-powered insights, reporting, and related workflows. Enterprise customers may have additional license terms in their order form or agreement.',
        subsections: [],
      },
    ],
  },
  {
    id: 'restrictions',
    title: 'Restrictions',
    body: 'You agree not to: (a) reverse engineer, decompile, or disassemble the Services; (b) use the Services for any illegal purpose or in violation of applicable laws; (c) upload malicious code or content that infringes third-party rights; (d) attempt to gain unauthorized access to our systems or other accounts; (e) use automated means to scrape or extract data beyond permitted API usage; (f) resell or redistribute the Services without authorization.',
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    body: 'We retain all rights, title, and interest in the Services, including software, trademarks, and documentation. You retain ownership of your Content. By uploading Content, you grant us a license to process, store, and display it as necessary to provide the Services.',
  },
  {
    id: 'data-handling',
    title: 'Data Handling & Privacy',
    body: 'We process personal data in accordance with our Privacy Policy and applicable data protection laws. By using the Services, you acknowledge our data practices. For enterprise customers, a Data Processing Addendum (DPA) may apply.',
    subsections: [
      {
        id: 'data-processing',
        title: 'Data Processing',
        body: 'We act as a data processor for Content you provide. We implement appropriate technical and organizational measures to protect your data. See our Privacy Policy for details.',
        subsections: [],
      },
    ],
  },
  {
    id: 'disclaimers',
    title: 'Disclaimers',
    body: 'THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. AI-GENERATED INSIGHTS ARE INFORMATIONAL AND SHOULD NOT REPLACE PROFESSIONAL JUDGMENT.',
  },
  {
    id: 'limitation-of-liability',
    title: 'Limitation of Liability',
    body: 'TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING FROM OR RELATED TO THE SERVICES SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM. WE SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.',
  },
  {
    id: 'indemnification',
    title: 'Indemnification',
    body: 'You agree to indemnify, defend, and hold harmless OfficeInventory AI, its affiliates, and their officers, directors, employees, and agents from any claims, damages, losses, or expenses (including reasonable attorneys\' fees) arising from your use of the Services, your Content, or your violation of these Terms.',
  },
  {
    id: 'term-termination',
    title: 'Term & Termination',
    body: 'These Terms remain in effect while you use the Services. We may suspend or terminate your access at any time for violation of these Terms or for any other reason. Upon termination, your right to use the Services ceases. Provisions that by their nature should survive (e.g., liability limitations, indemnification) will survive.',
  },
  {
    id: 'governing-law',
    title: 'Governing Law & Jurisdiction',
    body: 'These Terms are governed by the laws of the State of Delaware, United States, without regard to conflict of law principles. Any disputes shall be resolved in the state or federal courts located in Delaware. You consent to personal jurisdiction in such courts.',
  },
  {
    id: 'changes-to-terms',
    title: 'Changes to Terms',
    body: 'We may update these Terms from time to time. We will notify you of material changes by posting the updated Terms and updating the "Last updated" date. Continued use of the Services after changes constitutes acceptance. For significant changes, we may require explicit acceptance.',
    subsections: [
      {
        id: 'version-history',
        title: 'Version History',
        body: 'Prior versions of the Terms are archived and available upon request. Your acceptance of a prior version remains valid for that version.',
        subsections: [],
      },
    ],
  },
  {
    id: 'acceptance-binding',
    title: 'Acceptance & Binding Effect',
    body: 'By creating an account, clicking "Accept," or using the Services, you acknowledge that you have read, understood, and agree to be bound by these Terms. These Terms constitute the entire agreement between you and OfficeInventory AI regarding the Services.',
  },
  {
    id: 'contact',
    title: 'Contact Information',
    body: 'For questions about these Terms, contact us at legal@officeinventory.ai or OfficeInventory AI, Legal Department. For support, visit our help center or contact support@officeinventory.ai.',
  },
]

export const TOS_VERSION_NUMBER = '1.0.0'
export const TOS_EFFECTIVE_DATE = '2025-03-01'
export const TOS_VERSION_ID = 'tos-v1.0.0'
