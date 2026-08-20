import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, CheckCircle2, AlertCircle, Eye, EyeOff, Lock } from 'lucide-react'
import { updatePassword } from '@/lib/developerApi'
import { DashboardLayout } from '@/components/developers/DashboardLayout'
import { usePageMeta } from '@/hooks/usePageMeta'

function apiErrorMessage(err: unknown, fallback: string): string {
  const message =
    (err as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response?.data?.errors?.current_password?.[0] ??
    (err as { response?: { data?: { message?: string } } })?.response?.data?.message
  return message ?? fallback
}

function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  autoComplete: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold" style={{ color: 'var(--text-h)' }}>
        {label}
      </label>
      <div className="relative">
        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--text)', opacity: 0.5 }} />
        <input
          type={show ? 'text' : 'password'}
          required
          minLength={8}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border py-2.5 pl-9 pr-10 text-sm outline-none transition-colors focus:border-[var(--accent)]"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--text)', opacity: 0.5 }}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}

export function DashboardSecurity() {
  usePageMeta('Security', 'Change your PDFHives developer account password.')
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== passwordConfirmation) {
      setError('New password and confirmation do not match.')
      return
    }
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      await updatePassword(currentPassword, password, passwordConfirmation)
      setCurrentPassword('')
      setPassword('')
      setPasswordConfirmation('')
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not update your password.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-h)' }}>
        Security
      </h1>
      <p className="mt-1 text-sm" style={{ color: 'var(--text)' }}>
        Change the password used to log in to your developer dashboard.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-md space-y-4 rounded-2xl border p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <PasswordField label="Current password" value={currentPassword} onChange={setCurrentPassword} autoComplete="current-password" />
        <PasswordField label="New password" value={password} onChange={setPassword} autoComplete="new-password" />
        <PasswordField label="Confirm new password" value={passwordConfirmation} onChange={setPasswordConfirmation} autoComplete="new-password" />

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
          {saving ? 'Updating…' : saved ? 'Updated' : 'Update password'}
        </button>
      </form>
    </DashboardLayout>
  )
}
