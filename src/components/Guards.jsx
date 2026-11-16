import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loader2 } from 'lucide-react'

export function Loading({ label = 'A carregar' }) {
  return (
    <div className="flex items-center justify-center gap-2 py-24 text-fg-2">
      <Loader2 className="animate-spin" size={20} /> {label}
    </div>
  )
}

export function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  const loc = useLocation()
  if (loading) return <Loading />
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />
  return children
}

export function RequireAdmin({ children }) {
  const { user, isAdmin, loading } = useAuth()
  const loc = useLocation()
  if (loading) return <Loading />
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />
  if (!isAdmin) return <Navigate to="/conta" replace />
  return children
}
