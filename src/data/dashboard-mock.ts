import type { DashboardData, Audit, Site, Activity } from '@/types/dashboard'

/** Mock data for dashboard - used when API is unavailable or for development */
export const MOCK_AUDITS: Audit[] = [
  {
    id: '1',
    siteId: 'site-1',
    siteName: 'Building A',
    name: 'Building A - Full Inventory',
    status: 'in-progress',
    lastUpdated: '2025-03-01T10:30:00Z',
    itemsDetected: 847,
    location: 'Floor 1-3',
  },
  {
    id: '2',
    siteId: 'site-2',
    siteName: 'Building B',
    name: 'Floor 3 West Wing',
    status: 'in-progress',
    lastUpdated: '2025-02-28T14:20:00Z',
    itemsDetected: 234,
    location: 'Floor 3',
  },
  {
    id: '3',
    siteId: 'site-1',
    siteName: 'Building A',
    name: 'Executive Suites',
    status: 'draft',
    lastUpdated: '2025-02-27T09:15:00Z',
    itemsDetected: 56,
    location: 'Floor 1',
  },
]

export const MOCK_SITES: Site[] = [
  {
    id: 'site-1',
    name: 'Building A',
    location: '123 Main St',
    metrics: { activeAudits: 2, itemsToday: 45, pendingReviews: 12 },
  },
  {
    id: 'site-2',
    name: 'Building B',
    location: '456 Oak Ave',
    metrics: { activeAudits: 1, itemsToday: 24, pendingReviews: 8 },
  },
]

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'batch_uploaded',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    description: '24 images from Building A',
    auditId: '1',
    siteId: 'site-1',
  },
  {
    id: '2',
    type: 'audit_completed',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    description: 'Floor 3 - West Wing',
    auditId: '2',
    siteId: 'site-2',
  },
  {
    id: '3',
    type: 'review_assigned',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    description: '12 items to you',
    auditId: '1',
  },
  {
    id: '4',
    type: 'export_generated',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    description: 'Inventory List Q1',
    auditId: '1',
  },
]

export const MOCK_DASHBOARD_DATA: DashboardData = {
  audits: MOCK_AUDITS,
  kpis: {
    activeAudits: 12,
    itemsToday: 69,
    pendingReviews: 43,
    exportCreditsUsed: 8,
  },
  recentActivities: MOCK_ACTIVITIES,
  sites: MOCK_SITES,
}
