import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Trash2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import {
  createApiKey,
  listApiKeys,
  revokeApiKey,
  updateApiKeyWebhook,
  type ApiKeySummary,
} from '@/lib/developerApi'

function KeyRow({ apiKey, onRevoke }: { apiKey: ApiKeySummary; onRevoke: (id: number) => void }) {
  const [webhook, setWebhook] = useState(apiKey.webhook_url ?? '')
  const [saving, setSaving] = useState(false)
  const usagePct = Math.min(100, Math.round((apiKey.files_used_this_period / apiKey.monthly_quota) * 100))

  async function saveWebhook() {
    setSaving(true)
    try {
      await updateApiKeyWebhook(apiKey.id, webhook)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium" style={{ color: 'var(--text-h)' }}>
            {apiKey.name}
          </h3>
          <code className="text-xs opacity-60">{apiKey.key_prefix}</code>
          <span
            className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
          >
            {apiKey.plan}
          </span>
        </div>
        {!apiKey.revoked && (
          <button
            type="button"
            onClick={() => onRevoke(apiKey.id)}
            className="flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs text-red-500"
            style={{ borderColor: 'var(--border)' }}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Revoke
          </button>
        )}
      </div>

      <div className="mt-3">
        <div className="flex justify-between text-xs opacity-60">
          <span>
            {apiKey.files_used_this_period} / {apiKey.monthly_quota} files this period
          </span>
          <span>Resets {new Date(apiKey.period_reset_at).toLocaleDateString()}</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'var(--bg-soft)' }}>
          <div className="h-full rounded-full" style={{ width: `${usagePct}%`, background: 'var(--accent)' }} />
        </div>
      </div>

      {!apiKey.revoked && (
        <div className="mt-3 flex gap-2">
          <input
            type="url"
            placeholder="Webhook URL (optional): https://yourapp.com/webhooks/corehives"
            value={webhook}
            onChange={(e) => setWebhook(e.target.value)}
            className="flex-1 rounded-lg border px-2.5 py-1.5 text-xs outline-none"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
          />
          <button
            type="button"
            onClick={saveWebhook}
            disabled={saving}
            className="rounded-lg border px-3 py-1.5 text-xs"
            style={{ borderColor: 'var(--border)' }}
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      )}
    </div>
  )
}

export function DeveloperDashboard() {
  const { user, logout } = useAuth()
  const [keys, setKeys] = useState<ApiKeySummary[]>([])
  const [loading, setLoading] = useState(true)
  const [newKeyName, setNewKeyName] = useState('')
  const [creating, setCreating] = useState(false)
  const [freshKey, setFreshKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function load() {
    setLoading(true)
    setKeys(await listApiKeys())
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleCreate() {
    if (!newKeyName.trim()) return
    setCreating(true)
    try {
      const { rawKey } = await createApiKey(newKeyName.trim())
      setFreshKey(rawKey)
      setNewKeyName('')
      await load()
    } finally {
      setCreating(false)
    }
  }

  async function handleRevoke(id: number) {
    if (!window.confirm('Revoke this key? Requests using it will stop working immediately.')) return
    await revokeApiKey(id)
    await load()
  }

  function copyKey() {
    if (!freshKey) return
    navigator.clipboard.writeText(freshKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-h)' }}>
            Developer dashboard
          </h1>
          <p className="text-sm opacity-70">{user?.email}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/developers/docs" className="rounded-full border px-3 py-1.5 text-sm" style={{ borderColor: 'var(--border)' }}>
            API Docs
          </Link>
          <button
            type="button"
            onClick={() => logout()}
            className="rounded-full border px-3 py-1.5 text-sm"
            style={{ borderColor: 'var(--border)' }}
          >
            Log out
          </button>
        </div>
      </div>

      <AnimatePresence>
        {freshKey && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden rounded-2xl border p-4"
            style={{ borderColor: 'var(--accent)', background: 'var(--accent-soft)' }}
          >
            <p className="text-sm font-medium" style={{ color: 'var(--text-h)' }}>
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
            <button type="button" onClick={() => setFreshKey(null)} className="mt-2 text-xs underline opacity-70">
              Done, hide this
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Key name, e.g. Production server"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
          className="flex-1 rounded-xl border px-3 py-2.5 text-sm outline-none"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
        />
        <button
          type="button"
          onClick={handleCreate}
          disabled={creating || !newKeyName.trim()}
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40"
          style={{ background: 'var(--accent)' }}
        >
          {creating ? 'Creating…' : '+ New key'}
        </button>
      </div>

      {loading ? (
        <p className="py-10 text-center text-sm opacity-60">Loading…</p>
      ) : keys.length === 0 ? (
        <p className="py-10 text-center text-sm opacity-60">No API keys yet. Create one above to get started.</p>
      ) : (
        <div className="space-y-3">
          {keys.map((k) => (
            <KeyRow key={k.id} apiKey={k} onRevoke={handleRevoke} />
          ))}
        </div>
      )}
    </div>
  )
}
