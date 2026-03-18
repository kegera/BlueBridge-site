import { createContext, useContext, type ReactNode } from 'react'
import { useCart } from '@/hooks/useCart'

type CartCtx = ReturnType<typeof useCart>
const Ctx = createContext<CartCtx | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useCart()
  return <Ctx.Provider value={cart}>{children}</Ctx.Provider>
}

export function useCartCtx() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCartCtx must be inside CartProvider')
  return ctx
}
