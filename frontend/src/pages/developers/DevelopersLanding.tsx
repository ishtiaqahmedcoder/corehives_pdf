import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { ApiKey } from '@/lib/apiKeyPlans'

const PLANS = [
  { name: 'Free', price: '$0', quota: ApiKey.free, features: ['All 22 PDF tools', 'Webhooks', 'Community support'] },
  { name: 'Starter', price: '$19/mo', quota: ApiKey.starter, features: ['Everything in Free', 'Priority queue', 'Email support'], highlight: true },
  { name: 'Pro', price: '$79/mo', quota: ApiKey.pro, features: ['Everything in Starter', 'Highest priority queue', 'Priority support'] },
]

export function DevelopersLanding() {
  return (
    <div className="mx-auto max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
        <h1 className="text-4xl font-semibold" style={{ color: 'var(--text-h)' }}>
          CoreHives PDF API
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-lg opacity-70">
          Every tool on this site, available as a simple REST API. Merge, split, compress, convert,
          sign, and more — integrate PDF processing into your own product in minutes.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/developers/register"
            className="rounded-xl px-5 py-2.5 font-medium text-white"
            style={{ background: 'var(--accent)' }}
          >
            Get your API key
          </Link>
          <Link to="/developers/docs" className="rounded-xl border px-5 py-2.5 font-medium" style={{ borderColor: 'var(--border)', color: 'var(--text-h)' }}>
            Read the docs
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border p-5"
            style={{
              borderColor: plan.highlight ? 'var(--accent)' : 'var(--border)',
              background: 'var(--surface)',
            }}
          >
            <h2 className="font-medium" style={{ color: 'var(--text-h)' }}>
              {plan.name}
            </h2>
            <p className="mt-1 text-2xl font-semibold" style={{ color: 'var(--text-h)' }}>
              {plan.price}
            </p>
            <p className="text-sm opacity-60">{plan.quota.toLocaleString()} files / month</p>
            <ul className="mt-4 space-y-1.5 text-sm opacity-80">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--accent)' }} />
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <p className="mt-6 text-center text-xs opacity-50">
        Paid plans are launching soon — every account starts on Free today.
      </p>
    </div>
  )
}
