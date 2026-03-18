import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface Props {
  eyebrow?: string
  title: string
  subtitle?: string
  center?: boolean
  children?: ReactNode
  className?: string
}

export function SectionHeading({ eyebrow, title, subtitle, center = false, children, className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.6 }}
      className={cn('mb-10', center && 'text-center', className)}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-navy text-white mb-4">
          {eyebrow}
        </span>
      )}
      <h2 className="font-heading font-extrabold text-navy text-3xl md:text-4xl leading-tight mb-3">
        {title}
      </h2>
      {subtitle && <p className="text-muted text-base md:text-lg max-w-2xl">{center ? undefined : ''}{subtitle}</p>}
      {children}
    </motion.div>
  )
}
