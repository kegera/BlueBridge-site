import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import type { ToastPayload } from '@/lib/toast'

interface ToastItem extends ToastPayload { id: number }

let _id = 0

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ToastPayload>).detail
      const id = ++_id
      const duration = detail.duration ?? 3500
      setToasts(p => [...p, { ...detail, id }])
      setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), duration)
    }
    window.addEventListener('bb:toast', handler)
    return () => window.removeEventListener('bb:toast', handler)
  }, [])

  const dismiss = (id: number) => setToasts(p => p.filter(t => t.id !== id))

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id}
            initial={{ opacity: 0, x: 60, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-sm
              ${t.variant === 'destructive'
                ? 'bg-destructive/10 border-destructive/30 text-destructive'
                : t.variant === 'success'
                ? 'bg-teal/10 border-teal/30 text-teal'
                : 'bg-white/95 border-bborder text-navy'}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {t.variant === 'destructive' ? <XCircle size={18} /> :
               t.variant === 'success'     ? <CheckCircle size={18} /> :
                                             <Info size={18} className="text-primary" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm leading-snug">{t.title}</p>
              {t.description && <p className="text-xs mt-0.5 opacity-80">{t.description}</p>}
            </div>
            <button onClick={() => dismiss(t.id)} className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
