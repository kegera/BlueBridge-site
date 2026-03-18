import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UserPlus, Loader2 } from 'lucide-react'
import { useAuthCtx } from '@/contexts/AuthContext'
import { apiFetch, ApiError } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { AuthResponse } from '@/types'

export default function RegisterPage() {
  const { login } = useAuthCtx()
  const nav = useNavigate()
  const [form, setForm] = useState({ full_name: '', email: '', password: '', role: 'student' as 'student' | 'instructor' })
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!form.full_name || !form.email || !form.password) return setErr('Please fill in all fields.')
    if (form.password.length < 6) return setErr('Password must be at least 6 characters.')
    setErr(''); setLoading(true)
    try {
      const data = await apiFetch<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(form) })
      login(data.token)
      nav(data.user.role === 'instructor' ? '/instructor' : '/student', { replace: true })
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'Registration failed. Try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-bbg flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-sm gradient-teal flex items-center justify-center mx-auto mb-4">
            <UserPlus size={22} className="text-white" />
          </div>
          <h1 className="font-heading font-extrabold text-navy text-2xl">Create account</h1>
          <p className="text-sm text-muted mt-1">Join the BlueBridge learning platform</p>
        </div>
        <div className="glass rounded-lg p-6 flex flex-col gap-4">
          {[
            { label: 'Full Name', key: 'full_name', type: 'text', placeholder: 'Sharon Ndinda' },
            { label: 'Email', key: 'email', type: 'email', placeholder: 'you@example.com' },
            { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
          ].map(f => (
            <div key={f.key} className="flex flex-col gap-1.5">
              <Label>{f.label}</Label>
              <Input type={f.type} placeholder={f.placeholder} value={(form as Record<string,string>)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
            </div>
          ))}
          {/* Role */}
          <div className="flex flex-col gap-1.5">
            <Label>I am a…</Label>
            <div className="flex gap-2">
              {(['student', 'instructor'] as const).map(r => (
                <button key={r} onClick={() => setForm(p => ({ ...p, role: r }))}
                  className={`flex-1 py-2.5 rounded border text-sm font-semibold transition-all ${form.role === r ? 'bg-navy text-white border-navy' : 'border-bborder text-muted hover:border-navy'}`}>
                  {r === 'student' ? 'Student' : 'Instructor'}
                </button>
              ))}
            </div>
          </div>
          {err && <p className="text-sm text-destructive bg-destructive/8 border border-destructive/20 rounded p-3">{err}</p>}
          <Button className="w-full justify-center gap-2" disabled={loading} onClick={submit}>
            {loading ? <><Loader2 size={15} className="animate-spin" /> Creating account…</> : 'Create account'}
          </Button>
          <p className="text-center text-sm text-muted">
            Already registered? <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
