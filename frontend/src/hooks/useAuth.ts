import { useState, useCallback } from 'react'
import { getToken, setToken as saveToken, clearToken, decodeToken, isTokenValid } from '@/lib/auth'
import type { User } from '@/types'

function tokenToUser(token: string): User | null {
  const d = decodeToken(token)
  if (!d) return null
  return { id: d.sub, email: d.email, full_name: d.full_name, role: d.role }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const t = getToken()
    return t && isTokenValid(t) ? tokenToUser(t) : null
  })

  const login = useCallback((token: string) => {
    saveToken(token)
    setUser(tokenToUser(token))
  }, [])

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
  }, [])

  return {
    user,
    role: user?.role ?? null,
    isLoggedIn: !!user,
    login,
    logout,
  }
}
