import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Award, TrendingUp } from 'lucide-react'
import { useAuthCtx } from '@/contexts/AuthContext'
import { apiFetch } from '@/lib/api'
import { TestCard } from '@/components/portal/TestCard'
import { Badge } from '@/components/ui/badge'
import type { Test, StudentAnalytics } from '@/types'

export default function StudentDashboard() {
  const { user } = useAuthCtx()
  const nav = useNavigate()
  const [tests, setTests] = useState<Test[]>([])
  const [analytics, setAnalytics] = useState<StudentAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiFetch<Test[]>('/tests?published=1'),
      apiFetch<StudentAnalytics>('/analytics/student'),
    ]).then(([t, a]) => { setTests(t); setAnalytics(a) }).finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-bbg">
      <div className="max-w-[1160px] mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-heading font-extrabold text-navy text-3xl">Student Portal</h1>
          <p className="text-muted mt-1">Welcome, {user?.full_name}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { icon: <BookOpen size={18} />, label: 'Tests Taken', value: analytics?.tests_taken ?? 0, color: 'text-primary' },
            { icon: <TrendingUp size={18} />, label: 'Avg Score', value: analytics ? `${Math.round(analytics.avg_score_pct)}%` : '—', color: 'text-teal' },
            { icon: <Award size={18} />, label: 'Available Tests', value: tests.length, color: 'text-warm' },
          ].map(s => (
            <div key={s.label} className="bg-surface border border-bborder rounded-lg p-5 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-sm bg-current/10 flex items-center justify-center ${s.color}`}><span className={s.color}>{s.icon}</span></div>
              <div><div className="font-heading font-extrabold text-navy text-2xl">{s.value}</div><div className="text-xs text-muted">{s.label}</div></div>
            </div>
          ))}
        </div>

        {/* Available Tests */}
        <div className="mb-10">
          <h2 className="font-heading font-bold text-navy text-xl mb-4">Available Tests</h2>
          {loading ? <div className="text-center py-10 text-muted">Loading…</div> :
            tests.length === 0 ? <div className="text-center py-12 border border-dashed border-bborder rounded-lg text-muted">No tests published yet. Check back soon!</div> :
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tests.map(t => <TestCard key={t.id} test={t} role="student" />)}
            </div>
          }
        </div>

        {/* History */}
        {analytics && analytics.history.length > 0 && (
          <div>
            <h2 className="font-heading font-bold text-navy text-xl mb-4">My Results</h2>
            <div className="bg-surface border border-bborder rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-bbg border-b border-bborder">
                  <tr>{['Test', 'Type', 'Date', 'Score', 'Status'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-bold text-muted uppercase tracking-wider">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {analytics.history.map((h, i) => (
                    <tr key={i} className="border-b border-bborder hover:bg-accent/40 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-navy">{h.test_title}</td>
                      <td className="px-4 py-3"><Badge variant="outline">{h.exam_type}</Badge></td>
                      <td className="px-4 py-3 text-xs text-muted">{new Date(h.submitted_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-navy">{Math.round(h.pct)}%</td>
                      <td className="px-4 py-3"><Badge variant={h.status === 'graded' ? 'success' : 'warm'}>{h.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
