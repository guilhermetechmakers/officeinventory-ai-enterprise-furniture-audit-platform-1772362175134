/** User Profile API - profile, MFA, notifications, SSO, sessions */

import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api'
import {
  mockUserProfile,
  mockMFASettings,
  mockNotificationPreferences,
  mockSSOAccounts,
  mockSessions,
} from '@/data/user-profile-mocks'
import type {
  UserProfile,
  MFASettings,
  NotificationPreferences,
  SSOAccount,
  Session,
  UpdateProfilePayload,
  ChangePasswordPayload,
  MFATogglePayload,
  MFAEnrollPayload,
  UpdateNotificationPreferencesPayload,
  SSOLinkPayload,
  SSOUnlinkPayload,
  RevokeSessionPayload,
} from '@/types/user-profile'

const USE_MOCK = true

function safeObject<T>(data: unknown, fallback: T): T {
  return data && typeof data === 'object' && !Array.isArray(data) ? (data as T) : fallback
}

function unwrap<T>(res: unknown, fallback: T): T {
  if (res && typeof res === 'object' && 'data' in res) {
    return safeObject((res as { data?: T }).data, fallback)
  }
  return safeObject(res as T, fallback)
}

function unwrapArray<T>(res: unknown, fallback: T[]): T[] {
  if (res && typeof res === 'object' && 'data' in res) {
    const arr = (res as { data?: T[] }).data
    return Array.isArray(arr) ? arr : fallback
  }
  return Array.isArray(res) ? (res as T[]) : fallback
}

export async function getProfile(): Promise<UserProfile> {
  if (USE_MOCK) return { ...mockUserProfile }
  const res = await apiGet<unknown>('/user/profile')
  return unwrap(res, mockUserProfile)
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
  if (USE_MOCK) {
    return { ...mockUserProfile, ...payload }
  }
  const res = await apiPut<UserProfile>('/user/profile', payload)
  return safeObject(res, mockUserProfile)
}

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  if (USE_MOCK) return
  await apiPost('/user/password/change', payload)
}

export async function getMFAProviders(): Promise<MFASettings> {
  if (USE_MOCK) return { ...mockMFASettings }
  const res = await apiGet<unknown>('/user/mfa/providers')
  return unwrap(res, mockMFASettings)
}

export async function toggleMFA(payload: MFATogglePayload): Promise<MFASettings> {
  if (USE_MOCK) {
    return { ...mockMFASettings, enabled: payload.enabled }
  }
  const res = await apiPost<MFASettings>('/user/mfa/toggle', payload)
  return safeObject(res, mockMFASettings)
}

export async function enrollMFA(payload: MFAEnrollPayload): Promise<MFASettings> {
  if (USE_MOCK) return { ...mockMFASettings }
  const res = await apiPost<MFASettings>('/user/mfa/enroll', payload)
  return safeObject(res, mockMFASettings)
}

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  if (USE_MOCK) return { ...mockNotificationPreferences }
  const res = await apiGet<unknown>('/user/notifications/preferences')
  return unwrap(res, mockNotificationPreferences)
}

export async function updateNotificationPreferences(
  payload: UpdateNotificationPreferencesPayload
): Promise<NotificationPreferences> {
  if (USE_MOCK) {
    return { ...mockNotificationPreferences, ...payload }
  }
  const res = await apiPut<NotificationPreferences>('/user/notifications/preferences', payload)
  return safeObject(res, mockNotificationPreferences)
}

export async function getLinkedSSO(): Promise<SSOAccount[]> {
  if (USE_MOCK) return [...mockSSOAccounts]
  const res = await apiGet<unknown>('/user/sso/linked')
  return unwrapArray(res, mockSSOAccounts)
}

export async function linkSSO(payload: SSOLinkPayload): Promise<SSOAccount> {
  if (USE_MOCK) {
    const newAccount: SSOAccount = {
      provider: payload.provider,
      displayName: payload.provider.charAt(0).toUpperCase() + payload.provider.slice(1),
      avatarUrl: '',
      linkedAt: new Date().toISOString(),
    }
    mockSSOAccounts.push(newAccount)
    return newAccount
  }
  const res = await apiPost<SSOAccount>('/user/sso/link', payload)
  return safeObject(res, {} as SSOAccount)
}

export async function unlinkSSO(payload: SSOUnlinkPayload): Promise<void> {
  if (USE_MOCK) {
    const idx = mockSSOAccounts.findIndex((a) => a.provider === payload.provider)
    if (idx >= 0) mockSSOAccounts.splice(idx, 1)
    return
  }
  await apiDelete(`/user/sso/unlink?provider=${encodeURIComponent(payload.provider)}`)
}

export async function getSessions(): Promise<Session[]> {
  if (USE_MOCK) return [...mockSessions]
  const res = await apiGet<unknown>('/user/sessions')
  return unwrapArray(res, mockSessions)
}

export async function revokeSession(payload: RevokeSessionPayload): Promise<void> {
  if (USE_MOCK) {
    const idx = mockSessions.findIndex((s) => s.id === payload.sessionId)
    if (idx >= 0) mockSessions.splice(idx, 1)
    return
  }
  await apiPost('/user/sessions/revoke', payload)
}
