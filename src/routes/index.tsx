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
import { HelpLayout } from '@/pages/help/help-layout'
import { DocumentationCenterPage } from '@/pages/help/documentation-center-page'
import { GuideDetailPage } from '@/pages/help/guide-detail-page'
import { DocDetailPage } from '@/pages/help/doc-detail-page'
import { LegalPage } from '@/pages/legal'
import { PrivacyPolicyPageRoute } from '@/pages/privacy-policy'
import { TermsOfServicePageRoute } from '@/pages/terms-of-service'
import { NotFoundPage } from '@/pages/not-found'
import { DashboardOverview } from '@/pages/dashboard/overview'
import { CapturePage } from '@/pages/dashboard/capture'
import { UploadsPage } from '@/pages/dashboard/uploads'
import { AuditsPage } from '@/pages/dashboard/audits'
import { AuditsSiteDetailPage } from '@/pages/dashboard/audits-site-detail'
import { AuditDetailPage } from '@/pages/dashboard/audit-detail'
import { ItemDetailPage } from '@/pages/dashboard/item-detail'
import { ReviewQueuePage } from '@/pages/dashboard/review-queue'
import { MergePage } from '@/pages/dashboard/merge'
import { ReportsPage } from '@/pages/dashboard/reports'
import { AnalyticsPage } from '@/pages/dashboard/analytics'
import { AdminPage } from '@/pages/dashboard/admin'
import { SettingsPage } from '@/pages/dashboard/settings'
import { ProfilePage } from '@/pages/dashboard/profile'
import { UsersPage } from '@/pages/dashboard/users'
import { SitesPage } from '@/pages/dashboard/sites'
import { TenantSettingsDashboardPage } from '@/pages/dashboard/tenant-settings'

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
      { path: 'audits/:auditId/items/:itemId', element: <ItemDetailPage /> },
      { path: 'review-queue', element: <ReviewQueuePage /> },
      { path: 'merge', element: <MergePage /> },
      { path: 'reports', element: <Navigate to="/dashboard/reports-exports" replace /> },
      { path: 'reports-exports', element: <ReportsPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'admin', element: <AdminPage /> },
      { path: 'tenant-settings', element: <TenantSettingsDashboardPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'sites', element: <SitesPage /> },
      { path: 'sites/:id', element: <SitesPage /> },
    ],
  },
  { path: '/contact', element: <ContactPage /> },
  {
    path: '/help',
    element: <HelpLayout />,
    children: [
      { index: true, element: <DocumentationCenterPage /> },
      { path: 'guides/:id', element: <GuideDetailPage /> },
      { path: 'docs/:id', element: <DocDetailPage /> },
    ],
  },
  {
    path: '/privacy-policy',
    element: <PrivacyPolicyPageRoute />,
  },
  {
    path: '/privacy',
    element: <Navigate to="/privacy-policy" replace />,
  },
  {
    path: '/dpa',
    element: (
      <LegalPage
        title="Data Processing Addendum (DPA)"
        content="This Data Processing Addendum supplements the Privacy Policy and Terms of Service for enterprise customers. It defines the roles and responsibilities for processing personal data when using OfficeInventory AI services. Contact your account manager or legal@officeinventory.ai for a signed DPA."
      />
    ),
  },
  {
    path: '/terms',
    element: <TermsOfServicePageRoute />,
  },
  { path: '/404', element: <NotFoundPage /> },
  { path: '*', element: <Navigate to="/404" replace /> },
])
