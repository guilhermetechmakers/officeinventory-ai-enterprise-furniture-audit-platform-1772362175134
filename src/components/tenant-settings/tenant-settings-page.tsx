import { Settings2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExportSchemaEditor } from './export-schema-editor'
import { InferenceSettingsPanel } from './inference-settings-panel'
import { ReviewSLAPanel } from './review-sla-panel'
import { StorageLifecyclePanel } from './storage-lifecycle-panel'
import { WebhooksPanel } from './webhooks-panel'
const SECTIONS = [
  { id: 'export', label: 'Export Schema' },
  { id: 'inference', label: 'Inference' },
  { id: 'review-sla', label: 'Review SLA' },
  { id: 'storage', label: 'Storage' },
  { id: 'webhooks', label: 'Webhooks' },
] as const

export function TenantSettingsPage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings2 className="h-7 w-7" />
          Settings & Preferences (Tenant)
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure global, tenant-scoped policies and defaults for audits, exports, inference, and integrations.
        </p>
      </div>

      <Tabs defaultValue="export" className="w-full">
        <TabsList className="mb-6 flex flex-wrap gap-2 rounded-full bg-[rgb(var(--primary-foreground))] p-1.5 text-white">
          {SECTIONS.map((s) => (
            <TabsTrigger
              key={s.id}
              value={s.id}
              className="rounded-full px-4 py-2 text-sm text-white/80 hover:text-white data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:hover:text-primary-foreground"
            >
              {s.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="export">
          <ExportSchemaEditor />
        </TabsContent>
        <TabsContent value="inference">
          <InferenceSettingsPanel />
        </TabsContent>
        <TabsContent value="review-sla">
          <ReviewSLAPanel />
        </TabsContent>
        <TabsContent value="storage">
          <StorageLifecyclePanel />
        </TabsContent>
        <TabsContent value="webhooks">
          <WebhooksPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
