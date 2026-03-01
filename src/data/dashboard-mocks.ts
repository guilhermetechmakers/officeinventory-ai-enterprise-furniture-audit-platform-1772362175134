import type { DashboardData } from '@/types/dashboard'

/** Mock dashboard data for development and fallback when API is unavailable */
export const MOCK_DASHBOARD_DATA: DashboardData = {
  audits: [
    {
      id: '1',
      siteId: 's1',
      siteName: 'Building A - Floor 1',
      status: 'in-progress',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      itemsDetected: 24,
      name: 'Floor 1 West Wing',
    },
    {
      id: '2',
      siteId: 's2',
      siteName: 'Building B - Floor 2',
      status: 'in-progress',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      itemsDetected: 18,
      name: 'Floor 2 East',
    },
    {
      id: '3',
      siteId: 's1',
      siteName: 'Building A - Floor 3',
      status: 'complete',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      itemsDetected: 42,
      name: 'Floor 3 West Wing',
    },
  ],
  kpis: {
    activeAudits: 12,
    itemsToday: 47,
    pendingReviews: 43,
    exportCreditsUsed: 8,
  },
  recentActivities: [
    {
      id: 'a1',
      type: 'batch_uploaded',
      timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      description: '24 images from Building A',
      auditId: '1',
      siteId: 's1',
    },
    {
      id: 'a2',
      type: 'audit_completed',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      description: 'Floor 3 - West Wing',
      auditId: '3',
      siteId: 's1',
    },
    {
      id: 'a3',
      type: 'review_assigned',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      description: '12 items to you',
      auditId: '2',
      siteId: 's2',
    },
    {
      id: 'a4',
      type: 'export_generated',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      description: 'Inventory List Q1',
      auditId: '3',
      siteId: 's1',
    },
  ],
  sites: [
    {
      id: 's1',
      name: 'Building A',
      location: '123 Main St',
      metrics: { activeAudits: 2, itemsToday: 24, pendingReviews: 12 },
    },
    {
      id: 's2',
      name: 'Building B',
      location: '456 Oak Ave',
      metrics: { activeAudits: 1, itemsToday: 18, pendingReviews: 8 },
    },
    {
      id: 's3',
      name: 'Building C',
      location: '789 Pine Rd',
      metrics: { activeAudits: 0, itemsToday: 0, pendingReviews: 5 },
    },
  ],
}
