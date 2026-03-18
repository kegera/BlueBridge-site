import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatKES } from '@/lib/utils'

interface Props {
  name: string
  price: number
  period?: string
  description: string
  features: string[]
  featured?: boolean
  ctaLabel?: string
  onCta?: () => void
}

export function PricingCard({ name, price, period = '/package', description, features, featured, ctaLabel = 'Get started', onCta }: Props) {
  return (
    <div className={cn('rounded-lg p-6 border flex flex-col gap-5 transition-all', featured ? 'border-primary/40 bg-gradient-to-b from-primary/5 to-teal/5 shadow-glow' : 'border-bborder bg-surface shadow-sm')}>
      {featured && <span className="self-start text-xs font-bold px-3 py-1 rounded-full bg-primary text-white">Most popular</span>}
      <div>
        <div className="font-heading font-extrabold text-navy text-3xl">{formatKES(price)}<span className="text-sm font-normal text-muted ml-1">{period}</span></div>
        <div className="font-heading font-bold text-navy mt-1">{name}</div>
        <p className="text-sm text-muted mt-1 leading-relaxed">{description}</p>
      </div>
      <ul className="space-y-2 flex-1">
        {features.map(f => (
          <li key={f} className="flex items-center gap-2 text-sm">
            <Check size={14} className="text-teal shrink-0" /> {f}
          </li>
        ))}
      </ul>
      <Button variant={featured ? 'default' : 'outline'} className="w-full justify-center" onClick={onCta}>{ctaLabel}</Button>
    </div>
  )
}
