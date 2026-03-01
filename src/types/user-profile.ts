/** User Profile & Settings - data models and API contracts */

export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string | null
  timezone: string
}

export interface MFASettings {
  enabled: boolean
  providers: string[]
  enrolled: boolean
  defaultProvider: string | null
}

export interface NotificationPreferences {
  email: boolean
  inApp: boolean
  push: boolean
}

export interface SSOAccount {
  provider: string
  displayName: string
  avatarUrl: string
  linkedAt: string
}

export interface Session {
  id: string
  device: string
  location: string
  lastActive: string
  ipAddress: string | null
  isActive: boolean
}

export interface UpdateProfilePayload {
  name: string
  email: string
  phone: string | null
  timezone: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

export interface MFATogglePayload {
  enabled: boolean
}

export interface MFAEnrollPayload {
  provider: string
  methodData?: Record<string, unknown>
}

export interface UpdateNotificationPreferencesPayload {
  email: boolean
  inApp: boolean
  push: boolean
}

export interface SSOLinkPayload {
  provider: string
}

export interface SSOUnlinkPayload {
  provider: string
}

export interface RevokeSessionPayload {
  sessionId: string
}
