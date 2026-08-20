import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight } from 'lucide-react'

interface PromoBannerProps {
  eyebrow: string
  title: string
  body: string
  ctaLabel: string
  ctaTo: string
  ctaNewTab?: boolean
  icon: LucideIcon
  gradient: string
  languages?: string[]
  className?: string
}

export function PromoBanner({ eyebrow, title, body, ctaLabel, ctaTo, ctaNewTab, icon: Icon, gradient, languages, className = '' }: PromoBannerProps) {
  return (
    <div
      className={`relative flex flex-col items-center gap-8 overflow-hidden rounded-3xl p-8 text-white shadow-xl sm:flex-row sm:p-10 ${className}`}
      style={{ background: gradient, boxShadow: '0 20px 45px -20px rgba(0,0,0,0.35)' }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-20"
        style={{ background: 'rgba(255,255,255,0.6)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-20 right-28 h-44 w-44 rounded-full opacity-10"
        style={{ background: 'rgba(255,255,255,0.6)' }}
      />

      <div className="relative min-w-0 flex-1 text-center sm:text-left">
        <span className="text-xs font-semibold uppercase tracking-wide opacity-80">{eyebrow}</span>
        <h3 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h3>
        <p className="mx-auto mt-2 max-w-lg text-[15px] leading-relaxed opacity-90 sm:mx-0">{body}</p>

        {languages && languages.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <span className="text-xs font-medium uppercase tracking-wide opacity-70">SDK-free support for</span>
            {languages.map((lang) => (
              <span
                key={lang}
                className="rounded-lg px-2.5 py-1 text-xs font-semibold"
                style={{ background: 'rgba(255,255,255,0.16)' }}
              >
                {lang}
              </span>
            ))}
          </div>
        )}

        <Link
          to={ctaTo}
          {...(ctaNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="group mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#16141f] transition-transform hover:-translate-y-0.5"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl" style={{ background: 'rgba(255,255,255,0.16)' }}>
        <Icon className="h-14 w-14" strokeWidth={1.5} />
      </div>
    </div>
  )
}
