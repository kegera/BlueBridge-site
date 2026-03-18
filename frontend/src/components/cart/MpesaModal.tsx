import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useCartCtx } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatKES } from '@/lib/utils'

interface Props { open: boolean; onClose: () => void; onSuccess: () => void }

type Status = 'idle' | 'sending' | 'pending' | 'success' | 'failed'

export function MpesaModal({ open, onClose, onSuccess }: Props) {
  const { items, total, clearCart } = useCartCtx()
  const [phone, setPhone] = useState('')
  const [phoneErr, setPhoneErr] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [statusMsg, setStatusMsg] = useState('')
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => { if (!open) { clearPoll(); setStatus('idle'); setPhone(''); setPhoneErr('') } }, [open])

  const clearPoll = () => { if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null } }

  const handleSubmit = async () => {
    const clean = phone.replace(/\D/g, '')
    if (!/^(07|2547|01|2541)\d{7,8}$/.test(clean)) { setPhoneErr('Enter a valid Kenyan number (e.g. 0712345678)'); return }
    setPhoneErr(''); setStatus('sending'); setStatusMsg('Sending payment request…')
    try {
      const res = await fetch('/api/mpesa/stkpush', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone: clean, amount: total, description: 'BlueBridge' }) })
      const data = await res.json()
      if (data.ResponseCode === '0' || data.CheckoutRequestID) {
        const cid = data.CheckoutRequestID
        setStatus('pending'); setStatusMsg('Check your phone and enter your M-Pesa PIN…')
        let attempts = 0
        pollRef.current = setInterval(async () => {
          attempts++; if (attempts > 30) { clearPoll(); setStatus('failed'); setStatusMsg('Payment timed out. Please try again.'); return }
          try {
            const r = await fetch(`/api/mpesa/status/${cid}`)
            const s = await r.json()
            if (s.status === 'success') { clearPoll(); setStatus('success'); setStatusMsg('Payment confirmed!'); clearCart(); setTimeout(onSuccess, 2000) }
            else if (s.status === 'failed') { clearPoll(); setStatus('failed'); setStatusMsg(s.resultDesc || 'Payment failed. Try again.') }
          } catch {}
        }, 3000)
      } else { setStatus('failed'); setStatusMsg(data.errorMessage || 'Could not initiate payment.') }
    } catch { setStatus('failed'); setStatusMsg('Network error. Is the server running?') }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[500] flex items-center justify-center bg-navy/45 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={e => e.target === e.currentTarget && onClose()}>
          <motion.div className="w-[min(94%,420px)] bg-surface rounded-lg shadow-lg border border-bborder overflow-hidden"
            initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} transition={{ type: 'spring', damping: 28 }}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-bborder">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-sm bg-green-500 flex items-center justify-center"><CheckCircle size={18} className="text-white" /></div>
                <span className="font-heading font-bold text-navy">Pay with M-Pesa</span>
              </div>
              <button onClick={onClose} className="p-2 rounded-sm border border-bborder hover:bg-accent transition-colors"><X size={14} /></button>
            </div>
            {/* Body */}
            <div className="p-5 flex flex-col gap-4">
              {/* Summary */}
              <div className="bg-bbg rounded border border-bborder p-3.5 text-sm">
                {items.map(i => <div key={i.id} className="flex justify-between text-muted mb-1"><span>{i.title} ×{i.qty}</span><span>{formatKES(i.price * i.qty)}</span></div>)}
                <div className="flex justify-between font-bold text-navy pt-2 mt-2 border-t border-bborder"><span>Total</span><span>{formatKES(total)}</span></div>
              </div>
              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="mpesa-phone">M-Pesa Phone Number <span className="text-destructive">*</span></Label>
                <Input id="mpesa-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="07XXXXXXXX or 2547XXXXXXXX" className={phoneErr ? 'border-destructive' : ''} />
                {phoneErr && <p className="text-xs text-destructive">{phoneErr}</p>}
              </div>
              {/* Status */}
              {status !== 'idle' && (
                <div className={`flex items-center gap-2.5 p-3 rounded text-sm font-medium ${status === 'success' ? 'bg-teal/10 text-teal border border-teal/25' : status === 'failed' ? 'bg-destructive/10 text-destructive border border-destructive/25' : 'bg-warm/10 text-amber-700 border border-warm/30'}`}>
                  {(status === 'sending' || status === 'pending') && <Loader2 size={16} className="animate-spin shrink-0" />}
                  {status === 'success' && <CheckCircle size={16} className="shrink-0" />}
                  {status === 'failed' && <XCircle size={16} className="shrink-0" />}
                  {statusMsg}
                </div>
              )}
              <Button className="w-full justify-center gap-2" disabled={status === 'sending' || status === 'pending' || status === 'success'} onClick={handleSubmit}>
                {status === 'sending' || status === 'pending' ? <><Loader2 size={15} className="animate-spin" /> Processing…</> : 'Send M-Pesa Request'}
              </Button>
              <p className="text-xs text-muted text-center">You'll receive an STK Push prompt. Enter your PIN to complete.</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
