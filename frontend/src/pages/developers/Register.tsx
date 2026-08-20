import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { AuthLayout } from '@/components/developers/AuthLayout'

export function DeveloperRegister() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await register(name, email, password)
      navigate('/developers/dashboard')
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } })?.response?.data
          ?.errors?.email?.[0] ??
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Could not create your account.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-sm">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-h)' }}>
          Create a developer account
        </h1>
        <p className="mt-1.5 text-[15px]" style={{ color: 'var(--text)' }}>
          Get an API key and start integrating in minutes.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold" style={{ color: 'var(--text-h)' }}>
              Name
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--text)', opacity: 0.5 }} />
              <input
                type="text"
                required
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm outline-none transition-colors focus:border-[var(--accent)]"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold" style={{ color: 'var(--text-h)' }}>
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--text)', opacity: 0.5 }} />
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm outline-none transition-colors focus:border-[var(--accent)]"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold" style={{ color: 'var(--text-h)' }}>
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--text)', opacity: 0.5 }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border py-2.5 pl-9 pr-10 text-sm outline-none transition-colors focus:border-[var(--accent)]"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text)', opacity: 0.5 }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-lg px-3 py-2 text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50"
            style={{ background: 'var(--accent)' }}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Creating…
              </>
            ) : (
              <>
                Create account <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: 'var(--text)' }}>
          Already have an account?{' '}
          <Link to="/developers/login" className="font-semibold underline" style={{ color: 'var(--accent)' }}>
            Log in
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  )
}
