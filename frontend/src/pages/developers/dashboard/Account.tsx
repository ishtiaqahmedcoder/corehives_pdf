import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { updateProfile } from '@/lib/developerApi'
import { DashboardLayout } from '@/components/developers/DashboardLayout'
import { usePageMeta } from '@/hooks/usePageMeta'

function apiErrorMessage(err: unknown, fallback: string): string {
  const message =
    (err as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response?.data?.errors?.email?.[0] ??
    (err as { response?: { data?: { message?: string } } })?.response?.data?.message
  return message ?? fallback
}

export function DashboardAccount() {
  usePageMeta('My Account', 'Manage your PDFHives developer account details.')
  const { user, setUser } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const updated = await updateProfile(name.trim(), email.trim())
      setUser(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not save your changes.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-h)' }}>
        My Account
      </h1>
      <p className="mt-1 text-sm" style={{ color: 'var(--text)' }}>
        Update the name and email associated with your developer account.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-md space-y-4 rounded-2xl border p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <div>
          <label className="mb-1.5 block text-sm font-semibold" style={{ color: 'var(--text-h)' }}>
            Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--accent)]"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold" style={{ color: 'var(--text-h)' }}>
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--accent)]"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
          />
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 overflow-hidden rounded-lg p-2.5 text-sm"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50"
          style={{ background: 'var(--accent)' }}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle2 className="h-4 w-4" /> : null}
          {saving ? 'Saving…' : saved ? 'Saved' : 'Save changes'}
        </button>
      </form>
    </DashboardLayout>
  )
}
