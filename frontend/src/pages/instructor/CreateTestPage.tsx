import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { QuestionBuilder, type QDraft } from '@/components/portal/QuestionBuilder'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const EXAM_TYPES = ['IELTS', 'TOEFL', 'PTE', 'General']

export default function CreateTestPage() {
  const nav = useNavigate()
  const [step, setStep] = useState<1 | 2>(1)
  const [saving, setSaving] = useState(false)
  const [meta, setMeta] = useState({ title: '', description: '', exam_type: 'IELTS', time_limit: '' })
  const [questions, setQuestions] = useState<QDraft[]>([])
  const [err, setErr] = useState('')

  const saveTest = async (publish: boolean) => {
    if (!meta.title.trim()) return setErr('Test title is required.')
    if (questions.length === 0) return setErr('Add at least one question.')
    setErr(''); setSaving(true)
    try {
      const test = await apiFetch<{ id: number }>('/tests', {
        method: 'POST',
        body: JSON.stringify({ ...meta, time_limit: meta.time_limit ? +meta.time_limit : null }),
      })
      // Save questions
      for (const [i, q] of questions.entries()) {
        await apiFetch(`/tests/${test.id}/questions`, {
          method: 'POST',
          body: JSON.stringify({
            body: q.body, question_type: q.question_type, order_index: i, points: q.points,
            options: q.question_type === 'mcq' ? q.options.map((o, oi) => ({ body: o.body, is_correct: o.is_correct, order_index: oi })) : [],
          }),
        })
      }
      if (publish) await apiFetch(`/tests/${test.id}/publish`, { method: 'PATCH', body: JSON.stringify({ is_published: true }) })
      nav('/instructor')
    } catch (e: any) { setErr(e.message ?? 'Save failed.') } finally { setSaving(false) }
  }

  return (
    <div className="min-h-screen bg-bbg">
      <div className="max-w-[800px] mx-auto px-6 py-10">
        <button onClick={() => step === 2 ? setStep(1) : nav('/instructor')} className="flex items-center gap-2 text-sm text-muted hover:text-navy transition-colors mb-6">
          <ArrowLeft size={15} /> {step === 2 ? 'Back to details' : 'Back to dashboard'}
        </button>
        <h1 className="font-heading font-extrabold text-navy text-2xl mb-8">{step === 1 ? 'New Test — Details' : 'Add Questions'}</h1>

        {step === 1 && (
          <div className="bg-surface border border-bborder rounded-lg p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label>Test Title <span className="text-destructive">*</span></Label>
              <Input value={meta.title} onChange={e => setMeta(p => ({ ...p, title: e.target.value }))} placeholder="e.g. IELTS Writing Practice – Task 2" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Description</Label>
              <Textarea value={meta.description} onChange={e => setMeta(p => ({ ...p, description: e.target.value }))} placeholder="Brief description for students…" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Exam Type</Label>
                <div className="flex flex-wrap gap-2">
                  {EXAM_TYPES.map(t => (
                    <button key={t} onClick={() => setMeta(p => ({ ...p, exam_type: t }))}
                      className={`px-3 py-1.5 rounded-sm border text-sm font-medium transition-all ${meta.exam_type === t ? 'bg-navy text-white border-navy' : 'border-bborder text-muted hover:border-navy'}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Time Limit (minutes)</Label>
                <Input type="number" min={0} placeholder="Leave blank for no limit" value={meta.time_limit} onChange={e => setMeta(p => ({ ...p, time_limit: e.target.value }))} />
              </div>
            </div>
            {err && <p className="text-sm text-destructive">{err}</p>}
            <Button onClick={() => { if (!meta.title.trim()) return setErr('Title required.'); setErr(''); setStep(2) }} className="self-start gap-2">Next: Add Questions</Button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6">
            <QuestionBuilder questions={questions} onChange={setQuestions} />
            {err && <p className="text-sm text-destructive">{err}</p>}
            <div className="flex gap-3">
              <Button variant="outline" disabled={saving} onClick={() => saveTest(false)} className="gap-2">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Draft
              </Button>
              <Button disabled={saving} onClick={() => saveTest(true)} className="gap-2">
                {saving ? <Loader2 size={14} className="animate-spin" /> : null} Save & Publish
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
