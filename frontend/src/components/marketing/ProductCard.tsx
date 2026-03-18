import { ShoppingCart, MessageCircle, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatKES } from '@/lib/utils'
import { useCartCtx } from '@/contexts/CartContext'
import { CONTACT } from '@/lib/constants'
import type { Product } from '@/lib/constants'

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCartCtx()
  return (
    <div className="card-hover glass rounded-lg p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h3 className="font-heading font-bold text-navy text-sm leading-tight">{product.title}</h3>
          <p className="text-xs text-muted mt-0.5">{product.category} · {product.format}</p>
        </div>
        {product.badge && <Badge variant="warm">{product.badge}</Badge>}
      </div>
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={12} className={i < product.stars ? 'text-warm fill-warm' : 'text-bborder'} />
        ))}
        <span className="text-xs text-muted ml-1">({product.reviews})</span>
      </div>
      <div className="font-heading font-extrabold text-primary text-lg">{formatKES(product.price)}</div>
      <div className="flex gap-2">
        <Button size="sm" className="flex-1 justify-center" onClick={() => addItem({ id: product.id, title: product.title, category: product.category, format: product.format, price: product.price })}>
          <ShoppingCart size={13} /> Add
        </Button>
        <Button size="sm" variant="outline" asChild>
          <a href={`https://wa.me/${CONTACT.whatsappWaMe}?text=Hi! I'm interested in: ${encodeURIComponent(product.title)}`} target="_blank" rel="noreferrer">
            <MessageCircle size={13} />
          </a>
        </Button>
      </div>
    </div>
  )
}
