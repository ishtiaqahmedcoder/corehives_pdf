import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import { AdSlot } from '@/components/AdSlot'
import { ImageToolCard } from '@/components/ImageToolCard'
import { PromoBanner } from '@/components/PromoBanner'
import { IMAGE_CATEGORIES, IMAGE_CATEGORY_LABELS, imageToolsByCategory } from '@/lib/imageTools'
import { usePageMeta } from '@/hooks/usePageMeta'

const FILTER_KEYS: ('all' | (typeof IMAGE_CATEGORIES)[number])[] = ['all', ...IMAGE_CATEGORIES]

export function Images() {
  usePageMeta(
    'Free Image Tools Online',
    'Compress, resize, crop, convert, watermark, and edit images for free. No signup, no watermark, no limits.',
  )
  const [active, setActive] = useState<(typeof FILTER_KEYS)[number]>('all')
  const tools = imageToolsByCategory(active)

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10 text-center"
      >
        <h1 className="text-4xl font-semibold" style={{ color: 'var(--text-h)' }}>
          Every image tool you need. Free. Forever.
        </h1>
        <p className="mt-3 text-lg" style={{ color: 'var(--text)' }}>
          No signup, no watermark, no limits. Just pick a tool and go.
        </p>
      </motion.div>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {FILTER_KEYS.map((key) => {
          const isActive = active === key
          const label = key === 'all' ? 'All' : IMAGE_CATEGORY_LABELS[key]
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              className="rounded-full border px-4 py-1.5 text-sm font-medium transition-colors"
              style={
                isActive
                  ? { background: 'var(--accent)', borderColor: 'var(--accent)', color: '#fff' }
                  : { borderColor: 'var(--border)', color: 'var(--text)' }
              }
            >
              {label}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {tools.map((tool, i) => (
          <ImageToolCard key={tool.slug} tool={tool} index={i} />
        ))}
      </div>

      <PromoBanner
        eyebrow="Also on PDFHives"
        title="Need PDF tools too?"
        body="Merge, split, compress, convert, and sign PDFs with the same free, no-signup experience as the image tools above."
        ctaLabel="Browse PDF tools"
        ctaTo="/"
        icon={FileText}
        gradient="linear-gradient(135deg, #0284c7, #0f766e)"
        className="mt-10"
      />

      <AdSlot variant="banner" className="mt-10" />
    </div>
  )
}
