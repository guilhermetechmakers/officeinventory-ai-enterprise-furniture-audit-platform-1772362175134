import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { StatusBadge } from './status-badge'
import type { WebhookTestResult } from '@/types/tenant-settings'

export interface TestEndpointModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  webhookName: string
  result: WebhookTestResult | null
  isLoading: boolean
  onTest: () => void
}

export function TestEndpointModal({
  open,
  onOpenChange,
  webhookName,
  result,
  isLoading,
  onTest,
}: TestEndpointModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Test webhook endpoint</DialogTitle>
          <DialogDescription>
            Send a test payload to &quot;{webhookName}&quot; and verify the response.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {result && (
            <div className="rounded-xl border border-border p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Result:</span>
                <StatusBadge
                  status={result.success ? 'success' : 'failure'}
                  label={result.success ? 'Success' : 'Failed'}
                />
              </div>
              {result.statusCode != null && (
                <p className="text-sm text-muted-foreground">Status: {result.statusCode}</p>
              )}
              {result.durationMs != null && (
                <p className="text-sm text-muted-foreground">Duration: {result.durationMs}ms</p>
              )}
              {result.message && (
                <p className="text-sm text-muted-foreground">{result.message}</p>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={onTest} disabled={isLoading}>
            {isLoading ? 'Testing…' : 'Run test'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
