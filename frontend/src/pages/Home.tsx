import { useState } from 'react'
import { motion } from 'framer-motion'
import { AdSlot } from '@/components/AdSlot'
import { ToolCard } from '@/components/ToolCard'
import { CATEGORIES, CATEGORY_LABELS, toolsByCategory } from '@/lib/tools'

const FILTERS: { key: 'all' | (typeof CATEGORIES)[number]; label: string }[] = [
  { key: 'all', label: 'All' },
  ...CATEGORIES.map((c) => ({ key: c, label: CATEGORY_LABELS[c] })),
]

export function Home() {
  const [active, setActive] = useState<(typeof FILTERS)[number]['key']>('all')
  const tools = toolsByCategory(active)

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10 text-center"
      >
        <h1 className="text-4xl font-semibold" style={{ color: 'var(--text-h)' }}>
          Every PDF tool you need. Free. Forever.
        </h1>
        <p className="mt-3 text-lg opacity-70">
          No signup, no watermark, no page limits — just pick a tool and go.
        </p>
      </motion.div>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {FILTERS.map((f) => {
          const isActive = active === f.key
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setActive(f.key)}
              className="rounded-full border px-4 py-1.5 text-sm font-medium transition-colors"
              style={
                isActive
                  ? { background: 'var(--accent)', borderColor: 'var(--accent)', color: '#fff' }
                  : { borderColor: 'var(--border)', color: 'var(--text)' }
              }
            >
              {f.label}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, i) => (
          <ToolCard key={tool.slug} tool={tool} index={i} />
        ))}
      </div>

      <AdSlot variant="banner" className="mt-10" />
    </div>
  )
}
