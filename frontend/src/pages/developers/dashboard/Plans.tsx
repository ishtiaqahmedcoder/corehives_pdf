import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { listApiKeys, type ApiKeySummary } from '@/lib/developerApi'
import { DEVELOPER_PLANS } from '@/lib/apiKeyPlans'
import { DashboardLayout } from '@/components/developers/DashboardLayout'
import { usePageMeta } from '@/hooks/usePageMeta'

export function DashboardPlans() {
  usePageMeta('Plans & Packages', 'Compare PDFHives API plans and see the quota on each of your keys.')
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
        Plans & Packages
      </h1>
      <p className="mt-1 text-sm" style={{ color: 'var(--text)' }}>
        Every account starts on Free. Paid plans are launching soon.
      </p>

      {!loading && activeKeys.length > 0 && (
        <div className="mt-6 rounded-2xl border p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-h)' }}>
            Your keys
          </h2>
          <div className="mt-2 space-y-2">
            {activeKeys.map((k) => (
              <div key={k.id} className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--text-h)' }}>{k.name}</span>
                <span className="flex items-center gap-2" style={{ color: 'var(--text)' }}>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                    {k.plan}
                  </span>
                  {k.monthly_quota.toLocaleString()} files / month
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {DEVELOPER_PLANS.map((plan) => {
          const isCurrent = activeKeys.some((k) => k.plan === plan.key)
          return (
            <div
              key={plan.key}
              className="relative rounded-2xl border p-5"
              style={{ borderColor: plan.highlight ? 'var(--accent)' : 'var(--border)', background: 'var(--surface)' }}
            >
              {isCurrent && (
                <span className="absolute -top-2.5 right-4 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white" style={{ background: 'var(--accent)' }}>
                  Current
                </span>
              )}
              <h3 className="font-semibold" style={{ color: 'var(--text-h)' }}>
                {plan.name}
              </h3>
              <p className="mt-1 text-2xl font-bold" style={{ color: 'var(--text-h)' }}>
                {plan.price}
              </p>
              <p className="text-sm" style={{ color: 'var(--text)' }}>
                {plan.quota.toLocaleString()} files / month
              </p>
              <ul className="mt-4 space-y-1.5 text-sm" style={{ color: 'var(--text)' }}>
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--accent)' }} />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled
                className="mt-4 w-full rounded-xl border py-2 text-sm font-semibold disabled:opacity-50"
                style={{ borderColor: 'var(--border)', color: 'var(--text-h)' }}
                title="Paid plans are launching soon"
              >
                {plan.key === 'free' ? 'Included' : 'Coming soon'}
              </button>
            </div>
          )
        })}
      </div>
    </DashboardLayout>
  )
}
