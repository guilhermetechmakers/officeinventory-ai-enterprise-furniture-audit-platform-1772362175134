import { useState } from 'react'
import { toast } from 'sonner'
import { Link2, Unlink, Monitor, MapPin, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { useLinkedSSO, useUnlinkSSO, useSessions, useRevokeSession } from '@/hooks/use-user-profile'
import { cn } from '@/lib/utils'
import type { SSOAccount, Session } from '@/types/user-profile'

const PROVIDER_ICONS: Record<string, string> = {
  google: 'G',
  microsoft: 'M',
  okta: 'O',
  github: 'GH',
}

function formatRelativeTime(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

function LinkedSSOCard({ account }: { account: SSOAccount }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const unlink = useUnlinkSSO()

  const initial = PROVIDER_ICONS[account.provider] ?? account.displayName?.charAt(0) ?? '?'

  return (
    <>
      <div
        className={cn(
          'flex items-center justify-between rounded-xl border border-border p-4',
          'transition-all duration-200 hover:shadow-card'
        )}
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 rounded-xl">
            <AvatarImage src={account.avatarUrl} alt={account.displayName} />
            <AvatarFallback className="rounded-xl bg-primary/20 text-primary-foreground">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{account.displayName}</p>
            <p className="text-sm text-muted-foreground">
              Linked {formatRelativeTime(account.linkedAt)}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => setShowConfirm(true)}
          aria-label={`Unlink ${account.displayName}`}
        >
          <Unlink className="h-4 w-4" />
          Unlink
        </Button>
      </div>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Unlink account"
        description={`Are you sure you want to unlink ${account.displayName}? You may need to use another sign-in method.`}
        confirmLabel="Unlink"
        variant="destructive"
        onConfirm={async () => {
          await unlink.mutateAsync({ provider: account.provider })
        }}
        loading={unlink.isPending}
      />
    </>
  )
}

function SessionRow({ session }: { session: Session }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const revoke = useRevokeSession()

  return (
    <>
      <div
        className={cn(
          'flex flex-col gap-2 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between',
          'transition-all duration-200 hover:shadow-card'
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
            <Monitor className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">{session.device}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {session.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatRelativeTime(session.lastActive)}
              </span>
              {session.ipAddress && (
                <span className="font-mono text-xs">{session.ipAddress}</span>
              )}
            </div>
          </div>
        </div>
        {session.isActive ? (
          <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
            Current session
          </span>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setShowConfirm(true)}
            aria-label={`Revoke session on ${session.device}`}
          >
            Revoke
          </Button>
        )}
      </div>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Revoke session"
        description={`Revoke access from ${session.device}? This will sign out that device.`}
        confirmLabel="Revoke"
        variant="destructive"
        onConfirm={async () => {
          await revoke.mutateAsync({ sessionId: session.id })
        }}
        loading={revoke.isPending}
      />
    </>
  )
}

export function ConnectedAccounts() {
  const { data: ssoAccounts = [], isLoading: ssoLoading } = useLinkedSSO()
  const { data: sessions = [], isLoading: sessionsLoading } = useSessions()

  const accounts = Array.isArray(ssoAccounts) ? ssoAccounts : []
  const sessionList = Array.isArray(sessions) ? sessions : []

  const handleLinkSSO = () => {
    // In a real app, this would trigger OAuth/SAML flow
    // For MVP, show a toast that it's not yet connected
    toast.info('SSO linking will be available when backend is configured')
  }

  if (ssoLoading && sessionsLoading) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <div className="h-6 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded bg-muted" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-24 animate-pulse rounded-xl bg-muted" />
          <div className="h-24 animate-pulse rounded-xl bg-muted" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="animate-fade-in transition-all duration-300 hover:shadow-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Connected accounts
          </CardTitle>
          <CardDescription>
            Manage your linked SSO providers and sign-in methods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {accounts.map((account) => (
            <LinkedSSOCard key={account.provider} account={account} />
          ))}
          <Button
            variant="outline"
            className="w-full rounded-full"
            onClick={handleLinkSSO}
          >
            <Link2 className="h-4 w-4" />
            Link new provider
          </Button>
        </CardContent>
      </Card>

      <Card className="animate-fade-in transition-all duration-300 hover:shadow-elevated">
        <CardHeader>
          <CardTitle>Active sessions</CardTitle>
          <CardDescription>
            Devices where you're currently signed in. Revoke any session you don't recognize.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessionList.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center">
              <Monitor className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 font-medium">No active sessions</p>
              <p className="text-sm text-muted-foreground">
                When you sign in on a device, it will appear here.
              </p>
            </div>
          ) : (
            sessionList.map((session) => (
              <SessionRow key={session.id} session={session} />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
