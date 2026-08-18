import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="py-20 text-center opacity-60">Loading…</div>
  }

  if (!user) {
    return <Navigate to="/developers/login" replace />
  }

  return <>{children}</>
}
