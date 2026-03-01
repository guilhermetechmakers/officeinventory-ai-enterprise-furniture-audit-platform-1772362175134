import { FileText, Download, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const templates = [
  { id: '1', name: 'Inventory List', description: 'Full item list with attributes' },
  { id: '2', name: 'Condition Summary', description: 'Condition distribution by type' },
  { id: '3', name: 'Exceptions Report', description: 'Flagged items and exceptions' },
]

const exportHistory = [
  { id: '1', name: 'Inventory List Q1', format: 'CSV', date: 'Mar 1, 2025' },
  { id: '2', name: 'Condition Summary', format: 'PDF', date: 'Feb 28, 2025' },
]

export function ReportsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Reports & Exports</h1>
        <p className="text-muted-foreground mt-1">
          Build ad hoc and scheduled reports (CSV/PDF)
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Export builder</CardTitle>
            <CardDescription>Select template and configure export</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="templates">
              <TabsList>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              </TabsList>
              <TabsContent value="templates" className="mt-4 space-y-4">
                {templates.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between rounded-xl border border-border p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{t.name}</p>
                        <p className="text-sm text-muted-foreground">{t.description}</p>
                      </div>
                    </div>
                    <Button size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="scheduled" className="mt-4">
                <p className="text-muted-foreground py-8 text-center">
                  No scheduled exports
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export history</CardTitle>
            <CardDescription>Recent exports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {exportHistory.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div>
                    <p className="font-medium text-sm">{e.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {e.date} · {e.format}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon-sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
