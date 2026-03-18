import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { QuestionBuilder, type QDraft } from '@/components/portal/QuestionBuilder'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import type { Test } from '@/types'

export default function EditTestPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const [test, setTest] = useState<Test | null>(null)
  const [meta, setMeta] = useState({ title: '', description: '', exam_type: 'IELTS', time_limit: '' })
  const [questions, setQuestions] = useState<QDraft[]>([])
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    apiFetch<Test>(`/tests/${id}`).then(t => {
      setTest(t)
      setMeta({ title: t.title, description: t.description, exam_type: t.exam_type, time_limit: t.time_limit ? String(t.time_limit) : '' })
      setQuestions((t.questions ?? []).map(q => ({
        id: String(q.id), body: q.body, question_type: q.question_type, points: q.points,
        options: q.options.map(o => ({ id: String(o.id), body: o.body, is_correct: !!o.is_correct })),
      })))
    })
  }, [id])

  const save = async () => {
    if (!meta.title.trim()) return setErr('Title required.')
    setSaving(true); setErr('')
    try {
      await apiFetch(`/tests/${id}`, { method: 'PUT', body: JSON.stringify({ ...meta, time_limit: meta.time_limit ? +meta.time_limit : null }) })
      nav('/instructor')
    } catch (e: any) { setErr(e.message) } finally { setSaving(false) }
  }

  if (!test) return <div className="flex items-center justify-center h-screen text-muted">Loading…</div>

  return (
    <div className="min-h-screen bg-bbg">
      <div className="max-w-[800px] mx-auto px-6 py-10">
        <button onClick={() => nav('/instructor')} className="flex items-center gap-2 text-sm text-muted hover:text-navy mb-6"><ArrowLeft size={15} /> Back</button>
        <h1 className="font-heading font-extrabold text-navy text-2xl mb-8">Edit Test</h1>
        <div className="bg-surface border border-bborder rounded-lg p-6 flex flex-col gap-5 mb-6">
          <div className="flex flex-col gap-1.5"><Label>Title</Label><Input value={meta.title} onChange={e => setMeta(p => ({ ...p, title: e.target.value }))} /></div>
          <div className="flex flex-col gap-1.5"><Label>Description</Label><Textarea value={meta.description} onChange={e => setMeta(p => ({ ...p, description: e.target.value }))} /></div>
          <div className="flex flex-col gap-1.5"><Label>Time Limit (min)</Label><Input type="number" value={meta.time_limit} onChange={e => setMeta(p => ({ ...p, time_limit: e.target.value }))} /></div>
        </div>
        <h2 className="font-heading font-bold text-navy mb-4">Questions</h2>
        <QuestionBuilder questions={questions} onChange={setQuestions} />
        {err && <p className="text-sm text-destructive mt-4">{err}</p>}
        <div className="flex gap-3 mt-6">
          <Button disabled={saving} onClick={save} className="gap-2">{saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Changes</Button>
        </div>
      </div>
    </div>
  )
}
