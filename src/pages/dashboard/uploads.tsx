import { useState } from 'react'
import { CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const batches = [
  { id: '1', site: 'Building A', count: 24, status: 'completed', time: '2 min ago' },
  { id: '2', site: 'Building B', count: 18, status: 'processing', time: '15 min ago' },
  { id: '3', site: 'Floor 3 West', count: 12, status: 'pending', time: '1 hour ago' },
  { id: '4', site: 'Building A', count: 8, status: 'error', time: '2 hours ago' },
]

const statusConfig = {
  completed: { icon: CheckCircle, variant: 'success' as const, label: 'Completed' },
  processing: { icon: Clock, variant: 'info' as const, label: 'Processing' },
  pending: { icon: Clock, variant: 'warning' as const, label: 'Pending' },
  error: { icon: AlertCircle, variant: 'destructive' as const, label: 'Error' },
}

export function UploadsPage() {
  const [search, setSearch] = useState('')

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Bulk Upload Status</h1>
        <p className="text-muted-foreground mt-1">
          Monitor status of uploaded batches and inference jobs
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Batches</CardTitle>
              <CardDescription>View and manage upload batches</CardDescription>
            </div>
            <Input
              placeholder="Search batches..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm rounded-full"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="errors">Errors</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-0">
              <div className="space-y-4">
                {batches.map((batch) => {
                  const config = statusConfig[batch.status as keyof typeof statusConfig]
                  const Icon = config?.icon ?? Clock
                  return (
                    <div
                      key={batch.id}
                      className="flex items-center justify-between rounded-xl border border-border p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{batch.site}</p>
                          <p className="text-sm text-muted-foreground">
                            {batch.count} images · {batch.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={config?.variant ?? 'secondary'}>
                          {config?.label ?? batch.status}
                        </Badge>
                        {batch.status === 'error' && (
                          <Button variant="ghost" size="icon-sm">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>
            <TabsContent value="processing" className="mt-0">
              <p className="text-muted-foreground py-8 text-center">
                No batches currently processing
              </p>
            </TabsContent>
            <TabsContent value="completed" className="mt-0">
              <div className="space-y-4">
                {batches.filter((b) => b.status === 'completed').map((batch) => (
                  <div
                    key={batch.id}
                    className="flex items-center justify-between rounded-xl border border-border p-4"
                  >
                    <div>
                      <p className="font-medium">{batch.site}</p>
                      <p className="text-sm text-muted-foreground">
                        {batch.count} images · {batch.time}
                      </p>
                    </div>
                    <Badge variant="success">Completed</Badge>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="errors" className="mt-0">
              <div className="space-y-4">
                {batches.filter((b) => b.status === 'error').map((batch) => (
                  <div
                    key={batch.id}
                    className="flex items-center justify-between rounded-xl border border-border p-4"
                  >
                    <div>
                      <p className="font-medium">{batch.site}</p>
                      <p className="text-sm text-muted-foreground">
                        {batch.count} images · {batch.time}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="destructive">Error</Badge>
                      <Button variant="outline" size="sm">
                        Retry
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
