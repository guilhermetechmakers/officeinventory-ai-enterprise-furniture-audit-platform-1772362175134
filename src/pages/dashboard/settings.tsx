import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export function SettingsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Settings & Preferences</h1>
        <p className="text-muted-foreground mt-1">
          Tenant configuration for inference and exports
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inference thresholds</CardTitle>
          <CardDescription>Configure confidence thresholds for auto-accept</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Minimum confidence for auto-accept</Label>
            <Input type="number" defaultValue="0.85" step="0.05" min="0" max="1" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-queue low confidence</Label>
              <p className="text-sm text-muted-foreground">Items below threshold go to review queue</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Default export schema</CardTitle>
          <CardDescription>Fields included in export templates</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Configure in export builder. Procurement-ready schema defaults available.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Review SLA</CardTitle>
          <CardDescription>Target turnaround for review queue items</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Target hours</Label>
            <Input type="number" defaultValue="24" />
          </div>
        </CardContent>
      </Card>

      <Button className="rounded-full">Save changes</Button>
    </div>
  )
}
