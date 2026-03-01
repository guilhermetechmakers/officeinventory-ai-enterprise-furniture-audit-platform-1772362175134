import { useCallback } from 'react'
import { toast } from 'sonner'

export function useNotification() {
  const success = useCallback((message: string) => {
    toast.success(message)
  }, [])

  const error = useCallback((message: string) => {
    toast.error(message)
  }, [])

  const loading = useCallback((message: string, id?: string) => {
    return toast.loading(message, { id })
  }, [])

  const dismiss = useCallback((id?: string) => {
    toast.dismiss(id)
  }, [])

  return { success, error, loading, dismiss }
}
