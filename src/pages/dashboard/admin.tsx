import * as React from 'react'
import { useLocation } from 'react-router-dom'
import {
  AdminDashboardShell,
  AdminOverview,
  TenantSettingsPanel,
  SSOConfigurationPanel,
  UserManagementPanel,
  SystemHealthPanel,
  BillingOverviewPanel,
  AuditLogPanel,
} from '@/components/admin'
import type { AdminSection } from '@/types/admin'

const sections: AdminSection[] = [
  'overview',
  'tenants',
  'sso',
  'users',
  'health',
  'billing',
  'audit',
]

function isValidSection(s: string): s is AdminSection {
  return sections.includes(s as AdminSection)
}

export function AdminPage() {
  const location = useLocation()
  const stateSection = (location.state as { section?: string } | null)?.section
  const [activeSection, setActiveSection] = React.useState<AdminSection>(() => {
    if (stateSection && isValidSection(stateSection)) return stateSection
    return 'overview'
  })

  React.useEffect(() => {
    if (stateSection && isValidSection(stateSection)) {
      setActiveSection(stateSection)
    }
  }, [stateSection])

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <AdminOverview onSectionChange={setActiveSection} />
      case 'tenants':
        return <TenantSettingsPanel />
      case 'sso':
        return <SSOConfigurationPanel />
      case 'users':
        return <UserManagementPanel />
      case 'health':
        return <SystemHealthPanel />
      case 'billing':
        return <BillingOverviewPanel />
      case 'audit':
        return <AuditLogPanel />
      default:
        return <AdminOverview />
    }
  }

  return (
    <AdminDashboardShell
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {renderContent()}
    </AdminDashboardShell>
  )
}
