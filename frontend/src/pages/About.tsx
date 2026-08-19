import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShieldCheck, Zap, Globe2 } from 'lucide-react'
import { usePageMeta } from '@/hooks/usePageMeta'

const VALUES = [
  {
    icon: Zap,
    title: 'Free, forever',
    body: 'Every tool works without an account, a watermark, or a paywall. We keep the lights on with ads, not with your wallet.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy by default',
    body: 'Your files are auto-deleted an hour after processing. We never read or sell what you upload.',
  },
  {
    icon: Globe2,
    title: 'Built for everyone',
    body: 'Starting with English and expanding to Urdu, Hindi, and more, because PDF tools shouldn’t require English fluency.',
  },
]

export function About() {
  usePageMeta('About Us', 'PDFHives is a free, ad-supported home for everyday PDF and image tools, built by CoreHives.')

  return (
    <div className="mx-auto max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
        <h1 className="text-3xl font-semibold" style={{ color: 'var(--text-h)' }}>
          About PDFHives
        </h1>
        <p className="mt-3 opacity-70">
          PDFHives is a free, ad-supported home for everyday PDF and image tools, built by{' '}
          <a href="https://corehives.com" target="_blank" rel="noreferrer" className="underline" style={{ color: 'var(--accent)' }}>
            CoreHives
          </a>
          , a small software company that believes everyday tools shouldn't cost money or your
          data.
        </p>
      </motion.div>

      <div className="space-y-4">
        {VALUES.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex gap-4 rounded-2xl border p-5"
            style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
            >
              <v.icon className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="font-medium" style={{ color: 'var(--text-h)' }}>
                {v.title}
              </h2>
              <p className="mt-1 text-sm opacity-70">{v.body}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 text-center text-sm opacity-70">
        Questions or feedback?{' '}
        <Link to="/contact" className="underline" style={{ color: 'var(--accent)' }}>
          Get in touch
        </Link>
        .
      </div>
    </div>
  )
}
