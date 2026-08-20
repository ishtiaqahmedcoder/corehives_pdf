import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Circle, KeyRound, Webhook, BookOpen, ArrowRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { listApiKeys, type ApiKeySummary } from '@/lib/developerApi'
import { DashboardLayout } from '@/components/developers/DashboardLayout'
import { usePageMeta } from '@/hooks/usePageMeta'

function usageColor(pct: number) {
  if (pct >= 90) return '#ef4444'
  if (pct >= 65) return '#d97706'
  return 'var(--accent)'
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
      <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text)', opacity: 0.6 }}>
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold" style={{ color: 'var(--text-h)' }}>
        {value}
      </p>
    </div>
  )
}

function ChecklistItem({ done, label, to }: { done: boolean; label: string; to: string }) {
  return (
    <Link to={to} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-[var(--bg-soft)]">
      {done ? <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: '#16a34a' }} /> : <Circle className="h-4 w-4 shrink-0" style={{ color: 'var(--text)', opacity: 0.4 }} />}
      <span style={{ color: done ? 'var(--text)' : 'var(--text-h)', textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.6 : 1 }}>
        {label}
      </span>
    </Link>
  )
}

export function DashboardConsole() {
  usePageMeta('Console', 'Your PDFHives developer console: key usage at a glance.')
  const { user } = useAuth()
  const [keys, setKeys] = useState<ApiKeySummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listApiKeys()
      .then(setKeys)
      .finally(() => setLoading(false))
  }, [])

  const activeKeys = keys.filter((k) => !k.revoked)
  const totalUsed = activeKeys.reduce((sum, k) => sum + k.files_used_this_period, 0)
  const totalQuota = activeKeys.reduce((sum, k) => sum + k.monthly_quota, 0)
  const hasWebhook = activeKeys.some((k) => !!k.webhook_url)

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-h)' }}>
        Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
      </h1>
      <p className="mt-1 text-sm" style={{ color: 'var(--text)' }}>
        Here's where things stand with your API keys.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Active keys" value={String(activeKeys.length)} />
        <StatCard label="Files this period" value={totalUsed.toLocaleString()} />
        <StatCard label="Combined quota" value={totalQuota.toLocaleString()} />
      </div>

      <div className="mt-6 rounded-2xl border p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-h)' }}>
          Usage by key
        </h2>
        {loading ? (
          <div className="mt-3 space-y-3">
            {[0, 1].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg" style={{ background: 'var(--bg-soft)' }} />
            ))}
          </div>
        ) : activeKeys.length === 0 ? (
          <p className="mt-2 text-sm" style={{ color: 'var(--text)' }}>
            No active keys yet.{' '}
            <Link to="/developers/dashboard/keys" className="font-medium underline" style={{ color: 'var(--accent)' }}>
              Create your first one
            </Link>
            .
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            {activeKeys.map((k) => {
              const pct = Math.min(100, Math.round((k.files_used_this_period / k.monthly_quota) * 100))
              return (
                <div key={k.id}>
                  <div className="flex justify-between text-xs" style={{ color: 'var(--text)' }}>
                    <span className="font-medium" style={{ color: 'var(--text-h)' }}>
                      {k.name}
                    </span>
                    <span>
                      {k.files_used_this_period.toLocaleString()} / {k.monthly_quota.toLocaleString()} ({pct}%)
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'var(--bg-soft)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: usageColor(pct) }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-h)' }}>
            Getting started
          </h2>
          <div className="mt-2 space-y-0.5">
            <ChecklistItem done to="/developers/dashboard/account" label="Create your account" />
            <ChecklistItem done={activeKeys.length > 0} to="/developers/dashboard/keys" label="Create an API key" />
            <ChecklistItem done={hasWebhook} to="/developers/dashboard/webhooks" label="Configure a webhook" />
          </div>
        </div>

        <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-h)' }}>
            Quick links
          </h2>
          <div className="mt-2 space-y-0.5">
            <Link to="/developers/dashboard/keys" className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-[var(--bg-soft)]" style={{ color: 'var(--text-h)' }}>
              <span className="flex items-center gap-2"><KeyRound className="h-4 w-4" /> Manage API keys</span>
              <ArrowRight className="h-3.5 w-3.5 opacity-50" />
            </Link>
            <Link to="/developers/dashboard/webhooks" className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-[var(--bg-soft)]" style={{ color: 'var(--text-h)' }}>
              <span className="flex items-center gap-2"><Webhook className="h-4 w-4" /> Manage webhooks</span>
              <ArrowRight className="h-3.5 w-3.5 opacity-50" />
            </Link>
            <Link to="/developers/docs" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-[var(--bg-soft)]" style={{ color: 'var(--text-h)' }}>
              <span className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> Read the API docs</span>
              <ArrowRight className="h-3.5 w-3.5 opacity-50" />
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
