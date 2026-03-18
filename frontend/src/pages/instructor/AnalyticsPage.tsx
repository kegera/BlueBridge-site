import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { ResultsChart } from '@/components/portal/ResultsChart'
import type { InstructorAnalytics } from '@/types'

export default function AnalyticsPage() {
  const nav = useNavigate()
  const [data, setData] = useState<InstructorAnalytics | null>(null)

  useEffect(() => { apiFetch<InstructorAnalytics>('/analytics/instructor').then(setData) }, [])

  return (
    <div className="min-h-screen bg-bbg">
      <div className="max-w-[1000px] mx-auto px-6 py-10">
        <button onClick={() => nav('/instructor')} className="flex items-center gap-2 text-sm text-muted hover:text-navy mb-6"><ArrowLeft size={15} /> Back</button>
        <h1 className="font-heading font-extrabold text-navy text-2xl mb-8">Analytics</h1>
        {data && (
          <>
            <div className="bg-surface border border-bborder rounded-lg p-6 mb-6">
              <h2 className="font-heading font-bold text-navy mb-4">Average Score by Test</h2>
              <ResultsChart data={data.tests.map(t => ({ name: t.title.slice(0, 22), avg: Math.round(t.avg_pct) }))} />
            </div>
            <div className="bg-surface border border-bborder rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-bbg border-b border-bborder">
                  <tr>{['Test', 'Submissions', 'Avg Score'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-bold text-muted uppercase tracking-wider">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {data.tests.map(t => (
                    <tr key={t.test_id} className="border-b border-bborder">
                      <td className="px-4 py-3 text-sm font-medium text-navy">{t.title}</td>
                      <td className="px-4 py-3 text-sm text-muted">{t.submission_count}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-navy">{Math.round(t.avg_pct)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
