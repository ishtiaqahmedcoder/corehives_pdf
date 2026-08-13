import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { AdSlot } from '@/components/AdSlot'
import { ToolCard } from '@/components/ToolCard'
import { CATEGORIES, CATEGORY_LABELS, toolsByCategory } from '@/lib/tools'

const FILTER_KEYS: ('all' | (typeof CATEGORIES)[number])[] = ['all', ...CATEGORIES]

export function Home() {
  const { t } = useTranslation()
  const [active, setActive] = useState<(typeof FILTER_KEYS)[number]>('all')
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
          {t('home.title')}
        </h1>
        <p className="mt-3 text-lg opacity-70">{t('home.subtitle')}</p>
      </motion.div>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {FILTER_KEYS.map((key) => {
          const isActive = active === key
          const label = key === 'all' ? t('categories.all') : t(`categories.${key}`, CATEGORY_LABELS[key])
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, i) => (
          <ToolCard key={tool.slug} tool={tool} index={i} />
        ))}
      </div>

      <AdSlot variant="banner" className="mt-10" />
    </div>
  )
}
