import { useState } from 'react'
import { Mail, Phone, MessageCircle } from 'lucide-react'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { Glow } from '@/components/marketing/Glow'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CONTACT, BOOKING_EMBED_URL } from '@/lib/constants'

function isEmail(s: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) }

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', service: '', message: '' })
  const [err, setErr] = useState('')

  const submit = () => {
    if (!form.name) return setErr('Please enter your name.')
    if (!isEmail(form.email)) return setErr('Please enter a valid email.')
    setErr('')
    const subject = encodeURIComponent(`Enquiry from ${form.name} — ${form.service || 'General'}`)
    const body = encodeURIComponent([`Name:    ${form.name}`, `Email:   ${form.email}`, `Service: ${form.service}`, '', form.message].join('\n'))
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`
  }

  return (
    <div>
      <section className="relative bg-bbg py-20 overflow-hidden">
        <Glow />
        <div className="relative z-10 max-w-[1160px] mx-auto px-6">
          <SectionHeading eyebrow="Contact" title="Get in touch." subtitle="We typically respond within 24 hours on business days." />

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact info */}
            <div className="flex flex-col gap-4">
              {[
                { icon: <Mail size={18} />, label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
                { icon: <Phone size={18} />, label: 'Phone', value: CONTACT.whatsappDisplay, href: `tel:+${CONTACT.phone}` },
                { icon: <MessageCircle size={18} />, label: 'WhatsApp', value: CONTACT.whatsappDisplay, href: `https://wa.me/${CONTACT.whatsappWaMe}` },
              ].map(c => (
                <a key={c.label} href={c.href} target="_blank" rel="noreferrer"
                  className="flex items-center gap-4 p-4 glass rounded-lg hover:border-primary/40 transition-all">
                  <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center text-primary">{c.icon}</div>
                  <div>
                    <div className="text-xs font-semibold text-muted uppercase tracking-wider">{c.label}</div>
                    <div className="font-semibold text-navy text-sm">{c.value}</div>
                  </div>
                </a>
              ))}

              {/* Booking */}
              <div className="glass rounded-lg overflow-hidden mt-4">
                <iframe src={BOOKING_EMBED_URL} className="w-full h-[320px] border-0" title="Book a call" />
              </div>
            </div>

            {/* Form */}
            <div className="glass rounded-lg p-6 flex flex-col gap-4">
              <h3 className="font-heading font-bold text-navy text-lg">Send a message</h3>
              {[
                { label: 'Your Name', key: 'name', type: 'text', placeholder: 'Sharon Ndinda' },
                { label: 'Email Address', key: 'email', type: 'email', placeholder: 'you@example.com' },
                { label: "Service you're interested in", key: 'service', type: 'text', placeholder: 'IELTS Classes, SOP Review…' },
              ].map(f => (
                <div key={f.key} className="flex flex-col gap-1.5">
                  <Label>{f.label}</Label>
                  <Input type={f.type} placeholder={f.placeholder} value={(form as Record<string,string>)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
                </div>
              ))}
              <div className="flex flex-col gap-1.5">
                <Label>Message (optional)</Label>
                <Textarea placeholder="Tell us a bit about your goals or questions…" value={form.message} onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))} />
              </div>
              {err && <p className="text-sm text-destructive">{err}</p>}
              <Button onClick={submit} className="w-full justify-center gap-2"><Mail size={15} /> Send message</Button>
              <p className="text-xs text-muted text-center">This will open your email client with the message pre-filled.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
