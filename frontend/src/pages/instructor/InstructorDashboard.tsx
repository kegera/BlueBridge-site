import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, BookOpen, Users, Clock, BarChart2 } from 'lucide-react'
import { useAuthCtx } from '@/contexts/AuthContext'
import { apiFetch } from '@/lib/api'
import { TestCard } from '@/components/portal/TestCard'
import { ResultsChart } from '@/components/portal/ResultsChart'
import { Button } from '@/components/ui/button'
import type { Test, InstructorAnalytics } from '@/types'

export default function InstructorDashboard() {
  const { user } = useAuthCtx()
  const nav = useNavigate()
  const [tests, setTests] = useState<Test[]>([])
  const [analytics, setAnalytics] = useState<InstructorAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiFetch<Test[]>('/tests'),
      apiFetch<InstructorAnalytics>('/analytics/instructor'),
    ]).then(([t, a]) => { setTests(t); setAnalytics(a) }).finally(() => setLoading(false))
  }, [])

  const deleteTest = async (id: number) => {
    if (!confirm('Delete this test?')) return
    await apiFetch(`/tests/${id}`, { method: 'DELETE' })
    setTests(prev => prev.filter(t => t.id !== id))
  }

  const togglePublish = async (id: number, val: boolean) => {
    await apiFetch(`/tests/${id}/publish`, { method: 'PATCH', body: JSON.stringify({ is_published: val }) })
    setTests(prev => prev.map(t => t.id === id ? { ...t, is_published: val } : t))
  }

  const statCards = [
    { icon: <BookOpen size={18} />, label: 'Tests Created', value: analytics?.total_tests ?? 0, color: 'text-primary' },
    { icon: <Users size={18} />, label: 'Total Submissions', value: analytics?.total_submissions ?? 0, color: 'text-teal' },
    { icon: <Clock size={18} />, label: 'Pending Grading', value: analytics?.pending_grading ?? 0, color: 'text-warm' },
    { icon: <BarChart2 size={18} />, label: 'Graded', value: analytics?.graded_submissions ?? 0, color: 'text-primary' },
  ]

  return (
    <div className="min-h-screen bg-bbg">
      <div className="max-w-[1160px] mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading font-extrabold text-navy text-3xl">Instructor Portal</h1>
            <p className="text-muted mt-1">Welcome back, {user?.full_name}</p>
          </div>
          <Button onClick={() => nav('/instructor/tests/new')} className="gap-2"><Plus size={15} /> New Test</Button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map(s => (
            <div key={s.label} className="bg-surface border border-bborder rounded-lg p-5 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-sm bg-current/10 flex items-center justify-center ${s.color}`}>
                <span className={s.color}>{s.icon}</span>
              </div>
              <div>
                <div className="font-heading font-extrabold text-navy text-2xl">{s.value}</div>
                <div className="text-xs text-muted">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Analytics Chart */}
        {analytics && analytics.tests.length > 0 && (
          <div className="bg-surface border border-bborder rounded-lg p-6 mb-8">
            <h2 className="font-heading font-bold text-navy mb-4">Average Score by Test</h2>
            <ResultsChart data={analytics.tests.map(t => ({ name: t.title.slice(0, 20), avg: Math.round(t.avg_pct) }))} />
          </div>
        )}

        {/* Tests */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-navy text-xl">Your Tests</h2>
            <Button variant="outline" size="sm" onClick={() => nav('/instructor/submissions')}>View Submissions</Button>
          </div>
          {loading ? (
            <div className="text-center py-12 text-muted">Loading…</div>
          ) : tests.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-bborder rounded-lg">
              <BookOpen size={40} className="mx-auto text-muted opacity-30 mb-4" />
              <p className="text-muted mb-4">No tests yet. Create your first one.</p>
              <Button onClick={() => nav('/instructor/tests/new')} className="gap-2"><Plus size={14} /> Create Test</Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tests.map(t => <TestCard key={t.id} test={t} role="instructor" onDelete={deleteTest} onTogglePublish={togglePublish} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
