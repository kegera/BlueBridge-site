import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpen, Globe, Award, Users, TrendingUp, Wifi, CheckCircle, Sparkles } from 'lucide-react'
import { Glow } from '@/components/marketing/Glow'
import { Pill } from '@/components/marketing/Pill'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { ServiceCard } from '@/components/marketing/ServiceCard'
import { Carousel } from '@/components/marketing/Carousel'
import { Button } from '@/components/ui/button'
import { BRAND, FAQS } from '@/lib/constants'
import { useState } from 'react'

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55 } } }

const STEPS = [
  { n: '01', title: 'Free Consult', desc: 'We assess your level and goals in a no-obligation 30-minute call.' },
  { n: '02', title: 'Diagnostic + Plan', desc: 'Receive a personalised study plan based on your target score and timeline.' },
  { n: '03', title: 'Training + Materials', desc: 'Join group or 1:1 classes backed by our premium digital materials.' },
  { n: '04', title: 'Mock + Refine', desc: 'Full-length mock tests with expert feedback before exam day.' },
]

export default function HomePage() {
  const nav = useNavigate()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-20 pb-24 bg-bbg">
        <Glow />
        <div className="relative z-10 max-w-[1160px] mx-auto px-6">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-2xl">
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-6">
              <Pill variant="primary"><Sparkles size={12} /> IELTS · TOEFL · PTE</Pill>
              <Pill variant="teal"><Award size={12} /> British Council Certified</Pill>
              <Pill>{BRAND.city}</Pill>
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-heading font-extrabold text-navy text-4xl md:text-6xl leading-[1.1] mb-6">
              Get the <span className="gradient-text">score.</span><br />
              Get the <span className="gradient-text">offer.</span><br />
              Go global.
            </motion.h1>
            <motion.p variants={fadeUp} className="text-muted text-lg leading-relaxed mb-8 max-w-xl">
              We help students and professionals across Kenya prepare for IELTS, TOEFL, and PTE — plus full study abroad guidance, premium materials, and expert mock evaluations.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <Button size="lg" onClick={() => nav('/contact')} className="gap-2">Book a free consultation <ArrowRight size={16} /></Button>
              <Button size="lg" variant="outline" onClick={() => nav('/services')} className="gap-2">Explore classes</Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}
            className="grid grid-cols-3 gap-4 mt-14 max-w-lg">
            {[
              { value: '1000+', label: 'Students supported' },
              { value: '+1 Band', label: 'Avg. improvement' },
              { value: 'Online', label: 'Worldwide support' },
            ].map(s => (
              <div key={s.label} className="glass rounded-lg p-4 text-center">
                <div className="font-heading font-extrabold text-navy text-2xl">{s.value}</div>
                <div className="text-xs text-muted mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div className="bg-navy text-white/70 py-4 overflow-hidden">
        <div className="max-w-[1160px] mx-auto px-6 flex flex-wrap justify-center gap-6 text-xs font-medium">
          {['Certified Trainers', 'Structured Study Plans', 'Real Exam Strategies', 'M-Pesa & Card Accepted', 'Online Worldwide'].map(t => (
            <span key={t} className="flex items-center gap-1.5"><CheckCircle size={12} className="text-teal" />{t}</span>
          ))}
        </div>
      </div>

      {/* ── SERVICES ── */}
      <section className="section py-20 bg-surface">
        <div className="max-w-[1160px] mx-auto px-6">
          <SectionHeading eyebrow="Services" title="Everything you need to prepare and go global." subtitle="Classes, 1:1 coaching, study abroad support, materials, and mock evaluations." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <ServiceCard icon={<BookOpen size={20} />} title="Test Prep" description="IELTS, TOEFL, PTE classes with strategy, practice, and examiner-style feedback." features={['Group classes & 1:1 coaching', 'Placement test', 'Examiner feedback']} onCta={() => nav('/services')} delay={0} />
            <ServiceCard icon={<Globe size={20} />} title="Study Abroad" description="School selection, SOP, applications, and visa interview preparation." features={['Shortlist programs', 'SOP & CV review', 'Visa prep']} accentClass="text-teal" onCta={() => nav('/services')} delay={0.1} />
            <ServiceCard icon={<Award size={20} />} title="Materials" description="Premium PDFs, print workbooks, and topic bundles." features={['Instant download', 'IELTS / TOEFL / PTE', 'Print available']} accentClass="text-warm" onCta={() => nav('/shop')} delay={0.2} />
            <ServiceCard icon={<TrendingUp size={20} />} title="Mock Evaluation" description="Full-length mock tests with expert feedback and improvement plan." features={['Band estimate', 'Written feedback', 'Improvement roadmap']} accentClass="text-primary" onCta={() => nav('/services')} delay={0.3} />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-bbg">
        <div className="max-w-[1160px] mx-auto px-6">
          <SectionHeading eyebrow="Process" title="From zero to your target score." center />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <motion.div key={s.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass rounded-lg p-6 flex flex-col gap-3">
                <span className="font-heading font-extrabold text-4xl gradient-text opacity-60">{s.n}</span>
                <h3 className="font-heading font-bold text-navy">{s.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-surface">
        <div className="max-w-[1160px] mx-auto px-6">
          <SectionHeading eyebrow="Success Stories" title="Real results from real students." center />
          <Carousel />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-bbg">
        <div className="max-w-[760px] mx-auto px-6">
          <SectionHeading eyebrow="FAQ" title="Common questions." center />
          <div className="flex flex-col gap-3">
            {FAQS.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="glass rounded-lg overflow-hidden">
                <button className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-navy text-sm"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {faq.q}
                  <span className={`w-6 h-6 rounded-full border border-bborder flex items-center justify-center text-primary transition-transform ${openFaq === i ? 'rotate-45 bg-primary text-white border-primary' : ''}`}>+</span>
                </button>
                {openFaq === i && <div className="px-5 pb-5 text-sm text-muted leading-relaxed">{faq.a}</div>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(30,94,255,.3),transparent_60%)]" />
        <div className="relative z-10 max-w-[700px] mx-auto px-6 text-center">
          <Pill variant="teal" className="mb-6"><Wifi size={12} /> Online + In-person</Pill>
          <h2 className="font-heading font-extrabold text-4xl mb-4">Ready to start your journey?</h2>
          <p className="text-white/70 mb-8 text-lg">Book a free consultation today and discover exactly what you need to hit your target score.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button size="lg" variant="ghost" onClick={() => nav('/contact')} className="gap-2 border-white/20 hover:bg-white/10">Book free call <ArrowRight size={16} /></Button>
            <Button size="lg" onClick={() => nav('/register')} className="gap-2">Create account</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
