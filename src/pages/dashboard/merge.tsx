import { GitMerge } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function MergePage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Merge & Duplicate Resolution</h1>
        <p className="text-muted-foreground mt-1">
          Resolve duplicate detections into canonical records
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-24">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 mb-4">
            <GitMerge className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No duplicate groups</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Duplicate candidates will appear here when the system detects similar items. 
            Use the side-by-side viewer to merge attributes and create canonical records.
          </p>
          <Button variant="outline" disabled>
            Run duplicate scan
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
