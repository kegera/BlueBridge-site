import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useAuthCtx } from '@/contexts/AuthContext'
import { useCartCtx } from '@/contexts/CartContext'
import { MobileMenu } from './MobileMenu'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/Logo'

const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Shop', to: '/shop' },
  { label: 'Contact', to: '/contact' },
]

interface Props { onCartOpen: () => void }

export function Navbar({ onCartOpen }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { isLoggedIn, role, user, logout } = useAuthCtx()
  const { count } = useCartCtx()
  const nav = useNavigate()
  const { pathname } = useLocation()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <motion.div className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-teal to-warm z-[9999] origin-left" style={{ scaleX }} />

      <header className={`sticky top-[3px] z-[200] h-[68px] glass-nav border-b border-bborder transition-shadow duration-300 ${scrolled ? 'shadow-sm' : ''}`}>
        <div className="max-w-[1160px] mx-auto h-full flex items-center justify-between px-4 md:px-6 gap-4">
          <Link to="/" className="flex-shrink-0">
            <Logo size={34} />
          </Link>

          <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            {NAV.map(l => (
              <Link key={l.to} to={l.to}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all relative ${pathname === l.to ? 'text-primary font-semibold' : 'text-muted hover:text-navy hover:bg-accent'}`}>
                {l.label}
                {pathname === l.to && (
                  <motion.div layoutId="nav-indicator"
                    className="absolute inset-0 bg-primary/8 rounded-lg border border-primary/20"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                )}
              </Link>
            ))}
            {isLoggedIn && (
              <Link to={role === 'instructor' ? '/instructor' : '/student'}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold text-teal hover:bg-teal/10 transition-colors">
                Portal
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2 flex-shrink-0">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={onCartOpen}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-bborder bg-surface text-sm text-muted font-medium hover:border-primary hover:bg-accent transition-all">
              <ShoppingCart size={15} />
              <span className="hidden sm:inline">Cart</span>
              <AnimatePresence mode="wait">
                <motion.span key={count}
                  initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${count > 0 ? 'bg-primary text-white' : 'bg-bborder text-muted'}`}>
                  {count}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            <div className="hidden md:flex items-center gap-2">
              {isLoggedIn ? (
                <>
                  <span className="text-xs text-muted hidden lg:block max-w-[120px] truncate">{user?.full_name}</span>
                  <Button size="sm" variant="outline" onClick={() => { logout(); nav('/') }}>Log out</Button>
                </>
              ) : (
                <>
                  <Button size="sm" variant="outline" onClick={() => nav('/login')}>Log in</Button>
                  <Button size="sm" onClick={() => nav('/register')}>Get started</Button>
                </>
              )}
            </div>

            <button className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-bborder bg-surface text-navy hover:bg-accent transition-colors"
              onClick={() => setMenuOpen(o => !o)}>
              <AnimatePresence mode="wait">
                {menuOpen
                  ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={18} /></motion.span>
                  : <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><Menu size={18} /></motion.span>}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
