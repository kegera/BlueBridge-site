import { Link } from 'react-router-dom'
import { MessageCircle, ArrowUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CONTACT, BRAND } from '@/lib/constants'
import { Logo } from '@/components/ui/Logo'

const LINKS = [
  {
    title: 'Test Prep',
    items: [
      { label: 'IELTS Classes', to: '/services' },
      { label: 'TOEFL Prep', to: '/services' },
      { label: 'PTE Intensive', to: '/services' },
      { label: 'Mock Evaluation', to: '/services' },
    ],
  },
  {
    title: 'Study Abroad',
    items: [
      { label: 'School Selection', to: '/services' },
      { label: 'SOP / Essay Review', to: '/services' },
      { label: 'Visa Interview Prep', to: '/services' },
      { label: 'Admissions Pricing', to: '/pricing' },
    ],
  },
  {
    title: 'Company',
    items: [
      { label: 'Shop', to: '/shop' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Contact Us', to: '/contact' },
      { label: 'Client Portal', to: '/login' },
    ],
  },
]

export function Footer() {
  const [showTop, setShowTop] = useState(false)
  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 400)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <footer className="bg-navy text-white/70 pt-14 pb-8">
        <div className="max-w-[1160px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4">
                <Logo size={36} className="[&_span]:text-white [&_.text-primary]:text-teal" />
              </div>
              <p className="text-xs leading-relaxed mb-4 text-white/50">{BRAND.tagline}</p>
              <a href={`https://wa.me/${CONTACT.whatsappWaMe}`} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs text-teal hover:text-teal/80 transition-colors">
                <MessageCircle size={14} /> {CONTACT.whatsappDisplay}
              </a>
            </div>

            {/* Nav groups */}
            {LINKS.map(g => (
              <div key={g.title}>
                <h4 className="font-heading font-bold text-white/90 text-xs uppercase tracking-widest mb-4">{g.title}</h4>
                <ul className="space-y-2.5">
                  {g.items.map(l => (
                    <li key={l.label}>
                      <Link to={l.to} className="text-xs text-white/50 hover:text-white transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
            <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
            <div className="flex gap-4">
              <Link to="/contact" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp float */}
      <a href={`https://wa.me/${CONTACT.whatsappWaMe}`} target="_blank" rel="noreferrer"
        className="fixed bottom-5 left-5 z-[150] flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366] text-white text-sm font-semibold shadow-lg hover:-translate-y-1 transition-all">
        <MessageCircle size={16} /> WhatsApp
      </a>

      {/* Back to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-5 right-5 z-[150] w-10 h-10 rounded-full gradient-primary text-white flex items-center justify-center shadow-lg hover:-translate-y-1 transition-transform">
            <ArrowUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
