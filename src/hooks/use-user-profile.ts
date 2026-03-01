/** User Profile hooks - data fetching, mutations, null-safe */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as userProfileApi from '@/api/user-profile'
import type {
  UpdateProfilePayload,
  ChangePasswordPayload,
  MFATogglePayload,
  MFAEnrollPayload,
  UpdateNotificationPreferencesPayload,
  SSOLinkPayload,
  SSOUnlinkPayload,
  RevokeSessionPayload,
} from '@/types/user-profile'

const profileKeys = {
  profile: ['user', 'profile'] as const,
  mfa: ['user', 'mfa'] as const,
  notifications: ['user', 'notifications'] as const,
  sso: ['user', 'sso'] as const,
  sessions: ['user', 'sessions'] as const,
}

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.profile,
    queryFn: userProfileApi.getProfile,
    staleTime: 60_000,
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => userProfileApi.updateProfile(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileKeys.profile })
      toast.success('Profile updated successfully')
    },
    onError: (e: Error) => toast.error(e?.message ?? 'Failed to update profile'),
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => userProfileApi.changePassword(payload),
    onSuccess: () => toast.success('Password changed successfully'),
    onError: (e: Error) => toast.error(e?.message ?? 'Failed to change password'),
  })
}

export function useMFAProviders() {
  return useQuery({
    queryKey: profileKeys.mfa,
    queryFn: userProfileApi.getMFAProviders,
    staleTime: 60_000,
  })
}

export function useToggleMFA() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: MFATogglePayload) => userProfileApi.toggleMFA(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileKeys.mfa })
      toast.success('MFA settings updated')
    },
    onError: (e: Error) => toast.error(e?.message ?? 'Failed to update MFA'),
  })
}

export function useEnrollMFA() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: MFAEnrollPayload) => userProfileApi.enrollMFA(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileKeys.mfa })
      toast.success('MFA method enrolled')
    },
    onError: (e: Error) => toast.error(e?.message ?? 'Failed to enroll MFA'),
  })
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: profileKeys.notifications,
    queryFn: userProfileApi.getNotificationPreferences,
    staleTime: 60_000,
  })
}

export function useUpdateNotificationPreferences() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateNotificationPreferencesPayload) =>
      userProfileApi.updateNotificationPreferences(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileKeys.notifications })
      toast.success('Notification preferences saved')
    },
    onError: (e: Error) => toast.error(e?.message ?? 'Failed to save preferences'),
  })
}

export function useLinkedSSO() {
  return useQuery({
    queryKey: profileKeys.sso,
    queryFn: userProfileApi.getLinkedSSO,
    staleTime: 60_000,
  })
}

export function useLinkSSO() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: SSOLinkPayload) => userProfileApi.linkSSO(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileKeys.sso })
      toast.success('Account linked successfully')
    },
    onError: (e: Error) => toast.error(e?.message ?? 'Failed to link account'),
  })
}

export function useUnlinkSSO() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: SSOUnlinkPayload) => userProfileApi.unlinkSSO(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileKeys.sso })
      toast.success('Account unlinked')
    },
    onError: (e: Error) => toast.error(e?.message ?? 'Failed to unlink account'),
  })
}

export function useSessions() {
  return useQuery({
    queryKey: profileKeys.sessions,
    queryFn: userProfileApi.getSessions,
    staleTime: 30_000,
  })
}

export function useRevokeSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: RevokeSessionPayload) => userProfileApi.revokeSession(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileKeys.sessions })
      toast.success('Session revoked')
    },
    onError: (e: Error) => toast.error(e?.message ?? 'Failed to revoke session'),
  })
}
