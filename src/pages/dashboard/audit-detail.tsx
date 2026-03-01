/**
 * Audit Detail - Placeholder for full audit detail view
 * Navigate from AuditCard "Open" action
 */

import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function AuditDetailPage() {
  const { auditId } = useParams<{ auditId: string }>()

  return (
    <div className="space-y-6 animate-fade-in">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/dashboard/audits">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Audits
        </Link>
      </Button>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 mb-4">
            <ClipboardList className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold">Audit {auditId ?? 'Detail'}</h2>
          <p className="text-muted-foreground mt-2 text-center max-w-md">
            Full audit detail view with items, review queue, and reporting will be available when the audit workflow is fully wired.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/dashboard/audits">Back to Audit List</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
