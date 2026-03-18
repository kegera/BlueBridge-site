import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LogIn, Loader2, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuthCtx } from '@/contexts/AuthContext'
import { apiFetch, ApiError } from '@/lib/api'
import { toast } from '@/lib/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { AuthResponse } from '@/types'

export default function LoginPage() {
  const { login } = useAuthCtx()
  const nav = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!form.email || !form.password) return setErr('Please fill in all fields.')
    setErr(''); setLoading(true)
    try {
      const data = await apiFetch<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(form) })
      login(data.token)
      toast({ title: `Welcome back, ${data.user.full_name.split(' ')[0]}!`, description: 'Login successful', variant: 'success' })
      setTimeout(() => nav(data.user.role === 'instructor' ? '/instructor' : '/student', { replace: true }), 600)
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'Login failed. Try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-bbg flex items-center justify-center px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="w-full max-w-sm">
        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0.7 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
            className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
            <LogIn size={24} className="text-white" />
          </motion.div>
          <h1 className="font-heading font-extrabold text-navy text-2xl">Welcome back</h1>
          <p className="text-sm text-muted mt-1">Log in to your BlueBridge portal</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass rounded-xl p-6 flex flex-col gap-4 shadow-lg border border-bborder">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && submit()} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && submit()} />
          </div>
          {err && (
            <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="text-sm text-destructive bg-destructive/8 border border-destructive/20 rounded-lg p-3">
              {err}
            </motion.p>
          )}
          <Button className="w-full justify-center gap-2" disabled={loading} onClick={submit}>
            {loading
              ? <><Loader2 size={15} className="animate-spin" /> Logging in...</>
              : <><CheckCircle size={15} /> Log in</>}
          </Button>
          <p className="text-center text-sm text-muted">
            No account? <Link to="/register" className="text-primary font-semibold hover:underline">Create one</Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
