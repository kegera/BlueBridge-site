import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trophy } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { AnswerView } from '@/components/portal/AnswerView'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Submission } from '@/types'

export default function ResultsPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const [sub, setSub] = useState<Submission | null>(null)

  useEffect(() => { apiFetch<Submission>(`/submissions/${id}`).then(setSub) }, [id])

  if (!sub) return <div className="flex items-center justify-center h-screen text-muted">Loading…</div>

  const pct = sub.max_score > 0 && sub.total_score != null ? Math.round((sub.total_score / sub.max_score) * 100) : null
  const color = pct != null ? (pct >= 80 ? 'text-teal' : pct >= 60 ? 'text-primary' : 'text-warm') : 'text-muted'

  return (
    <div className="min-h-screen bg-bbg">
      <div className="max-w-[720px] mx-auto px-6 py-10">
        <button onClick={() => nav('/student')} className="flex items-center gap-2 text-sm text-muted hover:text-navy mb-6"><ArrowLeft size={15} /> Back to portal</button>

        {/* Score card */}
        <div className="bg-surface border border-bborder rounded-xl p-8 text-center mb-8">
          <Trophy size={40} className={`mx-auto mb-3 ${color}`} />
          <h1 className="font-heading font-extrabold text-navy text-2xl mb-1">{sub.test_title}</h1>
          <Badge variant={sub.status === 'graded' ? 'success' : 'warm'} className="mb-4">{sub.status}</Badge>
          {pct != null ? (
            <div className={`font-heading font-extrabold text-5xl ${color}`}>{pct}%</div>
          ) : (
            <p className="text-muted">Awaiting instructor grading for open questions.</p>
          )}
          {sub.total_score != null && <div className="text-sm text-muted mt-2">{sub.total_score} / {sub.max_score} points</div>}
          <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
            <div className="bg-bbg rounded p-3"><div className="text-muted text-xs mb-1">MCQ Score</div><div className="font-bold text-navy">{sub.mcq_score} pts</div></div>
            <div className="bg-bbg rounded p-3"><div className="text-muted text-xs mb-1">Open Score</div><div className="font-bold text-navy">{sub.open_score ?? '—'} pts</div></div>
          </div>
        </div>

        {/* Answers */}
        <h2 className="font-heading font-bold text-navy text-xl mb-4">Answer Review</h2>
        <div className="flex flex-col gap-4">
          {sub.answers?.map((a, i) => <AnswerView key={a.id} answer={a} index={i} />) ?? <p className="text-muted">No answers to display.</p>}
        </div>

        <Button variant="outline" className="mt-8 gap-2" onClick={() => nav('/student')}><ArrowLeft size={14} /> Back to Dashboard</Button>
      </div>
    </div>
  )
}
