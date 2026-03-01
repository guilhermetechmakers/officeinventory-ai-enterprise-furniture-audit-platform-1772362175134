import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useHealthOverview } from '@/hooks/use-admin'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'
import { Activity, HardDrive, AlertTriangle } from 'lucide-react'

const metricLabels: Record<string, string> = {
  queueDepth: 'Queue Depth',
  storageUsageGB: 'Storage (GB)',
  errorRate: 'Error Rate (%)',
}

export function SystemHealthPanel() {
  const { data, isLoading } = useHealthOverview()
  const metrics = Array.isArray(data?.metrics) ? data.metrics : []
  const alerts = Array.isArray(data?.alerts) ? data.alerts : []

  const queueMetric = metrics.find((m) => m.metricName === 'queueDepth')
  const storageMetric = metrics.find((m) => m.metricName === 'storageUsageGB')
  const errorMetric = metrics.find((m) => m.metricName === 'errorRate')

  const timeSeriesData = React.useMemo(() => {
    return metrics.map((m) => ({
      name: metricLabels[m.metricName] ?? m.metricName,
      value: m.value,
      timestamp: m.timestamp,
    }))
  }, [metrics])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">System Health</h2>
        <p className="text-muted-foreground mt-1">
          Monitor queue depth, storage, and error rates
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <Card className="rounded-2xl shadow-card">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Queue Depth</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-center">
              {isLoading ? '—' : queueMetric?.value ?? 0}
            </p>
            <p className="text-sm text-muted-foreground text-center mt-1">
              items in queue
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-card">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Storage Usage</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-center">
              {isLoading ? '—' : storageMetric?.value ?? 0}
            </p>
            <p className="text-sm text-muted-foreground text-center mt-1">
              GB used
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-card">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Error Rate</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-center">
              {isLoading ? '—' : ((errorMetric?.value ?? 0) * 100).toFixed(2)}%
            </p>
            <p className="text-sm text-muted-foreground text-center mt-1">
              last 24h
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl shadow-card">
        <CardHeader>
          <CardTitle>Metrics Overview</CardTitle>
          <CardDescription>Current system metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="rgb(var(--primary))"
                  fill="rgb(var(--primary) / 0.2)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {alerts.length > 0 && (
        <Card className="rounded-2xl shadow-card border-warning/50">
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
            <CardDescription>Actionable items requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {alerts.map((a) => (
                <li
                  key={a.id}
                  className={`flex items-center justify-between rounded-lg border p-4 ${
                    a.severity === 'error'
                      ? 'border-destructive bg-destructive/5'
                      : a.severity === 'warning'
                        ? 'border-warning bg-warning/5'
                        : 'border-info bg-info/5'
                  }`}
                >
                  <span>{a.message}</span>
                  <Button variant="outline" size="sm">
                    Acknowledge
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
