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
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl" style={{ color: 'var(--text-h)' }}>
          Every image tool you need. Free. Forever.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-xl leading-relaxed" style={{ color: 'var(--text)' }}>
          No signup, no watermark, no limits. Just pick a tool and go.
        </p>
        <p className="mx-auto mt-2 max-w-2xl text-xl leading-relaxed" style={{ color: 'var(--text)' }}>
          Compress, resize, crop, convert, and edit images, all in your browser, with no software to
          install and no account required.
        </p>
      </motion.div>

      <div className="mb-8 flex flex-wrap justify-center gap-2.5">
        {FILTER_KEYS.map((key) => {
          const isActive = active === key
          const label = key === 'all' ? 'All' : IMAGE_CATEGORY_LABELS[key]
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              className="rounded-full border px-5 py-2 text-[15px] font-medium transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={
                isActive
                  ? { background: 'var(--accent)', borderColor: 'var(--accent)', color: '#fff' }
                  : { borderColor: 'var(--border)', color: 'var(--text-h)', background: 'var(--surface)' }
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
