import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { GradeInput } from '@/components/portal/GradeInput'
import { AnswerView } from '@/components/portal/AnswerView'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Submission, Answer } from '@/types'

export default function GradeSubmissionPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const [sub, setSub] = useState<Submission | null>(null)
  const [grades, setGrades] = useState<Record<number, { points: number; comment: string }>>({})
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    apiFetch<Submission>(`/submissions/${id}`).then(s => {
      setSub(s)
      const init: typeof grades = {}
      s.answers?.filter(a => a.question?.question_type === 'open').forEach(a => { init[a.id] = { points: 0, comment: '' } })
      setGrades(init)
    })
  }, [id])

  const submitGrades = async () => {
    setSaving(true)
    try {
      const payload = Object.entries(grades).map(([aid, g]) => ({ answer_id: +aid, points_awarded: g.points, instructor_comment: g.comment }))
      await apiFetch(`/submissions/${id}/grade`, { method: 'PATCH', body: JSON.stringify({ answers: payload }) })
      setDone(true)
      setTimeout(() => nav('/instructor/submissions'), 1500)
    } finally { setSaving(false) }
  }

  if (!sub) return <div className="flex items-center justify-center h-screen text-muted">Loading…</div>

  const openAnswers = sub.answers?.filter(a => a.question?.question_type === 'open') ?? []
  const mcqAnswers = sub.answers?.filter(a => a.question?.question_type === 'mcq') ?? []

  return (
    <div className="min-h-screen bg-bbg">
      <div className="max-w-[800px] mx-auto px-6 py-10">
        <button onClick={() => nav('/instructor/submissions')} className="flex items-center gap-2 text-sm text-muted hover:text-navy mb-6"><ArrowLeft size={15} /> Back</button>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading font-extrabold text-navy text-2xl">{sub.test_title}</h1>
            <p className="text-muted mt-1">{sub.student_name} · submitted {sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString() : '—'}</p>
          </div>
          <Badge variant={sub.status === 'graded' ? 'success' : 'warm'}>{sub.status}</Badge>
        </div>

        {/* MCQ section */}
        {mcqAnswers.length > 0 && (
          <div className="mb-8">
            <h2 className="font-heading font-bold text-navy mb-4">Multiple Choice <span className="text-muted font-normal text-sm">({sub.mcq_score} / {mcqAnswers.reduce((s, a) => s + (a.question?.points ?? 1), 0)} pts — auto-graded)</span></h2>
            <div className="flex flex-col gap-3">
              {mcqAnswers.map((a, i) => <AnswerView key={a.id} answer={a} index={i} />)}
            </div>
          </div>
        )}

        {/* Open section */}
        {openAnswers.length > 0 && (
          <div className="mb-8">
            <h2 className="font-heading font-bold text-navy mb-4">Open-Ended Questions</h2>
            <div className="flex flex-col gap-4">
              {openAnswers.map((a, i) => (
                <GradeInput key={a.id} answer={a} index={i} value={grades[a.id] ?? { points: 0, comment: '' }} onChange={v => setGrades(prev => ({ ...prev, [a.id]: v }))} />
              ))}
            </div>
          </div>
        )}

        {done ? (
          <div className="flex items-center gap-2 text-teal font-semibold"><CheckCircle size={18} /> Grades saved! Redirecting…</div>
        ) : openAnswers.length > 0 && sub.status !== 'graded' ? (
          <Button onClick={submitGrades} disabled={saving} className="gap-2">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />} Submit Grades
          </Button>
        ) : null}
      </div>
    </div>
  )
}
