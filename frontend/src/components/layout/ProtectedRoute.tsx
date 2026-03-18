import { Navigate } from 'react-router-dom'
import { useAuthCtx } from '@/contexts/AuthContext'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  allowedRole: 'student' | 'instructor'
}

export function ProtectedRoute({ children, allowedRole }: Props) {
  const { isLoggedIn, role } = useAuthCtx()
  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (role !== allowedRole) return <Navigate to={role === 'instructor' ? '/instructor' : '/student'} replace />
  return <>{children}</>
}
