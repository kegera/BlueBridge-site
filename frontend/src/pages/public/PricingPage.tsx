import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { PricingCard } from '@/components/marketing/PricingCard'
import { PricingToggle } from '@/components/marketing/PricingToggle'
import { Glow } from '@/components/marketing/Glow'
import { PRICES, FAQS } from '@/lib/constants'

export default function PricingPage() {
  const [mode, setMode] = useState<'package' | 'monthly'>('package')
  const nav = useNavigate()

  const cards = mode === 'package'
    ? [
        { name: 'Group Class', price: PRICES.ieltsGroup, period: '/package', description: 'Ideal for structured learners who thrive in a group setting.', features: ['IELTS, TOEFL or PTE', '8–12 students per class', 'All 4 skills covered', 'Digital materials included'] },
        { name: '1:1 Coaching', price: PRICES.ieltsOneOnOne, period: '/session', description: 'Personalised sessions focused on your weakest skills.', features: ['Any exam type', 'Flexible scheduling', 'Tailored feedback', 'Progress tracking'], featured: true },
        { name: 'Study Abroad', price: PRICES.admissionsSupport, period: '/package', description: 'Full admissions support from school selection to visa interview.', features: ['School shortlisting', 'SOP + essay review', 'Application management', 'Visa interview coaching'] },
      ]
    : [
        { name: 'Group Class', price: 2000, period: '/mo', description: 'Monthly access to all group classes.', features: ['Unlimited group sessions', 'All exam types', 'Digital materials', 'Monthly assessment'] },
        { name: '1:1 Sessions', price: PRICES.ieltsOneOnOne, period: '/session', description: 'Book individual sessions as needed.', features: ['Any exam', 'Flexible timing', 'Examiner feedback', 'No commitment'], featured: true },
        { name: 'Abroad Support', price: 7500, period: '/mo', description: 'Ongoing monthly admissions guidance.', features: ['Regular check-ins', 'Document reviews', 'Application updates', 'WhatsApp support'] },
      ]

  return (
    <div>
      <section className="relative bg-bbg py-20 overflow-hidden">
        <Glow />
        <div className="relative z-10 max-w-[1160px] mx-auto px-6">
          <SectionHeading eyebrow="Pricing" title="Simple, transparent pricing." subtitle="No hidden fees. Pick the plan that fits your schedule and budget." center />
          <div className="flex justify-center mb-10">
            <PricingToggle value={mode} onChange={setMode} />
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-[900px] mx-auto">
            {cards.map(c => <PricingCard key={c.name} {...c} onCta={() => nav('/contact')} ctaLabel="Get started" />)}
          </div>
        </div>
      </section>

      {/* Shop mention */}
      <section className="py-16 bg-surface">
        <div className="max-w-[600px] mx-auto px-6 text-center">
          <h3 className="font-heading font-bold text-navy text-2xl mb-3">Need materials only?</h3>
          <p className="text-muted mb-6">Browse our shop for individual PDFs, bundles, and print workbooks — no class commitment needed.</p>
          <button onClick={() => nav('/shop')} className="px-6 py-3 rounded gradient-primary text-white font-semibold hover:-translate-y-0.5 transition-all shadow">Browse Shop</button>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-bbg">
        <div className="max-w-[680px] mx-auto px-6">
          <SectionHeading eyebrow="FAQ" title="Pricing questions." center />
          {FAQS.slice(0, 3).map((f, i) => (
            <details key={i} className="glass rounded-lg mb-3 group">
              <summary className="px-5 py-4 font-semibold text-navy text-sm cursor-pointer list-none flex justify-between">
                {f.q} <span className="text-primary group-open:rotate-45 transition-transform inline-block">+</span>
              </summary>
              <p className="px-5 pb-5 text-sm text-muted leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  )
}
