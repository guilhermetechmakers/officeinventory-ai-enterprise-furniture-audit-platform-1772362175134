import * as React from 'react'
import { Bell, Mail, Smartphone, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useNotificationPreferences, useUpdateNotificationPreferences } from '@/hooks/use-user-profile'
import { cn } from '@/lib/utils'

const CHANNELS: { key: 'email' | 'inApp' | 'push'; label: string; icon: React.ElementType }[] = [
  { key: 'email', label: 'Email', icon: Mail },
  { key: 'inApp', label: 'In-app notifications', icon: MessageSquare },
  { key: 'push', label: 'Push notifications', icon: Smartphone },
]

export function NotificationPreferences() {
  const { data: prefs, isLoading } = useNotificationPreferences()
  const updatePrefs = useUpdateNotificationPreferences()

  const email = prefs?.email ?? true
  const inApp = prefs?.inApp ?? true
  const push = prefs?.push ?? false

  const [localPrefs, setLocalPrefs] = React.useState({ email, inApp, push })
  const hasChanges =
    localPrefs.email !== email || localPrefs.inApp !== inApp || localPrefs.push !== push

  React.useEffect(() => {
    setLocalPrefs({ email, inApp, push })
  }, [email, inApp, push])

  const handleToggle = (key: 'email' | 'inApp' | 'push', value: boolean) => {
    setLocalPrefs((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    await updatePrefs.mutateAsync(localPrefs)
  }

  const handleGlobalToggle = (enabled: boolean) => {
    setLocalPrefs({ email: enabled, inApp: enabled, push: enabled })
  }

  const allEnabled = localPrefs.email && localPrefs.inApp && localPrefs.push

  if (isLoading) {
    return (
      <Card className="rounded-2xl shadow-card">
        <CardHeader>
          <div className="h-6 w-48 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-muted" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              <div className="h-6 w-11 animate-pulse rounded-full bg-muted" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-2xl shadow-card transition-shadow duration-200 hover:shadow-elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification preferences
        </CardTitle>
        <CardDescription>
          Choose how you want to receive notifications. At least one channel is recommended.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3">
          <Label htmlFor="global-notifications" className="font-medium">
            Enable all notifications
          </Label>
          <Switch
            id="global-notifications"
            checked={allEnabled}
            onCheckedChange={handleGlobalToggle}
            aria-label="Toggle all notifications"
          />
        </div>

        <div className="space-y-4">
          {(CHANNELS ?? []).map(({ key, label, icon: Icon }) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-xl border border-border px-4 py-3 transition-colors hover:bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor={`notif-${key}`} className="font-medium">
                    {label}
                  </Label>
                </div>
              </div>
              <Switch
                id={`notif-${key}`}
                checked={localPrefs[key]}
                onCheckedChange={(v) => handleToggle(key, v)}
                aria-label={`Toggle ${label}`}
              />
            </div>
          ))}
        </div>

        {hasChanges && (
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={updatePrefs.isPending}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
                'bg-primary text-primary-foreground hover:bg-primary/90',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {updatePrefs.isPending ? 'Saving…' : 'Save preferences'}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
