import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight } from 'lucide-react'

interface PromoBannerProps {
  eyebrow: string
  title: string
  body: string
  ctaLabel: string
  ctaTo: string
  icon: LucideIcon
  gradient: string
  className?: string
}

export function PromoBanner({ eyebrow, title, body, ctaLabel, ctaTo, icon: Icon, gradient, className = '' }: PromoBannerProps) {
  return (
    <Link
      to={ctaTo}
      className={`group relative flex flex-col items-center gap-8 overflow-hidden rounded-3xl p-8 text-white sm:flex-row sm:p-10 ${className}`}
      style={{ background: gradient }}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full opacity-20"
        style={{ background: 'rgba(255,255,255,0.6)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-16 right-24 h-40 w-40 rounded-full opacity-10"
        style={{ background: 'rgba(255,255,255,0.6)' }}
      />

      <div className="relative min-w-0 flex-1 text-center sm:text-left">
        <span className="text-xs font-semibold uppercase tracking-wide opacity-80">{eyebrow}</span>
        <h3 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h3>
        <p className="mx-auto mt-2 max-w-lg text-[15px] leading-relaxed opacity-90 sm:mx-0">{body}</p>
        <span className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#16141f] transition-transform group-hover:translate-x-0.5">
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>

      <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl" style={{ background: 'rgba(255,255,255,0.16)' }}>
        <Icon className="h-14 w-14" strokeWidth={1.5} />
      </div>
    </Link>
  )
}
