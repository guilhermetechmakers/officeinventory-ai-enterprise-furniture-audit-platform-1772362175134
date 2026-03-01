import { Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useSSO } from '@/hooks/use-sso'

interface SSOAuthCardProps {
  returnUrl?: string
}

export function SSOAuthCard({ returnUrl }: SSOAuthCardProps) {
  const { providers, isLoading, error, initiateSSO } = useSSO(returnUrl)
  const items = providers ?? []

  if (items.length === 0 && !error) return null

  return (
    <Card className="rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-elevated">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <Shield className="h-5 w-5 text-primary" />
          Sign in with SSO
        </CardTitle>
        <CardDescription>
          Use your organization&apos;s identity provider (SAML/OIDC)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </div>
        )}
        {isLoading ? (
          <div className="flex flex-col gap-2">
            <div className="h-11 rounded-full bg-muted/50 animate-pulse" />
            <div className="h-11 rounded-full bg-muted/50 animate-pulse" />
          </div>
        ) : (
          <div className="grid gap-2">
            {(items ?? []).map((provider) => (
              <Button
                key={provider.id}
                variant="secondary"
                className="w-full rounded-full transition-all duration-200 hover:scale-[1.02] hover:shadow-elevated"
                onClick={() => initiateSSO(provider.id)}
                disabled={!provider.authorizeUrl}
              >
                {provider.name} ({provider.type})
              </Button>
            ))}
          </div>
        )}
        {items.length === 0 && !isLoading && (
          <p className="text-sm text-muted-foreground">
            SSO providers can be configured in the admin panel.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
