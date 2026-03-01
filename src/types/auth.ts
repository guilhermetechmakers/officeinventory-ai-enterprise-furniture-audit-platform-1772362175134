/** Auth-related type definitions for OfficeInventory AI */

export interface User {
  id: string
  email: string
  name?: string
  roles: string[]
  orgs?: string[]
}

export interface Invitation {
  id: string
  email: string
  organization: string
  status: string
  expiresAt?: string
}

export interface AccessRequest {
  id: string
  organizationName: string
  status: string
  createdAt: string
}

export interface Session {
  accessToken: string
  refreshToken?: string
  expiresAt: string
}

export interface SSOProvider {
  id: string
  name: string
  type: 'SAML' | 'OIDC'
  authorizeUrl?: string
  clientId?: string
}

export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  accessToken: string
  refreshToken?: string
  user: User
  redirectTo?: string
}

export interface SSORedirectRequest {
  providerId: string
  returnUrl?: string
  state?: string
}

export interface SSORedirectResponse {
  redirectUrl: string
}

export interface InvitationValidateRequest {
  invitationId: string
  email: string
}

export interface InvitationValidateResponse {
  invited: boolean
  invitationData?: Invitation
}

export interface InvitationAcceptRequest {
  invitationId: string
  userDetails: { name?: string; password?: string }
}

export interface InvitationAcceptResponse {
  accessToken: string
  user: User
}

export interface RequestAccessPayload {
  organizationName: string
  contactEmail: string
  reason: string
}

export interface RequestAccessResponse {
  requestId: string
  status: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetResponse {
  message: string
}

export interface ConfirmPasswordResetRequest {
  token?: string
  newPassword: string
}

export interface ConfirmPasswordResetResponse {
  success: boolean
  message?: string
}

export interface ValidateResetTokenResponse {
  valid: boolean
  expiresAt?: string
  reason?: string
}

export interface ConfirmPasswordResetRequest {
  token?: string
  newPassword: string
}

export interface ValidateResetTokenResponse {
  valid: boolean
  expiresAt?: string
  reason?: string
}

/** Email verification status for intermediary verification page */
export type VerificationStatus = 'pending' | 'verified' | 'failed'

export interface UserEmailVerification {
  email: string
  status: VerificationStatus
  cooldownSeconds: number
}

export interface ChangeEmailPayload {
  email: string
  requestedAt: string
}
