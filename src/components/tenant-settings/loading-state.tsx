import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface LoadingStateProps {
  className?: string
  lines?: number
}

export function LoadingState({ className, lines = 4 }: LoadingStateProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {(Array.from({ length: lines }) as number[]).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-xl" />
      ))}
    </div>
  )
}
