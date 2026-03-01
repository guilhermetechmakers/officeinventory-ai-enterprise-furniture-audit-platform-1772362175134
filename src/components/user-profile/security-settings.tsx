import * as React from 'react'
import { Shield, Key, Smartphone } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { ChangePasswordModal } from './change-password-modal'
import { useMFAProviders, useToggleMFA } from '@/hooks/use-user-profile'

const MFA_PROVIDERS: { id: string; label: string; icon: React.ElementType }[] = [
  { id: 'totp', label: 'Authenticator app (TOTP)', icon: Smartphone },
  { id: 'sms', label: 'SMS', icon: Smartphone },
]

export function SecuritySettings() {
  const { data: mfa, isLoading } = useMFAProviders()
  const toggleMFA = useToggleMFA()
  const [changePasswordOpen, setChangePasswordOpen] = React.useState(false)
  const [mfaConfirmOpen, setMfaConfirmOpen] = React.useState(false)
  const [pendingMfaEnabled, setPendingMfaEnabled] = React.useState<boolean | null>(null)

  const enabled = mfa?.enabled ?? false
  const providers = Array.isArray(mfa?.providers) ? mfa.providers : []

  const handleMFAToggle = (next: boolean) => {
    setPendingMfaEnabled(next)
    setMfaConfirmOpen(true)
  }

  const handleMfaConfirm = async () => {
    if (pendingMfaEnabled === null) return
    await toggleMFA.mutateAsync({ enabled: pendingMfaEnabled })
    setPendingMfaEnabled(null)
  }

  if (isLoading) {
    return (
      <Card className="rounded-2xl shadow-card animate-fade-in">
        <CardHeader>
          <div className="h-6 w-48 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-muted" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-12 w-full animate-pulse rounded-xl bg-muted" />
          <div className="h-12 w-full animate-pulse rounded-xl bg-muted" />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="rounded-2xl shadow-card animate-fade-in-up transition-shadow duration-200 hover:shadow-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>
            Manage your password and multi-factor authentication to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="change-password" className="flex items-center gap-2 font-medium">
                <Key className="h-4 w-4" />
                Password
              </Label>
              <p className="text-sm text-muted-foreground">
                Change your password regularly for better security.
              </p>
            </div>
            <Button
              id="change-password"
              variant="outline"
              className="rounded-full border-primary/50 hover:bg-primary/10 hover:border-primary"
              onClick={() => setChangePasswordOpen(true)}
            >
              Change password
            </Button>
          </div>

          <div className="border-t border-border pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="mfa-toggle" className="flex items-center gap-2 font-medium">
                  Multi-factor authentication
                  {enabled && (
                    <Badge
                      variant="secondary"
                      className="ml-2 rounded-full bg-primary/20 text-foreground"
                    >
                      Active
                    </Badge>
                  )}
                </Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security with MFA. When enabled, you'll need a second
                  factor to sign in.
                </p>
              </div>
              <Switch
                id="mfa-toggle"
                checked={enabled}
                onCheckedChange={handleMFAToggle}
                aria-label="Toggle MFA"
              />
            </div>
            {enabled && providers.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Enabled methods:</p>
                <ul className="space-y-1">
                  {(providers ?? []).map((id) => {
                    const meta = MFA_PROVIDERS.find((p) => p.id === id)
                    const Icon = meta?.icon ?? Smartphone
                    return (
                      <li
                        key={id}
                        className="flex items-center gap-2 text-sm text-foreground"
                      >
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        {meta?.label ?? id}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ChangePasswordModal open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />

      <ConfirmDialog
        open={mfaConfirmOpen}
        onOpenChange={(open) => {
          if (!open) setPendingMfaEnabled(null)
          setMfaConfirmOpen(open)
        }}
        title={pendingMfaEnabled ? 'Enable MFA' : 'Disable MFA'}
        description={
          pendingMfaEnabled
            ? 'You will need to complete MFA setup. Make sure you have an authenticator app or phone ready.'
            : 'Disabling MFA will make your account less secure. Are you sure?'
        }
        confirmLabel={pendingMfaEnabled ? 'Enable' : 'Disable'}
        variant={pendingMfaEnabled ? 'default' : 'destructive'}
        onConfirm={handleMfaConfirm}
        loading={toggleMFA.isPending}
      />
    </>
  )
}
