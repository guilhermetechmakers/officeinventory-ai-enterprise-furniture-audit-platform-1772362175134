import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSSOConfigs, useTestSSOConnection } from '@/hooks/use-admin'
import { ValidationErrorTooltip } from './validation-error-tooltip'
import { Loader2 } from 'lucide-react'

const ssoSchema = z.object({
  type: z.enum(['SAML', 'OIDC']),
  issuer: z.string().optional(),
  entryPoint: z.union([z.string().url(), z.literal('')]).optional(),
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  metadata: z.string().optional(),
})

type SSOFormValues = z.infer<typeof ssoSchema>

export function SSOConfigurationPanel() {
  const { data: configs = [] } = useSSOConfigs()
  const testConnection = useTestSSOConnection()
  const [testResult, setTestResult] = React.useState<{ success: boolean; message?: string } | null>(null)

  const safeConfigs = Array.isArray(configs) ? configs : []

  const form = useForm<SSOFormValues>({
    resolver: zodResolver(ssoSchema),
    defaultValues: {
      type: 'SAML',
      issuer: '',
      entryPoint: '',
      clientId: '',
      clientSecret: '',
      metadata: '',
    },
  })

  const type = form.watch('type')

  const handleTestConnection = form.handleSubmit(async (values) => {
    setTestResult(null)
    const config = {
      type: values.type,
      config: {
        issuer: values.issuer || undefined,
        entryPoint: values.entryPoint || undefined,
        clientId: values.clientId || undefined,
        clientSecret: values.clientSecret || undefined,
        metadata: values.metadata || undefined,
      },
    }
    const result = await testConnection.mutateAsync(config)
    setTestResult(result)
  })

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">SSO Configuration</h2>
        <p className="text-muted-foreground mt-1">
          Configure SAML or OIDC for single sign-on
        </p>
      </div>

      <Card className="rounded-2xl shadow-card">
        <CardHeader>
          <CardTitle>Add / Edit SSO</CardTitle>
          <CardDescription>
            Enter metadata, endpoints, and certificates. Test the connection before saving.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={type} onValueChange={(v) => form.setValue('type', v as 'SAML' | 'OIDC')}>
            <TabsList className="mb-4">
              <TabsTrigger value="SAML">SAML</TabsTrigger>
              <TabsTrigger value="OIDC">OIDC</TabsTrigger>
            </TabsList>

            <TabsContent value="SAML" className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="issuer">Issuer</Label>
                  <Input
                    id="issuer"
                    {...form.register('issuer')}
                    placeholder="https://your-app.example.com/saml"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entryPoint">IdP Entry Point URL</Label>
                  <ValidationErrorTooltip error={form.formState.errors.entryPoint?.message}>
                    <Input
                      id="entryPoint"
                      {...form.register('entryPoint')}
                      placeholder="https://idp.example.com/sso"
                    />
                  </ValidationErrorTooltip>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="metadata">Metadata XML (optional)</Label>
                <Input
                  id="metadata"
                  {...form.register('metadata')}
                  placeholder="Paste IdP metadata XML"
                  className="font-mono text-sm"
                />
              </div>
            </TabsContent>

            <TabsContent value="OIDC" className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="clientId">Client ID</Label>
                  <Input
                    id="clientId"
                    {...form.register('clientId')}
                    placeholder="your-client-id"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientSecret">Client Secret</Label>
                  <Input
                    id="clientSecret"
                    type="password"
                    {...form.register('clientSecret')}
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="metadata">Discovery URL or Metadata (optional)</Label>
                <Input
                  id="metadata"
                  {...form.register('metadata')}
                  placeholder="https://idp.example.com/.well-known/openid-configuration"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex items-center gap-4">
            <Button
              onClick={handleTestConnection}
              disabled={testConnection.isPending}
              variant="outline"
            >
              {testConnection.isPending ? (
                <Loader2 className="h-4 w-4 animate-pulse" />
              ) : (
                'Test Connection'
              )}
            </Button>
            {testResult && (
              <span
                className={
                  testResult.success
                    ? 'text-sm text-green-600 dark:text-green-400'
                    : 'text-sm text-destructive'
                }
              >
                {testResult.success ? '✓ Connection successful' : `✗ ${testResult.message ?? 'Connection failed'}`}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {safeConfigs.length > 0 && (
        <Card className="rounded-2xl shadow-card">
          <CardHeader>
            <CardTitle>Configured SSO</CardTitle>
            <CardDescription>Existing SSO configurations by tenant</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {safeConfigs.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div>
                    <span className="font-medium">{c.type}</span>
                    <span className="text-muted-foreground ml-2">
                      Tenant: {c.tenantId}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      c.status === 'configured'
                        ? 'bg-primary/20 text-primary'
                        : c.status === 'invalid'
                          ? 'bg-destructive/20 text-destructive'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {c.status}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
