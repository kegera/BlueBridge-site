import { useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { TESTIMONIALS } from '@/lib/constants'

export function Carousel() {
  const [idx, setIdx] = useState(0)
  const [dir, setDir] = useState(1)
  const go = (d: number) => { setDir(d); setIdx(i => (i + d + TESTIMONIALS.length) % TESTIMONIALS.length) }
  const t = TESTIMONIALS[idx]

  return (
    <div className="relative max-w-2xl mx-auto">
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div key={idx}
          custom={dir}
          initial={{ opacity: 0, x: dir * 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir * -40 }}
          transition={{ duration: 0.35 }}
          className="glass rounded-lg p-8 text-center"
        >
          <div className="flex justify-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} className="text-warm fill-warm" />)}
          </div>
          <blockquote className="text-text text-base leading-relaxed mb-6 italic">"{t.quote}"</blockquote>
          <div className="font-heading font-bold text-navy">{t.name}</div>
          <div className="text-sm text-muted">{t.detail}</div>
          <div className="mt-2 inline-block px-3 py-1 rounded-full bg-teal/10 text-teal text-xs font-semibold border border-teal/25">{t.score}</div>
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-center gap-3 mt-6">
        <button onClick={() => go(-1)} className="w-9 h-9 rounded-full border border-bborder bg-surface flex items-center justify-center text-navy hover:border-primary hover:bg-accent transition-all"><ChevronLeft size={16} /></button>
        <div className="flex items-center gap-1.5">
          {TESTIMONIALS.map((_, i) => <button key={i} onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i) }} className={`w-2 h-2 rounded-full transition-all ${i === idx ? 'bg-primary w-4' : 'bg-bborder'}`} />)}
        </div>
        <button onClick={() => go(1)} className="w-9 h-9 rounded-full border border-bborder bg-surface flex items-center justify-center text-navy hover:border-primary hover:bg-accent transition-all"><ChevronRight size={16} /></button>
      </div>
    </div>
  )
}
