import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import type { Answer } from '@/types'

interface Props {
  answer: Answer
  index: number
  value: { points: number; comment: string }
  onChange: (v: { points: number; comment: string }) => void
}

export function GradeInput({ answer, index, value, onChange }: Props) {
  const maxPts = answer.question?.points ?? 1
  return (
    <div className="border border-bborder rounded-lg p-5 bg-white flex flex-col gap-3">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-muted">Open Q{index + 1}</span>
        <p className="font-semibold text-navy mt-1">{answer.question?.body}</p>
      </div>
      <div className="bg-accent border border-bborder rounded p-3 text-sm text-text italic">{answer.open_text || '(no answer)'}</div>
      <div className="flex gap-4 items-end">
        <div className="flex flex-col gap-1">
          <Label className="text-xs">Points (max {maxPts})</Label>
          <Input type="number" min={0} max={maxPts} value={value.points} onChange={e => onChange({ ...value, points: Math.min(+e.target.value, maxPts) })} className="w-24 h-8 text-sm" />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <Label className="text-xs">Feedback (optional)</Label>
          <Textarea value={value.comment} onChange={e => onChange({ ...value, comment: e.target.value })} placeholder="Leave feedback for the student…" className="min-h-[72px] text-sm" />
        </div>
      </div>
    </div>
  )
}
