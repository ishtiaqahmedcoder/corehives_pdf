import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  TOKEN_STORAGE_KEY,
  fetchMe,
  loginDeveloper,
  logoutDeveloper,
  registerDeveloper,
  type DeveloperUser,
} from '@/lib/developerApi'

interface AuthContextValue {
  user: DeveloperUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: DeveloperUser) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DeveloperUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (!token) {
      setLoading(false)
      return
    }
    fetchMe()
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_STORAGE_KEY))
      .finally(() => setLoading(false))
  }, [])

  async function login(email: string, password: string) {
    const { user, token } = await loginDeveloper(email, password)
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
    setUser(user)
  }

  async function register(name: string, email: string, password: string) {
    const { user, token } = await registerDeveloper(name, email, password)
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
    setUser(user)
  }

  async function logout() {
    try {
      await logoutDeveloper()
    } finally {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      setUser(null)
    }
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
