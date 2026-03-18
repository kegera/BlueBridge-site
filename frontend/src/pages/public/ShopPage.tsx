import { useState } from 'react'
import { Search } from 'lucide-react'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { ProductCard } from '@/components/marketing/ProductCard'
import { Glow } from '@/components/marketing/Glow'
import { PRODUCTS } from '@/lib/constants'

const CATS = ['All', 'IELTS', 'TOEFL', 'PTE']

export default function ShopPage() {
  const [cat, setCat] = useState('All')
  const [q, setQ] = useState('')

  const filtered = PRODUCTS.filter(p => (cat === 'All' || p.category === cat) && p.title.toLowerCase().includes(q.toLowerCase()))

  return (
    <div>
      <section className="relative bg-bbg py-20 overflow-hidden">
        <Glow />
        <div className="relative z-10 max-w-[1160px] mx-auto px-6">
          <SectionHeading eyebrow="Shop" title="Premium study materials." subtitle="Instantly downloadable PDFs, bundles, and print workbooks trusted by 1,000+ students." />

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1 max-w-xs">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search materials…"
                className="w-full pl-9 pr-4 py-2.5 rounded border border-bborder bg-surface text-sm focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div className="flex gap-2">
              {CATS.map(c => (
                <button key={c} onClick={() => setCat(c)}
                  className={`px-4 py-2 rounded-sm text-sm font-medium transition-all ${cat === c ? 'bg-navy text-white' : 'border border-bborder bg-surface text-muted hover:border-navy'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0
            ? <div className="text-center py-16 text-muted">No products match your search.</div>
            : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
          }
        </div>
      </section>
    </div>
  )
}
