import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { APP_NAME } from '@/lib/brand'

const FEATURES = [
  'Every PDF and image tool, available as a REST API',
  '100 files a month, free, no credit card required',
  'Webhooks, so you never have to poll for a result',
]

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="mx-auto grid max-w-4xl grid-cols-1 overflow-hidden rounded-3xl border shadow-2xl lg:grid-cols-2"
      style={{ borderColor: 'var(--border)', background: 'var(--surface)', boxShadow: '0 30px 60px -25px rgba(0,0,0,0.35)' }}
    >
      <div
        className="relative hidden flex-col justify-between gap-10 overflow-hidden p-10 text-white lg:flex"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #4338ca)' }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-20" style={{ background: 'rgba(255,255,255,0.6)' }} />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-44 w-44 rounded-full opacity-10" style={{ background: 'rgba(255,255,255,0.6)' }} />

        <Link to="/" className="relative flex items-center gap-2.5 font-semibold">
          <Logo className="h-7 w-7" />
          <span>{APP_NAME}</span>
        </Link>

        <div className="relative">
          <h2 className="text-2xl font-bold leading-snug tracking-tight">Every PDF and image tool, one simple API.</h2>
          <ul className="mt-6 space-y-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-[15px] leading-relaxed opacity-90">
                <Check className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs opacity-70">Built on real open-source PDF and image tooling, not a black-box wrapper.</p>
      </div>

      <div className="flex flex-col justify-center p-8 sm:p-10">{children}</div>
    </div>
  )
}
