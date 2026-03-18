import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2, Play, Eye, Clock, BookOpen } from 'lucide-react'
import type { Test } from '@/types'
import { useNavigate } from 'react-router-dom'

interface Props { test: Test; role: 'instructor' | 'student'; onDelete?: (id: number) => void; onTogglePublish?: (id: number, val: boolean) => void }

export function TestCard({ test, role, onDelete, onTogglePublish }: Props) {
  const nav = useNavigate()
  return (
    <div className="bg-surface border border-bborder rounded-lg p-5 flex flex-col gap-3 hover:border-primary/40 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={test.exam_type === 'IELTS' ? 'default' : test.exam_type === 'TOEFL' ? 'teal' : 'warm'}>{test.exam_type}</Badge>
            {role === 'instructor' && <Badge variant={test.is_published ? 'success' : 'outline'}>{test.is_published ? 'Published' : 'Draft'}</Badge>}
          </div>
          <h3 className="font-heading font-bold text-navy">{test.title}</h3>
          {test.description && <p className="text-sm text-muted mt-0.5 line-clamp-2">{test.description}</p>}
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted">
        {test.question_count !== undefined && <span className="flex items-center gap-1"><BookOpen size={12} /> {test.question_count} questions</span>}
        {test.time_limit && <span className="flex items-center gap-1"><Clock size={12} /> {test.time_limit} min</span>}
      </div>
      <div className="flex gap-2 pt-1">
        {role === 'instructor' ? (
          <>
            <Button size="sm" variant="outline" className="gap-1" onClick={() => nav(`/instructor/tests/${test.id}`)}><Edit2 size={12} /> Edit</Button>
            <Button size="sm" variant={test.is_published ? 'outline' : 'teal'} className="gap-1" onClick={() => onTogglePublish?.(test.id, !test.is_published)}><Eye size={12} /> {test.is_published ? 'Unpublish' : 'Publish'}</Button>
            <Button size="sm" variant="outline" className="text-destructive hover:text-destructive gap-1 ml-auto" onClick={() => onDelete?.(test.id)}><Trash2 size={12} /></Button>
          </>
        ) : (
          <Button size="sm" className="gap-1" onClick={() => nav(`/student/tests/${test.id}`)}><Play size={12} /> Take Test</Button>
        )}
      </div>
    </div>
  )
}
