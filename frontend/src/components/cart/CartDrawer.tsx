import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Trash2 } from 'lucide-react'
import { useCartCtx } from '@/contexts/CartContext'
import { CartItem } from './CartItem'
import { MpesaModal } from './MpesaModal'
import { Button } from '@/components/ui/button'
import { formatKES } from '@/lib/utils'
import { CONTACT } from '@/lib/constants'
import { useState } from 'react'

interface Props { open: boolean; onClose: () => void }

export function CartDrawer({ open, onClose }: Props) {
  const { items, clearCart, total, count } = useCartCtx()
  const [mpesaOpen, setMpesaOpen] = useState(false)
  const [note, setNote] = useState('')

  const checkoutWhatsApp = () => {
    if (!items.length) return
    const lines = items.map(i => `• ${i.title} (x${i.qty}) — ${formatKES(i.price * i.qty)}`)
    const msg = ['Hello BlueBridge! 👋 I\'d like to order:', '', ...lines, '', `Subtotal: ${formatKES(total)}`, ...(note.trim() ? ['', `Note: ${note.trim()}`] : []), '', 'Please confirm availability and payment. Thank you!'].join('\n')
    window.open(`https://wa.me/${CONTACT.whatsappWaMe}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer')
    onClose()
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-[400] bg-navy/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
            <motion.aside className="fixed top-0 right-0 h-full w-[min(92%,420px)] bg-surface z-[401] flex flex-col shadow-lg rounded-l-lg"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 260 }}>
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-bborder">
                <h2 className="font-heading font-bold text-navy flex items-center gap-2"><ShoppingCart size={18} /> Shopping Cart <span className="text-sm text-muted font-normal">{count} item{count !== 1 ? 's' : ''}</span></h2>
                <div className="flex gap-2">
                  {items.length > 0 && <button onClick={clearCart} className="text-xs text-muted flex items-center gap-1 hover:text-destructive transition-colors"><Trash2 size={13} /> Clear</button>}
                  <button onClick={onClose} className="p-2 rounded-sm border border-bborder hover:bg-accent transition-colors"><X size={14} /></button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-muted">
                    <ShoppingCart size={52} className="opacity-20" />
                    <p className="text-sm text-center">Your cart is empty.<br />Browse materials and add something.</p>
                    <Button size="sm" variant="outline" onClick={onClose}>Browse Shop</Button>
                  </div>
                ) : (
                  <>
                    {items.map(item => <CartItem key={item.id} item={item} />)}
                    <div className="mt-4">
                      <label className="text-xs font-semibold text-navy mb-1 block">Order Note (optional)</label>
                      <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Any questions or special requests..." className="w-full text-sm rounded border border-bborder bg-surface px-3 py-2 resize-none h-20 focus:outline-none focus:border-primary" />
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="px-6 py-5 border-t border-bborder flex flex-col gap-3">
                  <div className="flex justify-between font-semibold text-navy"><span>Subtotal</span><span>{formatKES(total)}</span></div>
                  <Button className="w-full justify-center gap-2" onClick={() => setMpesaOpen(true)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 12l3 3 5-6"/></svg>
                    Pay with M-Pesa
                  </Button>
                  <Button variant="outline" className="w-full justify-center gap-2" onClick={checkoutWhatsApp}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                    Order via WhatsApp
                  </Button>
                  <p className="text-xs text-muted text-center">Pay instantly via M-Pesa or confirm on WhatsApp.</p>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <MpesaModal open={mpesaOpen} onClose={() => setMpesaOpen(false)} onSuccess={() => { setMpesaOpen(false); onClose() }} />
    </>
  )
}
