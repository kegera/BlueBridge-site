import { createContext, useContext, type ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'

type AuthCtx = ReturnType<typeof useAuth>
const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()
  return <Ctx.Provider value={auth}>{children}</Ctx.Provider>
}

export function useAuthCtx() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuthCtx must be inside AuthProvider')
  return ctx
}
