/** Documentation Center types - OfficeInventory AI */

export type DocCategory =
  | 'Guides'
  | 'API'
  | 'FAQs'
  | 'Troubleshooting'
  | 'ReleaseNotes'
  | 'Contact'

export interface Document {
  id: string
  title: string
  slug: string
  category: DocCategory
  excerpt: string
  contentHtml?: string
  contentMarkdown?: string
  lastUpdated: string
  version: string
  tags: string[]
}

export interface GuideStep {
  id: string
  guideId: string
  stepNumber: number
  title: string
  content: string
}

export interface ApiEndpoint {
  id: string
  name: string
  path: string
  method: string
  description: string
  parameters: ApiParameter[]
  responses: ApiResponse[]
  examples: string[]
}

export interface ApiParameter {
  name: string
  type: string
  required: boolean
  description: string
}

export interface ApiResponse {
  status: number
  description: string
  schema?: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  tags: string[]
}

export interface ReleaseNote {
  id: string
  version: string
  date: string
  highlights: string[]
  details: string
}

export interface Ticket {
  id: string
  userId: string
  subject: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  createdAt: string
  updatedAt: string
}

export interface DocsListParams {
  category?: DocCategory
  search?: string
  limit?: number
  offset?: number
}

export interface DocsListResponse {
  items: Document[]
  total: number
}

/** Alias for API response shape */
export interface DocsResponse {
  documents: Document[]
  total: number
}

/** Guide extends Document with steps */
export interface Guide extends Document {
  steps?: GuideStep[]
}

/** Alias for API docs */
export type Endpoint = ApiEndpoint

export interface CreateTicketInput {
  subject: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent' | 'critical'
}
