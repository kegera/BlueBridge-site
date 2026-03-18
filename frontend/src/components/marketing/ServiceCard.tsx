import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface Props {
  icon: ReactNode
  title: string
  description: string
  features: string[]
  accentClass?: string
  onCta?: () => void
  ctaLabel?: string
  delay?: number
}

export function ServiceCard({ icon, title, description, features, accentClass = 'text-primary', onCta, ctaLabel = 'Learn more', delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5, delay }}
      className="card-hover glass rounded-lg p-6 flex flex-col gap-4"
    >
      <div className={cn('w-11 h-11 rounded-sm flex items-center justify-center bg-current/10', accentClass)}>
        <span className={accentClass}>{icon}</span>
      </div>
      <div>
        <h3 className="font-heading font-bold text-navy text-lg mb-1">{title}</h3>
        <p className="text-sm text-muted leading-relaxed">{description}</p>
      </div>
      <ul className="space-y-1.5">
        {features.map(f => (
          <li key={f} className="flex items-center gap-2 text-sm text-text">
            <Check size={14} className={cn('shrink-0', accentClass)} /> {f}
          </li>
        ))}
      </ul>
      {onCta && (
        <Button variant="outline" size="sm" className="mt-auto w-full justify-center gap-1" onClick={onCta}>
          {ctaLabel} <ArrowRight size={14} />
        </Button>
      )}
    </motion.div>
  )
}
