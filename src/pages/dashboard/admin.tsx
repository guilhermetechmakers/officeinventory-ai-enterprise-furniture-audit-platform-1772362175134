import { Settings, Users, Shield, CreditCard } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'

const adminSections = [
  { to: '/dashboard/settings', icon: Settings, title: 'Tenant settings', description: 'Configure inference, exports, storage' },
  { to: '/dashboard/users', icon: Users, title: 'User management', description: 'Invite users, assign roles' },
  { to: '#', icon: Shield, title: 'SSO config', description: 'SAML/OIDC setup and test' },
  { to: '#', icon: CreditCard, title: 'Billing', description: 'Usage and billing overview' },
]

export function AdminPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Tenant & system administration
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {adminSections.map((section) => (
          <Link key={section.title} to={section.to ?? '#'}>
            <Card className="h-full transition-all duration-300 hover:shadow-elevated hover:border-primary/30">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 mb-2">
                  <section.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
