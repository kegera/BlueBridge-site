import { useState } from 'react'
import { Plus, Trash2, GripVertical, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface QOption { id: string; body: string; is_correct: boolean }
export interface QDraft { id: string; body: string; question_type: 'mcq' | 'open'; points: number; options: QOption[] }

interface Props { questions: QDraft[]; onChange: (qs: QDraft[]) => void }

const newId = () => Math.random().toString(36).slice(2)

export function QuestionBuilder({ questions, onChange }: Props) {
  const addQ = () => onChange([...questions, { id: newId(), body: '', question_type: 'mcq', points: 1, options: [{ id: newId(), body: '', is_correct: true }, { id: newId(), body: '', is_correct: false }] }])
  const removeQ = (id: string) => onChange(questions.filter(q => q.id !== id))
  const updateQ = (id: string, patch: Partial<QDraft>) => onChange(questions.map(q => q.id === id ? { ...q, ...patch } : q))
  const addOption = (qid: string) => updateQ(qid, { options: [...questions.find(q => q.id === qid)!.options, { id: newId(), body: '', is_correct: false }] })
  const removeOption = (qid: string, oid: string) => { const q = questions.find(x => x.id === qid)!; updateQ(qid, { options: q.options.filter(o => o.id !== oid) }) }
  const updateOption = (qid: string, oid: string, patch: Partial<QOption>) => { const q = questions.find(x => x.id === qid)!; updateQ(qid, { options: q.options.map(o => o.id === oid ? { ...o, ...patch } : o) }) }
  const setCorrect = (qid: string, oid: string) => { const q = questions.find(x => x.id === qid)!; updateQ(qid, { options: q.options.map(o => ({ ...o, is_correct: o.id === oid })) }) }

  return (
    <div className="flex flex-col gap-4">
      {questions.map((q, qi) => (
        <div key={q.id} className="border border-bborder rounded-lg p-5 bg-white flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <GripVertical size={16} className="text-muted" />
              <span className="font-semibold text-navy text-sm">Question {qi + 1}</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Type toggle */}
              <div className="flex border border-bborder rounded-sm overflow-hidden text-xs">
                {(['mcq', 'open'] as const).map(t => (
                  <button key={t} onClick={() => updateQ(q.id, { question_type: t, options: t === 'mcq' ? [{ id: newId(), body: '', is_correct: true }, { id: newId(), body: '', is_correct: false }] : [] })}
                    className={cn('px-3 py-1.5 font-medium transition-colors', q.question_type === t ? 'bg-navy text-white' : 'text-muted hover:text-navy')}>
                    {t === 'mcq' ? 'MCQ' : 'Open'}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <Label className="text-xs">Pts</Label>
                <Input type="number" min={1} max={100} value={q.points} onChange={e => updateQ(q.id, { points: +e.target.value })} className="w-14 h-7 text-xs px-2" />
              </div>
              <button onClick={() => removeQ(q.id)} className="text-muted hover:text-destructive transition-colors"><Trash2 size={15} /></button>
            </div>
          </div>
          <Textarea value={q.body} onChange={e => updateQ(q.id, { body: e.target.value })} placeholder="Question text…" className="min-h-[80px]" />
          {q.question_type === 'mcq' && (
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Options (click circle to mark correct)</Label>
              {q.options.map(o => (
                <div key={o.id} className="flex items-center gap-2">
                  <button onClick={() => setCorrect(q.id, o.id)} className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all', o.is_correct ? 'bg-teal border-teal' : 'border-bborder hover:border-teal')}>
                    {o.is_correct && <Check size={11} className="text-white" />}
                  </button>
                  <Input value={o.body} onChange={e => updateOption(q.id, o.id, { body: e.target.value })} placeholder={`Option ${q.options.indexOf(o) + 1}`} className="flex-1 h-8 text-sm" />
                  <button onClick={() => removeOption(q.id, o.id)} className="text-muted hover:text-destructive transition-colors"><Trash2 size={13} /></button>
                </div>
              ))}
              <Button size="sm" variant="outline" className="gap-1 self-start mt-1" onClick={() => addOption(q.id)}><Plus size={12} /> Add option</Button>
            </div>
          )}
          {q.question_type === 'open' && <p className="text-xs text-muted italic">Students will type their answer. You grade this manually.</p>}
        </div>
      ))}
      <Button variant="outline" className="gap-2 self-start" onClick={addQ}><Plus size={15} /> Add Question</Button>
    </div>
  )
}
