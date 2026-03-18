import { Minus, Plus, X } from 'lucide-react'
import { useCartCtx } from '@/contexts/CartContext'
import { formatKES } from '@/lib/utils'
import type { CartItem as ICartItem } from '@/types'

export function CartItem({ item }: { item: ICartItem }) {
  const { removeItem, incrementItem, decrementItem } = useCartCtx()
  return (
    <div className="flex items-start gap-3 p-4 border border-bborder rounded mb-3 bg-white/80">
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-navy text-sm truncate">{item.title}</div>
        <div className="text-xs text-muted">{item.category} · {item.format}</div>
        <div className="text-sm font-bold text-primary mt-1">{formatKES(item.price * item.qty)}</div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <button onClick={() => removeItem(item.id)} className="text-muted hover:text-destructive transition-colors"><X size={13} /></button>
        <div className="flex items-center gap-1.5 border border-bborder rounded-sm">
          <button onClick={() => decrementItem(item.id)} className="w-6 h-6 flex items-center justify-center text-muted hover:text-navy transition-colors"><Minus size={11} /></button>
          <span className="w-6 text-center text-sm font-semibold text-navy">{item.qty}</span>
          <button onClick={() => incrementItem(item.id)} className="w-6 h-6 flex items-center justify-center text-muted hover:text-navy transition-colors"><Plus size={11} /></button>
        </div>
      </div>
    </div>
  )
}
