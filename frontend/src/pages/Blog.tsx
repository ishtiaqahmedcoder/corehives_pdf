import { motion } from 'framer-motion'
import { Newspaper } from 'lucide-react'
import { usePageMeta } from '@/hooks/usePageMeta'

export function Blog() {
  usePageMeta('Blog', 'Guides, product updates, and tips for getting more out of PDFHives.')

  return (
    <div className="mx-auto max-w-md text-center">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
        >
          <Newspaper className="h-6 w-6" strokeWidth={1.75} />
        </div>
        <h1 className="text-3xl font-semibold" style={{ color: 'var(--text-h)' }}>
          The blog is coming soon
        </h1>
        <p className="mt-3 opacity-70">
          We're working on guides, product updates, and PDF tips. Check back soon.
        </p>
      </motion.div>
    </div>
  )
}
