import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface Props { children: ReactNode; className?: string; variant?: 'default' | 'primary' | 'teal' }

export function Pill({ children, className, variant = 'default' }: Props) {
  const variants = {
    default: 'bg-white/80 border-bborder text-navy',
    primary: 'bg-primary/6 border-primary/25 text-primary',
    teal:    'bg-teal/6 border-teal/25 text-teal',
  }
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm', variants[variant], className)}>
      {children}
    </span>
  )
}
