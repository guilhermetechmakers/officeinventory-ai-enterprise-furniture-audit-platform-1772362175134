import { Link } from 'react-router-dom'
import { Plus, ClipboardList, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const audits = [
  { id: '1', name: 'Building A - Full Inventory', site: 'Building A', items: 847, status: 'complete', date: 'Mar 1, 2025' },
  { id: '2', name: 'Floor 3 West Wing', site: 'Building B', items: 234, status: 'in-progress', date: 'Feb 28, 2025' },
  { id: '3', name: 'Executive Suites', site: 'Building A', items: 56, status: 'draft', date: 'Feb 27, 2025' },
]

export function AuditsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Audits</h1>
          <p className="text-muted-foreground mt-1">
            Manage audits across hierarchy
          </p>
        </div>
        <Button className="rounded-full">
          <Plus className="h-4 w-4 mr-2" />
          Create audit
        </Button>
      </div>

      <div className="grid gap-4">
        {audits.map((audit) => (
          <Link key={audit.id} to={`/dashboard/audits/${audit.id}`}>
            <Card className="group cursor-pointer transition-all duration-300 hover:shadow-elevated hover:border-primary/30">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                    <ClipboardList className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{audit.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {audit.site} · {audit.items} items
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant={
                      audit.status === 'complete'
                        ? 'success'
                        : audit.status === 'in-progress'
                        ? 'info'
                        : 'secondary'
                    }
                  >
                    {audit.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{audit.date}</p>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
