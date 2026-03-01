/**
 * Mock data for Audit List / Site Manager
 * Used when APIs are not yet wired
 */

import type { Tenant, Audit, SiteDetail, ActivityLog } from '@/types/audit-list'

export const mockTenants: Tenant[] = [
  {
    id: 't1',
    name: 'Acme Corp',
    sites: [
      {
        id: 's1',
        name: 'HQ Building A',
        tenantId: 't1',
        floors: [
          {
            id: 'f1',
            name: 'Floor 1',
            siteId: 's1',
            zones: [
              { id: 'z1', name: 'West Wing', floorId: 'f1' },
              { id: 'z2', name: 'East Wing', floorId: 'f1' },
            ],
          },
          {
            id: 'f2',
            name: 'Floor 2',
            siteId: 's1',
            zones: [{ id: 'z3', name: 'Executive Suite', floorId: 'f2' }],
          },
        ],
      },
      {
        id: 's2',
        name: 'Building B',
        tenantId: 't1',
        floors: [
          {
            id: 'f3',
            name: 'Ground Floor',
            siteId: 's2',
            zones: [{ id: 'z4', name: 'Reception', floorId: 'f3' }],
          },
        ],
      },
    ],
  },
  {
    id: 't2',
    name: 'TechStart Inc',
    sites: [
      {
        id: 's3',
        name: 'Main Office',
        tenantId: 't2',
        floors: [
          {
            id: 'f4',
            name: 'Floor 1',
            siteId: 's3',
            zones: [{ id: 'z5', name: 'Open Plan', floorId: 'f4' }],
          },
        ],
      },
    ],
  },
]

export const mockAudits: Audit[] = [
  {
    id: 'a1',
    name: 'Building A - Full Inventory',
    status: 'complete',
    itemCount: 847,
    lastUpdated: '2025-03-01T10:00:00Z',
    ownerId: 'u1',
    owner: { id: 'u1', name: 'Jane Smith', email: 'jane@acme.com' },
    tenantId: 't1',
    siteId: 's1',
    floorId: 'f1',
    zoneId: 'z1',
    siteName: 'HQ Building A',
    floorName: 'Floor 1',
    zoneName: 'West Wing',
    tenantName: 'Acme Corp',
    assignedTeamIds: ['team1'],
  },
  {
    id: 'a2',
    name: 'Floor 3 West Wing',
    status: 'in-progress',
    itemCount: 234,
    lastUpdated: '2025-02-28T14:30:00Z',
    ownerId: 'u2',
    owner: { id: 'u2', name: 'John Doe', email: 'john@acme.com' },
    tenantId: 't1',
    siteId: 's1',
    floorId: 'f2',
    zoneId: 'z3',
    siteName: 'HQ Building A',
    floorName: 'Floor 2',
    zoneName: 'Executive Suite',
    tenantName: 'Acme Corp',
    assignedTeamIds: ['team1', 'team2'],
  },
  {
    id: 'a3',
    name: 'Executive Suites',
    status: 'draft',
    itemCount: 56,
    lastUpdated: '2025-02-27T09:00:00Z',
    ownerId: 'u1',
    owner: { id: 'u1', name: 'Jane Smith', email: 'jane@acme.com' },
    tenantId: 't1',
    siteId: 's1',
    floorId: 'f2',
    zoneId: 'z3',
    siteName: 'HQ Building A',
    floorName: 'Floor 2',
    zoneName: 'Executive Suite',
    tenantName: 'Acme Corp',
    assignedTeamIds: [],
  },
  {
    id: 'a4',
    name: 'Building B Reception',
    status: 'in-progress',
    itemCount: 42,
    lastUpdated: '2025-02-28T16:00:00Z',
    ownerId: 'u2',
    owner: { id: 'u2', name: 'John Doe', email: 'john@acme.com' },
    tenantId: 't1',
    siteId: 's2',
    floorId: 'f3',
    zoneId: 'z4',
    siteName: 'Building B',
    floorName: 'Ground Floor',
    zoneName: 'Reception',
    tenantName: 'Acme Corp',
    assignedTeamIds: ['team1'],
  },
  {
    id: 'a5',
    name: 'TechStart Open Plan',
    status: 'draft',
    itemCount: 0,
    lastUpdated: '2025-02-26T11:00:00Z',
    ownerId: 'u3',
    owner: { id: 'u3', name: 'Alex Chen', email: 'alex@techstart.com' },
    tenantId: 't2',
    siteId: 's3',
    floorId: 'f4',
    zoneId: 'z5',
    siteName: 'Main Office',
    floorName: 'Floor 1',
    zoneName: 'Open Plan',
    tenantName: 'TechStart Inc',
    assignedTeamIds: [],
  },
]

export const mockSiteDetail: SiteDetail = {
  id: 's1',
  name: 'HQ Building A',
  tenantId: 't1',
  tenantName: 'Acme Corp',
  floors: mockTenants[0]?.sites?.[0]?.floors ?? [],
  audits: mockAudits.filter((a) => a.siteId === 's1'),
  items: [],
  queues: [],
  activityLog: [
    {
      id: 'al1',
      auditId: 'a1',
      action: 'Audit completed',
      timestamp: '2025-03-01T10:00:00Z',
      userId: 'u1',
      userName: 'Jane Smith',
    },
    {
      id: 'al2',
      auditId: 'a2',
      action: 'Audit started',
      timestamp: '2025-02-28T14:30:00Z',
      userId: 'u2',
      userName: 'John Doe',
    },
  ],
}

export const mockTeams = [
  { id: 'team1', name: 'Field Audit Team' },
  { id: 'team2', name: 'Quality Review Team' },
]
