import { type ReactNode } from 'react'
import { motion } from 'framer-motion'

export function ContentPage({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-semibold" style={{ color: 'var(--text-h)' }}>
          {title}
        </h1>
        {subtitle && <p className="mt-2 opacity-70">{subtitle}</p>}
      </motion.div>

      <div className="content-prose space-y-5 text-sm leading-relaxed opacity-90">{children}</div>
    </div>
  )
}

export function ContentSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-base font-semibold" style={{ color: 'var(--text-h)' }}>
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}
