import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Globe, Award, TrendingUp, Check, Calendar } from 'lucide-react'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { Glow } from '@/components/marketing/Glow'
import { Button } from '@/components/ui/button'
import { BOOKING_EMBED_URL, PRICES } from '@/lib/constants'
import { formatKES } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

const EXAMS = [
  {
    id: 'ielts', label: 'IELTS', color: 'text-primary',
    headline: 'IELTS Academic & General Training',
    desc: 'Our most popular programme. We focus on real exam strategies for Writing, Reading, Listening, and Speaking.',
    features: ['Expert writing task feedback', 'Speaking simulations with examiner rubric', 'Full mock tests', 'Band 7+ strategies'],
    groupPrice: PRICES.ieltsGroup, soloPrice: PRICES.ieltsOneOnOne, soloUnit: '/ session',
  },
  {
    id: 'toefl', label: 'TOEFL', color: 'text-teal',
    headline: 'TOEFL iBT Intensive',
    desc: 'Task-type mastery for Reading, Listening, Speaking (RSSL), and Writing — with timed practice from day one.',
    features: ['Integrated task strategies', 'Note-taking techniques', 'Speaking response templates', 'Score prediction practice'],
    groupPrice: PRICES.toeflBootcamp, soloPrice: PRICES.ieltsOneOnOne, soloUnit: '/ session',
  },
  {
    id: 'pte', label: 'PTE', color: 'text-warm',
    headline: 'PTE Academic Intensive',
    desc: 'AI-scored exam strategies for all PTE task types — from Describe Image to Write from Dictation.',
    features: ['AI scoring familiarity', 'Template-based responses', 'Pronunciation coaching', 'Mock PTE simulations'],
    groupPrice: PRICES.pteIntensive, soloPrice: PRICES.ieltsOneOnOne, soloUnit: '/ session',
  },
]

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState('ielts')
  const nav = useNavigate()
  const exam = EXAMS.find(e => e.id === activeTab)!

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-bbg py-20 overflow-hidden">
        <Glow />
        <div className="relative z-10 max-w-[1160px] mx-auto px-6">
          <SectionHeading eyebrow="Services" title="Comprehensive exam prep & study abroad support." subtitle="Whether you need group classes, 1:1 coaching, or full admissions guidance — we have a path for you." />
        </div>
      </section>

      {/* Test Prep Tabs */}
      <section className="py-20 bg-surface">
        <div className="max-w-[1160px] mx-auto px-6">
          <SectionHeading eyebrow="Test Prep" title="IELTS · TOEFL · PTE" />
          <div className="flex gap-2 mb-8">
            {EXAMS.map(e => (
              <button key={e.id} onClick={() => setActiveTab(e.id)}
                className={`px-5 py-2 rounded font-semibold text-sm transition-all ${activeTab === e.id ? 'bg-navy text-white shadow' : 'bg-surface border border-bborder text-muted hover:border-navy'}`}>
                {e.label}
              </button>
            ))}
          </div>
          <motion.div key={activeTab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
            className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <h3 className="font-heading font-bold text-navy text-2xl mb-3">{exam.headline}</h3>
              <p className="text-muted mb-6 leading-relaxed">{exam.desc}</p>
              <ul className="space-y-2 mb-8">
                {exam.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm"><Check size={15} className={exam.color} /> {f}</li>
                ))}
              </ul>
              <Button onClick={() => nav('/contact')} className="gap-2">Book a free consult</Button>
            </div>
            <div className="glass rounded-lg p-6 flex flex-col gap-4">
              <h4 className="font-heading font-bold text-navy">Pricing</h4>
              <div className="flex gap-4">
                <div className="flex-1 border border-bborder rounded p-4">
                  <div className="text-xs text-muted mb-1">Group Package</div>
                  <div className="font-heading font-extrabold text-navy text-2xl">{formatKES(exam.groupPrice)}</div>
                </div>
                <div className="flex-1 border border-primary/30 rounded p-4 bg-primary/5">
                  <div className="text-xs text-muted mb-1">1:1 Sessions</div>
                  <div className="font-heading font-extrabold text-navy text-2xl">{formatKES(exam.soloPrice)}<span className="text-xs font-normal text-muted ml-1">{exam.soloUnit}</span></div>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => nav('/contact')}>Get started</Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Study Abroad */}
      <section className="py-20 bg-bbg">
        <div className="max-w-[1160px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeading eyebrow="Study Abroad" title="Your path to a global university." subtitle="End-to-end guidance: school selection, SOPs, applications, and visa interview prep." />
              <ul className="space-y-3 mb-8">
                {['School shortlisting based on your profile & budget', 'SOP and personal statement drafting + review', 'Application timeline management', 'Visa interview coaching (UK, USA, Canada, Australia)'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm"><Globe size={14} className="text-teal shrink-0" /> {f}</li>
                ))}
              </ul>
              <div className="flex items-center gap-4">
                <div>
                  <div className="font-heading font-extrabold text-navy text-2xl">{formatKES(PRICES.admissionsSupport)}</div>
                  <div className="text-xs text-muted">Full package</div>
                </div>
                <Button onClick={() => nav('/contact')}>Enquire now</Button>
              </div>
            </div>
            <div className="glass rounded-lg p-8 text-center">
              <Globe size={48} className="text-teal mx-auto mb-4 opacity-70" />
              <h3 className="font-heading font-bold text-navy text-xl mb-2">Countries we support</h3>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {['🇬🇧 UK', '🇺🇸 USA', '🇨🇦 Canada', '🇦🇺 Australia', '🇩🇪 Germany', '🇳🇱 Netherlands'].map(c => (
                  <span key={c} className="px-3 py-1 rounded-full border border-bborder bg-surface text-sm font-medium text-navy">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mock Evaluation */}
      <section className="py-20 bg-surface">
        <div className="max-w-[1160px] mx-auto px-6">
          <div className="glass rounded-xl p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <SectionHeading eyebrow="Mock Evaluation" title="Find out where you stand." subtitle="Full-length mock tests assessed by our expert trainers with detailed band score estimates and improvement plans." />
              <div className="font-heading font-extrabold text-navy text-3xl mb-4">{formatKES(PRICES.mockEvaluation)}</div>
              <Button onClick={() => nav('/contact')} className="gap-2"><TrendingUp size={15} /> Book a mock eval</Button>
            </div>
            <div className="flex flex-col gap-3 min-w-[220px]">
              {['Full 4-skill mock test', 'Examiner-style written feedback', 'Band score estimate', 'Personalised improvement plan'].map(f => (
                <div key={f} className="flex items-center gap-2 text-sm"><Check size={14} className="text-teal" /> {f}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Booking */}
      <section className="py-20 bg-bbg">
        <div className="max-w-[760px] mx-auto px-6">
          <SectionHeading eyebrow="Book" title="Schedule your free consultation." center />
          <div className="glass rounded-xl overflow-hidden">
            <iframe src={BOOKING_EMBED_URL} className="w-full h-[520px] border-0" title="Book a call" />
          </div>
        </div>
      </section>
    </div>
  )
}
