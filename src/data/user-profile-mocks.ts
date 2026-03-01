/** Mock data for User Profile & Settings - no external APIs */

import type {
  UserProfile,
  MFASettings,
  NotificationPreferences,
  SSOAccount,
  Session,
} from '@/types/user-profile'

export const mockUserProfile: UserProfile = {
  id: 'usr-1',
  name: 'Jane Doe',
  email: 'jane.doe@acme.example.com',
  phone: '+1 (555) 123-4567',
  timezone: 'America/New_York',
}

export const mockMFASettings: MFASettings = {
  enabled: true,
  providers: ['totp', 'sms'],
  enrolled: true,
  defaultProvider: 'totp',
}

export const mockNotificationPreferences: NotificationPreferences = {
  email: true,
  inApp: true,
  push: false,
}

export const mockSSOAccounts: SSOAccount[] = [
  {
    provider: 'google',
    displayName: 'Google',
    avatarUrl: '',
    linkedAt: '2024-01-15T10:00:00Z',
  },
  {
    provider: 'microsoft',
    displayName: 'Microsoft',
    avatarUrl: '',
    linkedAt: '2024-02-20T14:30:00Z',
  },
]

export const mockSessions: Session[] = [
  {
    id: 'sess-1',
    device: 'Chrome on macOS',
    location: 'San Francisco, CA',
    lastActive: new Date().toISOString(),
    ipAddress: '192.168.1.***',
    isActive: true,
  },
  {
    id: 'sess-2',
    device: 'Safari on iPhone',
    location: 'San Francisco, CA',
    lastActive: new Date(Date.now() - 86400000).toISOString(),
    ipAddress: null,
    isActive: false,
  },
]
