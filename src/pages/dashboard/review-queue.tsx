import { Link } from 'react-router-dom'
import { AlertTriangle, Copy, User } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const queueItems = [
  { id: '1', type: 'Desk', confidence: 0.62, reason: 'low-confidence', audit: 'Building A' },
  { id: '2', type: 'Chair', confidence: 0.58, reason: 'low-confidence', audit: 'Floor 3 West' },
  { id: '3', type: 'Storage', confidence: 0.91, reason: 'exception', audit: 'Building B' },
  { id: '4', type: 'Meeting Table', confidence: 0.45, reason: 'duplicate', audit: 'Building A' },
]

export function ReviewQueuePage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Review Queue</h1>
        <p className="text-muted-foreground mt-1">
          Worklist for human-in-the-loop validation
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <span className="text-sm font-medium">Low Confidence</span>
            </div>
            <p className="text-2xl font-bold mt-2">23</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span className="text-sm font-medium">Exceptions</span>
            </div>
            <p className="text-2xl font-bold mt-2">5</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Copy className="h-5 w-5 text-info" />
              <span className="text-sm font-medium">Duplicates</span>
            </div>
            <p className="text-2xl font-bold mt-2">8</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Assigned to Me</span>
            </div>
            <p className="text-2xl font-bold mt-2">12</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Queue Items</CardTitle>
          <CardDescription>Review and validate detections</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="low-confidence">
            <TabsList>
              <TabsTrigger value="low-confidence">Low Confidence</TabsTrigger>
              <TabsTrigger value="exceptions">Exceptions</TabsTrigger>
              <TabsTrigger value="duplicates">Duplicates</TabsTrigger>
              <TabsTrigger value="assigned">Assigned to Me</TabsTrigger>
            </TabsList>
            <TabsContent value="low-confidence" className="mt-4">
              <div className="space-y-4">
                {queueItems
                  .filter((i) => i.reason === 'low-confidence')
                  .map((item) => (
                    <Link
                      key={item.id}
                      to={`/dashboard/items/${item.id}`}
                      className="flex items-center justify-between rounded-xl border border-border p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-lg bg-muted" />
                        <div>
                          <p className="font-medium">{item.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.audit} · {(item.confidence * 100).toFixed(0)}% confidence
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Confirm
                        </Button>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </Link>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="exceptions" className="mt-4">
              <p className="text-muted-foreground py-8 text-center">
                No exception items
              </p>
            </TabsContent>
            <TabsContent value="duplicates" className="mt-4">
              <p className="text-muted-foreground py-8 text-center">
                No duplicate groups
              </p>
            </TabsContent>
            <TabsContent value="assigned" className="mt-4">
              <p className="text-muted-foreground py-8 text-center">
                No items assigned to you
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
