import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Clock, ChevronRight, Loader2, CheckCircle, Trophy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { apiFetch } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { Test, Question, Submission } from '@/types'

interface StartResp { submission_id: number; test: Test }

export default function TakeTestPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const [sub, setSub] = useState<StartResp | null>(null)
  const [answers, setAnswers] = useState<Record<number, { selected_option_id?: number; open_text?: string }>>({})
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    apiFetch<StartResp>('/submissions', { method: 'POST', body: JSON.stringify({ test_id: +id! }) })
      .then(r => { setSub(r); if (r.test.time_limit) setTimeLeft(r.test.time_limit * 60) })
      .finally(() => setLoading(false))
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [id])

  useEffect(() => {
    if (timeLeft === null) return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t !== null && t <= 1) { clearInterval(timerRef.current!); handleSubmit(); return 0 }
        return t !== null ? t - 1 : null
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  }, [timeLeft !== null])

  const handleSubmit = async () => {
    if (!sub || submitting) return
    setSubmitting(true)
    const payload = Object.entries(answers).map(([qid, a]) => ({ question_id: +qid, ...a }))
    try {
      // API returns full Submission object with `id` field (not submission_id)
      const res = await apiFetch<Submission>(`/submissions/${sub.submission_id}/submit`, {
        method: 'POST',
        body: JSON.stringify({ answers: payload }),
      })
      clearInterval(timerRef.current!)
      setSubmitted(res)
      setTimeout(() => nav(`/student/results/${res.id}`, { replace: true }), 2800)
    } finally { setSubmitting(false) }
  }

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  const questions: Question[] = sub?.test.questions ?? []
  const answeredCount = Object.keys(answers).length

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      <p className="text-muted text-sm">Starting your test...</p>
    </div>
  )
  if (!sub) return <div className="flex items-center justify-center h-screen text-muted">Could not load test.</div>

  return (
    <>
      <AnimatePresence>
        {submitted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 z-[9999] bg-navy/90 backdrop-blur-md flex items-center justify-center px-6">
            <motion.div initial={{ scale: 0.7, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.1 }}
              className="text-center max-w-sm">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.2 }}
                className="w-24 h-24 rounded-full bg-teal/20 border-2 border-teal flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={48} className="text-teal" />
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                className="font-heading font-extrabold text-white text-3xl mb-2">Test Submitted!</motion.h2>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
                className="text-white/70 text-base mb-1">{sub.test.title}</motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
                className="text-white/40 text-sm mb-8">{answeredCount} of {questions.length} answered - Loading results...</motion.p>
              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 2.4, ease: 'linear' }}
                className="h-1 bg-gradient-to-r from-teal to-primary rounded-full origin-left" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-bbg">
        <div className="sticky top-0 z-50 glass-nav border-b border-bborder px-4 md:px-6 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="font-heading font-bold text-navy text-sm truncate">{sub.test.title}</div>
            <div className="text-xs text-muted">{answeredCount}/{questions.length} answered</div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {timeLeft !== null && (
              <div className={`flex items-center gap-1.5 font-mono font-bold text-sm px-3 py-1.5 rounded-sm ${timeLeft < 300 ? 'bg-destructive/10 text-destructive animate-pulse' : 'bg-bbg text-navy'}`}>
                <Clock size={13} /> {fmt(timeLeft)}
              </div>
            )}
            <Button size="sm" disabled={submitting || !!submitted} onClick={handleSubmit} className="gap-1">
              {submitting ? <Loader2 size={13} className="animate-spin" /> : <ChevronRight size={13} />}
              <span className="hidden sm:inline">Submit Test</span>
              <span className="sm:hidden">Submit</span>
            </Button>
          </div>
        </div>

        <div className="max-w-[720px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
          <div className="w-full bg-bborder rounded-full h-1.5 overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-primary to-teal rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${questions.length ? (answeredCount / questions.length) * 100 : 0}%` }}
              transition={{ duration: 0.3 }} />
          </div>

          {questions.map((q, qi) => (
            <motion.div key={q.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: qi * 0.06 }}
              className="bg-surface border border-bborder rounded-xl p-5 md:p-6 shadow-sm">
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted bg-bbg px-2.5 py-1 rounded-full">
                  <span className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold">{qi + 1}</span>
                  {q.question_type === 'mcq' ? 'Multiple Choice' : 'Open Ended'} - {q.points}pt{q.points !== 1 ? 's' : ''}
                </span>
                <p className="font-semibold text-navy mt-3 leading-relaxed">{q.body}</p>
              </div>
              {q.question_type === 'mcq' ? (
                <div className="flex flex-col gap-2">
                  {q.options.map((o, oi) => {
                    const selected = answers[q.id]?.selected_option_id === o.id
                    const letters = ['A','B','C','D','E']
                    return (
                      <motion.button key={o.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        onClick={() => setAnswers(prev => ({ ...prev, [q.id]: { selected_option_id: o.id } }))}
                        className={`flex items-center gap-3 p-4 rounded-xl border text-sm text-left transition-all ${selected ? 'border-primary bg-primary/5 text-navy font-semibold shadow-sm' : 'border-bborder hover:border-primary/40 hover:bg-accent/50 text-foreground'}`}>
                        <span className={`w-7 h-7 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs font-bold transition-all ${selected ? 'border-primary bg-primary text-white' : 'border-muted/50 text-muted'}`}>
                          {selected ? 'v' : letters[oi]}
                        </span>
                        {o.body}
                      </motion.button>
                    )
                  })}
                </div>
              ) : (
                <Textarea placeholder="Type your answer here..." value={answers[q.id]?.open_text ?? ''}
                  onChange={e => setAnswers(prev => ({ ...prev, [q.id]: { open_text: e.target.value } }))}
                  className="min-h-[140px] resize-none" />
              )}
            </motion.div>
          ))}

          <Button size="lg" className="w-full justify-center gap-2 mt-2" disabled={submitting || !!submitted} onClick={handleSubmit}>
            {submitting ? <><Loader2 size={15} className="animate-spin" /> Submitting...</> : <><Trophy size={15} /> Submit Test</>}
          </Button>
        </div>
      </div>
    </>
  )
}
