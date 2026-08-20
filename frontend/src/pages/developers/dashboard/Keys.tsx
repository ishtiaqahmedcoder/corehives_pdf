import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Trash2, KeyRound, AlertCircle, Plus, Loader2, Clock } from 'lucide-react'
import {
  createApiKey,
  listApiKeys,
  revokeApiKey,
  type ApiKeySummary,
} from '@/lib/developerApi'
import { DashboardLayout } from '@/components/developers/DashboardLayout'
import { usePageMeta } from '@/hooks/usePageMeta'

function apiErrorMessage(err: unknown, fallback: string): string {
  const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
  return message ?? fallback
}

function usageColor(pct: number) {
  if (pct >= 90) return '#ef4444'
  if (pct >= 65) return '#d97706'
  return 'var(--accent)'
}

function relativeTime(iso: string | null): string {
  if (!iso) return 'Never used'
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

function KeyRow({ apiKey, onRevoke }: { apiKey: ApiKeySummary; onRevoke: (id: number) => Promise<void> }) {
  const [revoking, setRevoking] = useState(false)
  const usagePct = Math.min(100, Math.round((apiKey.files_used_this_period / apiKey.monthly_quota) * 100))

  async function handleRevokeClick() {
    setRevoking(true)
    try {
      await onRevoke(apiKey.id)
    } finally {
      setRevoking(false)
    }
  }

  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ background: apiKey.revoked ? 'var(--bg-soft)' : 'var(--accent-soft)' }}
          >
            <KeyRound className="h-[18px] w-[18px]" style={{ color: apiKey.revoked ? 'var(--text)' : 'var(--accent)', opacity: apiKey.revoked ? 0.5 : 1 }} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold" style={{ color: 'var(--text-h)' }}>
                {apiKey.name}
              </h3>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                style={{
                  background: apiKey.revoked ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.12)',
                  color: apiKey.revoked ? '#ef4444' : '#16a34a',
                }}
              >
                {apiKey.revoked ? 'Revoked' : 'Active'}
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
              >
                {apiKey.plan}
              </span>
            </div>
            <code className="mt-0.5 block text-xs" style={{ color: 'var(--text)', opacity: 0.6 }}>
              {apiKey.key_prefix}
            </code>
          </div>
        </div>
        {!apiKey.revoked && (
          <button
            type="button"
            onClick={handleRevokeClick}
            disabled={revoking}
            className="flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/5 disabled:opacity-50"
            style={{ borderColor: 'var(--border)' }}
          >
            {revoking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            Revoke
          </button>
        )}
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs" style={{ color: 'var(--text)', opacity: 0.7 }}>
          <span>
            {apiKey.files_used_this_period.toLocaleString()} / {apiKey.monthly_quota.toLocaleString()} files this period
          </span>
          <span>Resets {new Date(apiKey.period_reset_at).toLocaleDateString()}</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'var(--bg-soft)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${usagePct}%`, background: usageColor(usagePct) }} />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-xs" style={{ color: 'var(--text)', opacity: 0.6 }}>
        <Clock className="h-3.5 w-3.5" />
        Last used: {relativeTime(apiKey.last_used_at)}
      </div>
    </div>
  )
}

export function DashboardKeys() {
  usePageMeta('API Keys', 'Create and manage your PDFHives API keys.')
  const [keys, setKeys] = useState<ApiKeySummary[]>([])
  const [loading, setLoading] = useState(true)
  const [newKeyName, setNewKeyName] = useState('')
  const [creating, setCreating] = useState(false)
  const [freshKey, setFreshKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      setKeys(await listApiKeys())
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not load your API keys.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleCreate() {
    if (!newKeyName.trim()) return
    setCreating(true)
    setError(null)
    try {
      const { rawKey } = await createApiKey(newKeyName.trim())
      setFreshKey(rawKey)
      setNewKeyName('')
      await load()
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not create that key. Please try again.'))
    } finally {
      setCreating(false)
    }
  }

  async function handleRevoke(id: number) {
    if (!window.confirm('Revoke this key? Requests using it will stop working immediately.')) return
    setError(null)
    try {
      await revokeApiKey(id)
      await load()
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not revoke that key.'))
    }
  }

  function copyKey() {
    if (!freshKey) return
    navigator.clipboard.writeText(freshKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-h)' }}>
        API Keys
      </h1>
      <p className="mt-1 text-sm" style={{ color: 'var(--text)' }}>
        Create keys to authenticate requests to the PDFHives API.
      </p>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 flex items-start gap-2 overflow-hidden rounded-xl p-3 text-sm"
            style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="flex-1">{error}</span>
            <button type="button" onClick={() => setError(null)} className="shrink-0 font-medium underline">
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {freshKey && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden rounded-2xl border p-4"
            style={{ borderColor: 'var(--accent)', background: 'var(--accent-soft)' }}
          >
            <p className="text-sm font-semibold" style={{ color: 'var(--text-h)' }}>
              Copy your key now. You won't be able to see it again.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <code className="flex-1 overflow-x-auto rounded-lg border bg-black/5 px-2.5 py-2 text-xs" style={{ borderColor: 'var(--border)' }}>
                {freshKey}
              </code>
              <button
                type="button"
                onClick={copyKey}
                className="flex shrink-0 items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-white"
                style={{ background: 'var(--accent)' }}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <button type="button" onClick={() => setFreshKey(null)} className="mt-2 text-xs font-medium underline" style={{ color: 'var(--text-h)', opacity: 0.7 }}>
              Done, hide this
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 rounded-2xl border p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <label className="mb-1.5 block text-sm font-semibold" style={{ color: 'var(--text-h)' }}>
          Create a new key
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Key name, e.g. Production server"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            className="flex-1 rounded-xl border px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--accent)]"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
          />
          <button
            type="button"
            onClick={handleCreate}
            disabled={creating || !newKeyName.trim()}
            className="flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-40"
            style={{ background: 'var(--accent)' }}
          >
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {creating ? 'Creating…' : 'New key'}
          </button>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="space-y-3">
            {[0, 1].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl border" style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)' }} />
            ))}
          </div>
        ) : keys.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed p-10 text-center" style={{ borderColor: 'var(--border)' }}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: 'var(--accent-soft)' }}>
              <KeyRound className="h-5 w-5" style={{ color: 'var(--accent)' }} />
            </div>
            <p className="mt-3 text-sm font-medium" style={{ color: 'var(--text-h)' }}>
              No API keys yet
            </p>
            <p className="mt-1 text-sm" style={{ color: 'var(--text)' }}>
              Create one above to start calling the API.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {keys.map((k) => (
              <KeyRow key={k.id} apiKey={k} onRevoke={handleRevoke} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
