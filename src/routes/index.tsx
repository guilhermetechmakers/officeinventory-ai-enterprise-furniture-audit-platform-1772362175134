import { createBrowserRouter, Navigate } from 'react-router-dom'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { AuthLayout } from '@/components/layout/auth-layout'
import { LandingPage } from '@/pages/landing'
import { LoginPage } from '@/pages/login'
import { SignupPage } from '@/pages/signup'
import {
  PasswordResetLayout,
  PasswordResetRequestPage,
  PasswordResetConfirmPage,
} from '@/pages/password-reset'
import { EmailVerificationPageRoute } from '@/pages/email-verification'
import { ContactPage } from '@/pages/contact'
import { HelpPage } from '@/pages/help'
import { LegalPage } from '@/pages/legal'
import { NotFoundPage } from '@/pages/not-found'
import { DashboardOverview } from '@/pages/dashboard/overview'
import { CapturePage } from '@/pages/dashboard/capture'
import { UploadsPage } from '@/pages/dashboard/uploads'
import { AuditsPage } from '@/pages/dashboard/audits'
import { AuditsSiteDetailPage } from '@/pages/dashboard/audits-site-detail'
import { AuditDetailPage } from '@/pages/dashboard/audit-detail'
import { ReviewQueuePage } from '@/pages/dashboard/review-queue'
import { MergePage } from '@/pages/dashboard/merge'
import { ReportsPage } from '@/pages/dashboard/reports'
import { AnalyticsPage } from '@/pages/dashboard/analytics'
import { AdminPage } from '@/pages/dashboard/admin'
import { SettingsPage } from '@/pages/dashboard/settings'
import { UsersPage } from '@/pages/dashboard/users'
import { SitesPage } from '@/pages/dashboard/sites'

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'forgot-password', element: <Navigate to="/password-reset/request" replace /> },
      {
        path: 'password-reset',
        element: <PasswordResetLayout />,
        children: [
          { index: true, element: <Navigate to="request" replace /> },
          { path: 'request', element: <PasswordResetRequestPage /> },
          { path: 'confirm', element: <PasswordResetConfirmPage /> },
        ],
      },
      { path: 'verify-email', element: <EmailVerificationPageRoute /> },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardOverview /> },
      { path: 'capture', element: <CapturePage /> },
      { path: 'uploads', element: <UploadsPage /> },
      { path: 'audits', element: <AuditsPage /> },
      { path: 'audits/sites/:siteId', element: <AuditsSiteDetailPage /> },
      { path: 'audits/sites/:siteId/floors/:floorId', element: <AuditsSiteDetailPage /> },
      { path: 'audits/:auditId', element: <AuditDetailPage /> },
      { path: 'review-queue', element: <ReviewQueuePage /> },
      { path: 'merge', element: <MergePage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'admin', element: <AdminPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'sites', element: <SitesPage /> },
      { path: 'sites/:id', element: <SitesPage /> },
    ],
  },
  { path: '/contact', element: <ContactPage /> },
  { path: '/help', element: <HelpPage /> },
  {
    path: '/privacy',
    element: <LegalPage title="Privacy Policy" content="Privacy policy content. Update with your actual privacy policy text." />,
  },
  {
    path: '/terms',
    element: <LegalPage title="Terms of Service" content="Terms of service content. Update with your actual terms." />,
  },
  { path: '/404', element: <NotFoundPage /> },
  { path: '*', element: <Navigate to="/404" replace /> },
])
