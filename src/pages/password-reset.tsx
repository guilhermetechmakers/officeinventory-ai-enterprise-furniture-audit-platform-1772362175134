import { Outlet } from 'react-router-dom'
import { RequestResetForm, ResetTokenValidationView } from '@/components/password-reset'

export function PasswordResetLayout() {
  return <Outlet />
}

export function PasswordResetRequestPage() {
  return <RequestResetForm />
}

export function PasswordResetConfirmPage() {
  return <ResetTokenValidationView />
}
