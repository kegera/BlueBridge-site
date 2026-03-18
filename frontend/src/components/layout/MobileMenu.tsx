import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthCtx } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Shop', to: '/shop' },
  { label: 'Contact', to: '/contact' },
]

interface Props { open: boolean; onClose: () => void }

export function MobileMenu({ open, onClose }: Props) {
  const { isLoggedIn, role, logout } = useAuthCtx()
  const nav = useNavigate()

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[300] bg-navy/40 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed top-0 right-0 h-full w-[min(88%,360px)] bg-surface z-[301] flex flex-col p-6 shadow-lg"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-heading font-bold text-navy">BlueBridge</span>
              <button onClick={onClose} className="p-2 rounded-sm border border-bborder text-navy hover:bg-accent">
                <X size={16} />
              </button>
            </div>
            <nav className="flex flex-col gap-2 flex-1">
              {links.map(l => (
                <Link key={l.to} to={l.to} onClick={onClose}
                  className="flex items-center justify-between px-4 py-3 rounded border border-bborder text-sm font-medium text-text hover:border-primary hover:text-primary hover:bg-accent transition-all">
                  {l.label}
                </Link>
              ))}
              {isLoggedIn && (
                <Link to={role === 'instructor' ? '/instructor' : '/student'} onClick={onClose}
                  className="flex items-center justify-between px-4 py-3 rounded border border-primary bg-primary/5 text-sm font-medium text-primary transition-all">
                  My Portal
                </Link>
              )}
            </nav>
            <div className="flex flex-col gap-2 mt-4">
              {isLoggedIn ? (
                <Button variant="outline" className="w-full" onClick={() => { logout(); onClose(); nav('/') }}>Log out</Button>
              ) : (
                <>
                  <Button variant="outline" className="w-full" onClick={() => { onClose(); nav('/login') }}>Log in</Button>
                  <Button className="w-full" onClick={() => { onClose(); nav('/register') }}>Get started</Button>
                </>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
