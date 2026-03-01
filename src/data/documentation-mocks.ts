/** Mock data for Documentation Center - MVP content layer */

import type { Document, Guide, GuideStep, ApiEndpoint, FAQ, ReleaseNote } from '@/types/documentation'

export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    title: 'Getting Started with OfficeInventory AI',
    slug: 'getting-started',
    category: 'Guides',
    excerpt: 'Learn how to set up your first audit and capture furniture data.',
    lastUpdated: '2025-02-28',
    version: '1.2',
    tags: ['onboarding', 'capture', 'audit'],
  },
  {
    id: 'doc-2',
    title: 'Capture Workflow Guide',
    slug: 'capture-workflow',
    category: 'Guides',
    excerpt: 'Step-by-step guide for capturing and uploading inventory images.',
    lastUpdated: '2025-02-25',
    version: '1.1',
    tags: ['capture', 'mobile', 'upload'],
  },
  {
    id: 'doc-3',
    title: 'API Authentication',
    slug: 'api-auth',
    category: 'API',
    excerpt: 'How to authenticate with the OfficeInventory AI API using API keys.',
    lastUpdated: '2025-02-20',
    version: '1.0',
    tags: ['api', 'auth', 'keys'],
  },
  {
    id: 'doc-4',
    title: 'Audits REST API',
    slug: 'api-audits',
    category: 'API',
    excerpt: 'Create, list, and manage audits via the REST API.',
    lastUpdated: '2025-02-20',
    version: '1.0',
    tags: ['api', 'audits', 'rest'],
  },
  {
    id: 'doc-5',
    title: 'Troubleshooting Upload Failures',
    slug: 'troubleshoot-uploads',
    category: 'Troubleshooting',
    excerpt: 'Common causes and solutions for failed image uploads.',
    lastUpdated: '2025-02-15',
    version: '1.0',
    tags: ['upload', 'errors', 'troubleshooting'],
  },
]

export const mockGuideSteps: GuideStep[] = [
  { id: 'gs-1', guideId: 'doc-1', stepNumber: 1, title: 'Create a site', content: 'Add your first site and floor plan.' },
  { id: 'gs-2', guideId: 'doc-1', stepNumber: 2, title: 'Start an audit', content: 'Create a new audit for the site.' },
  { id: 'gs-3', guideId: 'doc-1', stepNumber: 3, title: 'Capture items', content: 'Use the capture flow to photograph furniture.' },
  { id: 'gs-4', guideId: 'doc-1', stepNumber: 4, title: 'Review and export', content: 'Review AI results and export your data.' },
]

/** Guides = Documents with category Guides + steps */
export const mockGuides: Guide[] = mockDocuments
  .filter((d) => d.category === 'Guides')
  .map((d) => ({
    ...d,
    steps: mockGuideSteps.filter((s) => s.guideId === d.id).sort((a, b) => a.stepNumber - b.stepNumber),
  }))

export const mockEndpoints: ApiEndpoint[] = [
  {
    id: 'ep-1',
    name: 'List Audits',
    path: '/api/v1/audits',
    method: 'GET',
    description: 'Retrieve a paginated list of audits for the tenant.',
    parameters: [
      { name: 'limit', type: 'number', required: false, description: 'Max items per page (default 20)' },
      { name: 'offset', type: 'number', required: false, description: 'Pagination offset' },
    ],
    responses: [{ status: 200, description: 'List of audits' }],
    examples: [
      `curl -X GET "https://api.officeinventory.ai/v1/audits?limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    ],
  },
  {
    id: 'ep-2',
    name: 'Create Audit',
    path: '/api/v1/audits',
    method: 'POST',
    description: 'Create a new audit.',
    parameters: [
      { name: 'siteId', type: 'string', required: true, description: 'Site ID' },
      { name: 'name', type: 'string', required: true, description: 'Audit name' },
    ],
    responses: [{ status: 201, description: 'Created audit' }],
    examples: [
      `curl -X POST "https://api.officeinventory.ai/v1/audits" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"siteId":"site-1","name":"Q1 2025 Audit"}'`,
    ],
  },
]

export const mockFaqs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'How do I reset my password?',
    answer: 'Go to Profile > Security and use the Change Password option. You will receive an email with a reset link.',
    tags: ['auth', 'password'],
  },
  {
    id: 'faq-2',
    question: 'What image formats are supported for capture?',
    answer: 'We support JPEG, PNG, and WebP. Recommended: JPEG for best balance of quality and file size.',
    tags: ['capture', 'upload', 'images'],
  },
  {
    id: 'faq-3',
    question: 'How does the AI detect furniture types?',
    answer: 'Our model uses computer vision trained on office furniture. Confidence scores indicate detection certainty.',
    tags: ['ai', 'inference', 'detection'],
  },
  {
    id: 'faq-4',
    question: 'Can I export data to CSV or Excel?',
    answer: 'Yes. Go to Reports & Exports to configure and download exports in CSV, Excel, or JSON.',
    tags: ['export', 'reports'],
  },
  {
    id: 'faq-5',
    question: 'How do I add new users to my tenant?',
    answer: 'Admins can invite users from the Admin > Users panel. Invitees receive an email to complete registration.',
    tags: ['users', 'admin', 'invite'],
  },
]

export const mockFAQs = mockFaqs

export const mockReleaseNotes: ReleaseNote[] = [
  {
    id: 'rn-1',
    version: '1.2.0',
    date: '2025-02-28',
    highlights: ['Improved capture flow UX', 'New export schema editor', 'API rate limit increases'],
    details: 'This release focuses on usability improvements and API enhancements.',
  },
  {
    id: 'rn-2',
    version: '1.1.0',
    date: '2025-02-15',
    highlights: ['Troubleshooting docs', 'Webhook enhancements', 'Dark mode support'],
    details: 'Documentation and integration improvements.',
  },
  {
    id: 'rn-3',
    version: '1.0.0',
    date: '2025-01-01',
    highlights: ['Initial release', 'Core capture and audit workflows', 'AI inference'],
    details: 'First production release of OfficeInventory AI.',
  },
]
