import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import type { Submission } from '@/types'

export function SubmissionRow({ s }: { s: Submission }) {
  const nav = useNavigate()
  const pct = s.max_score > 0 && s.total_score != null ? Math.round((s.total_score / s.max_score) * 100) : null
  return (
    <tr className="border-b border-bborder hover:bg-accent/40 transition-colors">
      <td className="px-4 py-3 text-sm font-medium text-navy">{s.student_name ?? '—'}</td>
      <td className="px-4 py-3 text-sm text-muted">{s.test_title ?? '—'}</td>
      <td className="px-4 py-3 text-xs text-muted">{s.submitted_at ? new Date(s.submitted_at).toLocaleDateString() : '—'}</td>
      <td className="px-4 py-3">
        <Badge variant={s.status === 'graded' ? 'success' : s.status === 'submitted' ? 'warm' : 'outline'}>{s.status}</Badge>
      </td>
      <td className="px-4 py-3 text-sm font-semibold text-navy">{pct != null ? `${pct}%` : '—'}</td>
      <td className="px-4 py-3">
        <Button size="sm" variant="outline" onClick={() => nav(`/instructor/submissions/${s.id}/grade`)}>{s.status === 'graded' ? 'View' : 'Grade'}</Button>
      </td>
    </tr>
  )
}
