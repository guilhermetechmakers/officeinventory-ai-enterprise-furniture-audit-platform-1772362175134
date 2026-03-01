import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'

interface ProgressBarProps {
  value: number
  showLabel?: boolean
  className?: string
}

export function ProgressBar({ value, showLabel = true, className }: ProgressBarProps) {
  const safeValue = Math.min(100, Math.max(0, Number(value) ?? 0))

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Progress value={safeValue} className="h-2 flex-1" />
      {showLabel && (
        <span className="text-xs font-medium text-muted-foreground tabular-nums min-w-[2.5rem]">
          {Math.round(safeValue)}%
        </span>
      )}
    </div>
  )
}
