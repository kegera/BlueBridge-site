import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface DataPoint { name: string; avg: number }

export function ResultsChart({ data }: { data: DataPoint[] }) {
  if (!data.length) return <div className="text-sm text-muted text-center py-8">No data yet.</div>
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#5A6A8A' }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#5A6A8A' }} unit="%" />
        <Tooltip formatter={(v: number) => [`${v}%`, 'Avg Score']} contentStyle={{ borderRadius: '12px', border: '1px solid #E2E9FF', fontFamily: 'Plus Jakarta Sans' }} />
        <Bar dataKey="avg" radius={[6, 6, 0, 0]}>
          {data.map((_, i) => <Cell key={i} fill={i % 2 === 0 ? '#1E5EFF' : '#11B5A4'} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
