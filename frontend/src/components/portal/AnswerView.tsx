import { CheckCircle, XCircle, Minus } from 'lucide-react'
import type { Answer } from '@/types'

export function AnswerView({ answer, index }: { answer: Answer; index: number }) {
  const { question, is_correct, open_text, selected_option, points_awarded, instructor_comment } = answer
  return (
    <div className="border border-bborder rounded-lg p-5 bg-white flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <span className="text-xs font-bold uppercase tracking-wider text-muted">Q{index + 1} · {question?.question_type === 'mcq' ? 'Multiple Choice' : 'Open Ended'}</span>
          <p className="font-semibold text-navy mt-1">{question?.body}</p>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold">
          {is_correct === true && <span className="flex items-center gap-1 text-teal"><CheckCircle size={14} /> Correct</span>}
          {is_correct === false && <span className="flex items-center gap-1 text-destructive"><XCircle size={14} /> Incorrect</span>}
          {is_correct === null && <span className="flex items-center gap-1 text-muted"><Minus size={14} /> Pending</span>}
          {points_awarded != null && <span className="ml-2 text-navy">+{points_awarded}pts</span>}
        </div>
      </div>
      <div className={`rounded p-3 text-sm ${is_correct === true ? 'bg-teal/8 border border-teal/20 text-teal' : is_correct === false ? 'bg-destructive/8 border border-destructive/20 text-destructive' : 'bg-accent border border-bborder text-text'}`}>
        {question?.question_type === 'mcq' ? (selected_option?.body ?? '—') : (open_text ?? '—')}
      </div>
      {instructor_comment && (
        <div className="bg-primary/5 border border-primary/20 rounded p-3 text-sm text-navy">
          <span className="font-semibold text-xs text-primary uppercase tracking-wider">Instructor feedback:</span>
          <p className="mt-1">{instructor_comment}</p>
        </div>
      )}
    </div>
  )
}
