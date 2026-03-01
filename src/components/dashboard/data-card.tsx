import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface DataCardProps {
  title: string
  description?: string
  metadata?: string
  children: ReactNode
  className?: string
}

/** Generic card for section blocks with title, metadata, and content */
export function DataCard({ title, description, metadata, children, className }: DataCardProps) {
  return (
    <Card className={cn('transition-all duration-300 hover:shadow-elevated', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {description && (
            <CardDescription className="mt-0.5">{description}</CardDescription>
          )}
        </div>
        {metadata && (
          <span className="text-xs text-muted-foreground">{metadata}</span>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
