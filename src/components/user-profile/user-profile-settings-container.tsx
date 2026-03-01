import { ProfileForm } from './profile-form'
import { SecuritySettings } from './security-settings'
import { NotificationPreferences } from './notification-preferences'
import { ConnectedAccounts } from './connected-accounts'
import { User } from 'lucide-react'
import { cn } from '@/lib/utils'

export function UserProfileSettingsContainer() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <User className="h-7 w-7" />
          User Profile & Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your profile, security, notifications, and connected accounts.
        </p>
      </div>

      <div
        className={cn(
          'grid gap-6',
          'lg:grid-cols-1'
        )}
      >
        <ProfileForm />
        <SecuritySettings />
        <NotificationPreferences />
        <ConnectedAccounts />
      </div>
    </div>
  )
}
