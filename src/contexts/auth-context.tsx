import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { User } from '@/types/auth'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthContextValue extends AuthState {
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'officeinventory_user'

function loadStoredUser(): User | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as User
    return parsed?.id ? parsed : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(loadStoredUser)
  const [isLoading, setLoading] = useState(false)

  const setUser = useCallback((u: User | null) => {
    setUserState(u)
    if (u) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    } else {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const signOut = useCallback(() => {
    setUserState(null)
    sessionStorage.removeItem(STORAGE_KEY)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      setUser,
      setLoading,
      signOut,
    }),
    [user, isLoading, setUser, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}
