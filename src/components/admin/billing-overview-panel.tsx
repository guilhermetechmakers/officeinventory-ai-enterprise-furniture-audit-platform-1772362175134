import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useBillingOverview } from '@/hooks/use-admin'
import { Download, CreditCard, Calendar } from 'lucide-react'

export function BillingOverviewPanel() {
  const { data, isLoading } = useBillingOverview()
  const invoices = Array.isArray(data?.invoices) ? data.invoices : []
  const tier = data?.subscriptionTier ?? '—'
  const credits = data?.usageCredits ?? 0
  const limit = data?.creditsLimit ?? 0
  const renewalDate = data?.renewalDate ?? '—'

  const usagePercent = limit > 0 ? Math.min(100, (credits / limit) * 100) : 0

  const handleDownload = (id: string) => {
    toast.success(`Invoice ${id} download started`)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Billing Overview</h2>
        <p className="text-muted-foreground mt-1">
          Subscription, usage credits, and invoices
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="rounded-2xl shadow-card">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Subscription Tier</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{isLoading ? '—' : tier}</p>
            <Button variant="outline" size="sm" className="mt-2">
              Upgrade
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Usage Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {isLoading ? '—' : `${credits.toLocaleString()} / ${limit.toLocaleString()}`}
            </p>
            <Progress value={usagePercent} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-card">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Renewal Date</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {isLoading ? '—' : renewalDate}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl shadow-card">
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>Download past invoices</CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">
              No invoices yet
            </p>
          ) : (
            <ul className="space-y-2">
              {invoices.map((inv) => (
                <li
                  key={inv.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div>
                    <span className="font-medium">
                      {inv.periodStart} – {inv.periodEnd}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      ${inv.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        inv.status === 'paid'
                          ? 'bg-primary/20 text-primary'
                          : inv.status === 'overdue'
                            ? 'bg-destructive/20 text-destructive'
                            : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {inv.status}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(inv.id)}
                      aria-label={`Download invoice ${inv.id}`}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
