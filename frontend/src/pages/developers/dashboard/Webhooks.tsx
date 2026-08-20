import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Loader2, Webhook as WebhookIcon } from 'lucide-react'
import { listApiKeys, updateApiKeyWebhook, type ApiKeySummary } from '@/lib/developerApi'
import { DashboardLayout } from '@/components/developers/DashboardLayout'
import { usePageMeta } from '@/hooks/usePageMeta'

function apiErrorMessage(err: unknown, fallback: string): string {
  const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
  return message ?? fallback
}

function WebhookRow({ apiKey }: { apiKey: ApiKeySummary }) {
  const [webhook, setWebhook] = useState(apiKey.webhook_url ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function save() {
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      await updateApiKeyWebhook(apiKey.id, webhook)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not save that webhook URL.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-semibold" style={{ color: 'var(--text-h)' }}>
          {apiKey.name}
        </h3>
        <code className="text-xs" style={{ color: 'var(--text)', opacity: 0.6 }}>
          {apiKey.key_prefix}
        </code>
        {apiKey.webhook_url && (
          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ background: 'rgba(34,197,94,0.12)', color: '#16a34a' }}>
            Configured
          </span>
        )}
      </div>
      <p className="mt-1 text-xs" style={{ color: 'var(--text)', opacity: 0.7 }}>
        Called with <code className="font-mono">task.completed</code> / <code className="font-mono">task.failed</code> events whenever a job using this key finishes.
      </p>
      <div className="mt-3 flex gap-2">
        <input
          type="url"
          placeholder="https://yourapp.com/webhooks/pdfhives"
          value={webhook}
          onChange={(e) => setWebhook(e.target.value)}
          className="flex-1 rounded-lg border px-2.5 py-1.5 text-sm outline-none transition-colors focus:border-[var(--accent)]"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
        />
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50"
          style={{ borderColor: saved ? '#16a34a' : 'var(--border)', color: saved ? '#16a34a' : 'var(--text-h)' }}
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saved ? <Check className="h-3.5 w-3.5" /> : null}
          {saving ? 'Saving…' : saved ? 'Saved' : 'Save'}
        </button>
      </div>
      {error && (
        <p className="mt-1.5 text-xs" style={{ color: '#ef4444' }}>
          {error}
        </p>
      )}
    </div>
  )
}

export function DashboardWebhooks() {
  usePageMeta('Webhooks', 'Configure webhook URLs for your PDFHives API keys.')
  const [keys, setKeys] = useState<ApiKeySummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listApiKeys()
      .then(setKeys)
      .finally(() => setLoading(false))
  }, [])

  const activeKeys = keys.filter((k) => !k.revoked)

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-h)' }}>
        Webhooks
      </h1>
      <p className="mt-1 text-sm" style={{ color: 'var(--text)' }}>
        Each API key can notify one URL the moment its jobs finish, instead of you polling for status.
      </p>

      <div className="mt-6">
        {loading ? (
          <div className="space-y-3">
            {[0, 1].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl border" style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)' }} />
            ))}
          </div>
        ) : activeKeys.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed p-10 text-center" style={{ borderColor: 'var(--border)' }}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: 'var(--accent-soft)' }}>
              <WebhookIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
            </div>
            <p className="mt-3 text-sm font-medium" style={{ color: 'var(--text-h)' }}>
              No active keys to attach a webhook to
            </p>
            <p className="mt-1 text-sm" style={{ color: 'var(--text)' }}>
              <Link to="/developers/dashboard/keys" className="font-medium underline" style={{ color: 'var(--accent)' }}>
                Create an API key
              </Link>{' '}
              first, then come back here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeKeys.map((k) => (
              <WebhookRow key={k.id} apiKey={k} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
