import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Countdown timer hook that emits tick events every second.
 * Used for resend verification cooldown.
 *
 * @param initialSeconds - Starting countdown value
 * @param onTick - Called every second with remaining seconds
 * @param onComplete - Called when countdown reaches 0
 * @returns { remainingSeconds, start, stop, isActive }
 */
export function useCountdownTimer(
  initialSeconds: number,
  onTick?: (remaining: number) => void,
  onComplete?: () => void
) {
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onTickRef = useRef(onTick)
  const onCompleteRef = useRef(onComplete)

  onTickRef.current = onTick
  onCompleteRef.current = onComplete

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setRemainingSeconds(0)
  }, [])

  const start = useCallback(
    (seconds: number = initialSeconds) => {
      stop()
      setRemainingSeconds(seconds)
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          const next = Math.max(0, prev - 1)
          onTickRef.current?.(next)
          if (next === 0) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
            onCompleteRef.current?.()
          }
          return next
        })
      }, 1000)
    },
    [initialSeconds, stop]
  )

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return {
    remainingSeconds,
    start,
    stop,
    isActive: remainingSeconds > 0,
  }
}
