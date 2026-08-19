import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Image, Code2 } from 'lucide-react'
import { AdSlot } from '@/components/AdSlot'
import { ToolCard } from '@/components/ToolCard'
import { CATEGORIES, CATEGORY_LABELS, toolsByCategory } from '@/lib/tools'

const DISCOVERY_CARDS = [
  {
    to: '/images',
    icon: Image,
    title: 'Image tools',
    description: 'Compress, resize, rotate, and convert images, free and unlimited.',
  },
  {
    to: '/developers',
    icon: Code2,
    title: 'Developer API',
    description: 'Every tool on this site as a REST API, with a dashboard, keys, and webhooks.',
  },
]

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

      <div className="mt-12">
        <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-wide opacity-50">More from CoreHives</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {DISCOVERY_CARDS.map((card) => {
            const Icon = card.icon
            return (
              <Link
                key={card.to}
                to={card.to}
                className="flex items-start gap-4 rounded-2xl border p-5 transition-shadow hover:shadow-lg"
                style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="font-medium" style={{ color: 'var(--text-h)' }}>
                    {card.title}
                  </h3>
                  <p className="mt-1 text-sm opacity-70">{card.description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <AdSlot variant="banner" className="mt-10" />
    </div>
  )
}
