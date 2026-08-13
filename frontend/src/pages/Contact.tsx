import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'

export function Contact() {
  return (
    <div className="mx-auto max-w-md text-center">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
        >
          <Mail className="h-6 w-6" strokeWidth={1.75} />
        </div>
        <h1 className="text-3xl font-semibold" style={{ color: 'var(--text-h)' }}>
          Get in touch
        </h1>
        <p className="mt-3 opacity-70">
          Found a bug, have a feature request, or just want to say hi? We read every email.
        </p>

        <a
          href="mailto:hello@corehives.com"
          className="mt-6 inline-flex items-center justify-center rounded-xl px-6 py-3 font-medium text-white"
          style={{ background: 'var(--accent)' }}
        >
          hello@corehives.com
        </a>

        <p className="mt-4 text-xs opacity-50">We typically reply within 1-2 business days.</p>
      </motion.div>
    </div>
  )
}
