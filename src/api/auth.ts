import { apiGet, apiPost, type ApiError } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import type {
  LoginRequest,
  LoginResponse,
  SSOProvider,
  SSORedirectRequest,
  SSORedirectResponse,
  InvitationValidateRequest,
  InvitationValidateResponse,
  InvitationAcceptRequest,
  InvitationAcceptResponse,
  RequestAccessPayload,
  RequestAccessResponse,
  PasswordResetRequest,
  PasswordResetResponse,
  User,
} from '@/types/auth'

const AUTH_BASE = '/api/v1/auth'
const useSupabase = Boolean(import.meta.env.VITE_SUPABASE_URL)

function toUser(profile: { id?: string; email?: string; user_metadata?: { name?: string } }): User {
  return {
    id: profile?.id ?? '',
    email: profile?.email ?? '',
    name: profile?.user_metadata?.name,
    roles: ['user'],
    orgs: [],
  }
}

/** Login with email and password */
export async function login(payload: LoginRequest): Promise<LoginResponse> {
  if (useSupabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    })
    if (error) throw { message: error.message, code: error.message }
    const session = data?.session
    const userData = data?.user
    if (!session || !userData) throw new Error('Invalid response')
    return {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      user: toUser(userData),
      redirectTo: '/dashboard',
    }
  }

  try {
    const res = await apiPost<LoginResponse>(`${AUTH_BASE}/login`, payload)
    return res ?? { accessToken: '', user: { id: '', email: '', roles: [] } }
  } catch (err) {
    const status = (err as { status?: number })?.status
    if (status === 404 || status === 0) {
      await new Promise((r) => setTimeout(r, 600))
      return {
        accessToken: 'mock-token',
        user: { id: '1', email: payload.email, roles: ['user'] },
        redirectTo: '/dashboard',
      }
    }
    throw err
  }
}

/** Fetch available SSO providers */
export async function getSSOProviders(): Promise<SSOProvider[]> {
  try {
    const res = await apiGet<SSOProvider[] | { data?: SSOProvider[] }>(`${AUTH_BASE}/sso/providers`)
    const list = Array.isArray(res) ? res : (res as { data?: SSOProvider[] })?.data ?? []
    return list ?? []
  } catch {
    return []
  }
}

/** Initiate SSO redirect */
export async function ssoRedirect(payload: SSORedirectRequest): Promise<SSORedirectResponse> {
  const res = await apiPost<SSORedirectResponse>(`${AUTH_BASE}/sso/redirect`, payload)
  return res ?? { redirectUrl: '' }
}

/** Validate invitation */
export async function validateInvitation(
  payload: InvitationValidateRequest
): Promise<InvitationValidateResponse> {
  try {
    const res = await apiPost<InvitationValidateResponse>(
      `${AUTH_BASE}/invitations/validate`,
      payload
    )
    return res ?? { invited: false }
  } catch (err) {
    const status = (err as { status?: number })?.status
    if (status === 404 || status === 0) {
      return {
        invited: true,
        invitationData: {
          id: payload.invitationId,
          email: payload.email,
          organization: 'Demo Organization',
          status: 'pending',
        },
      }
    }
    return { invited: false }
  }
}

/** Accept invitation */
export async function acceptInvitation(
  payload: InvitationAcceptRequest
): Promise<InvitationAcceptResponse> {
  try {
    const res = await apiPost<InvitationAcceptResponse>(`${AUTH_BASE}/invitations/accept`, payload)
    return res ?? { accessToken: '', user: { id: '', email: '', roles: [] } }
  } catch (err) {
    const status = (err as { status?: number })?.status
    if (status === 404 || status === 0) {
      return {
        accessToken: 'mock-token',
        user: { id: '1', email: 'invited@example.com', roles: ['user'] },
      }
    }
    throw err
  }
}

/** Request access for new clients */
export async function requestAccess(payload: RequestAccessPayload): Promise<RequestAccessResponse> {
  try {
    const res = await apiPost<RequestAccessResponse>(`${AUTH_BASE}/request-access`, payload)
    return res ?? { requestId: 'mock-id', status: 'pending' }
  } catch {
    return { requestId: `req-${Date.now()}`, status: 'pending' }
  }
}

/** Request password reset */
export async function passwordReset(payload: PasswordResetRequest): Promise<PasswordResetResponse> {
  if (useSupabase) {
    const { error } = await supabase.auth.resetPasswordForEmail(payload.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw { message: error.message }
    return { message: 'Check your email for reset instructions' }
  }

  try {
    const res = await apiPost<PasswordResetResponse>(`${AUTH_BASE}/password-reset`, payload)
    return res ?? { message: 'Check your email for reset instructions' }
  } catch {
    return { message: 'Check your email for reset instructions' }
  }
}

/** Check if error is ApiError */
export function isApiError(err: unknown): err is ApiError {
  return typeof err === 'object' && err !== null && 'message' in err && 'status' in err
}
