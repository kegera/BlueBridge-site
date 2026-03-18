import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { SubmissionRow } from '@/components/portal/SubmissionRow'
import type { Submission } from '@/types'

export default function SubmissionsPage() {
  const nav = useNavigate()
  const [subs, setSubs] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => { apiFetch<Submission[]>('/submissions').then(setSubs).finally(() => setLoading(false)) }, [])

  const filtered = filter === 'all' ? subs : subs.filter(s => s.status === filter)

  return (
    <div className="min-h-screen bg-bbg">
      <div className="max-w-[1160px] mx-auto px-6 py-10">
        <button onClick={() => nav('/instructor')} className="flex items-center gap-2 text-sm text-muted hover:text-navy mb-6"><ArrowLeft size={15} /> Back to Dashboard</button>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading font-extrabold text-navy text-2xl">Submissions</h1>
          <div className="flex gap-2">
            {['all', 'submitted', 'graded'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-sm text-sm font-medium transition-all ${filter === f ? 'bg-navy text-white' : 'border border-bborder text-muted hover:border-navy'}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-surface border border-bborder rounded-lg overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-muted">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted">No submissions yet.</div>
          ) : (
            <table className="w-full">
              <thead className="bg-bbg border-b border-bborder">
                <tr>{['Student', 'Test', 'Date', 'Status', 'Score', 'Action'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-bold text-muted uppercase tracking-wider">{h}</th>)}</tr>
              </thead>
              <tbody>{filtered.map(s => <SubmissionRow key={s.id} s={s} />)}</tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
