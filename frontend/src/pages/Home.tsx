import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Image, Code2, Upload, Settings2, Download, ShieldCheck, Infinity as InfinityIcon, Sparkles, ChevronDown } from 'lucide-react'
import { AdSlot } from '@/components/AdSlot'
import { ToolCard } from '@/components/ToolCard'
import { Faq, type FaqItem } from '@/components/Faq'
import { CATEGORIES, CATEGORY_LABELS, toolsByCategory } from '@/lib/tools'
import { IMAGE_TOOLS, IMAGE_CATEGORY_ICON_COLOR } from '@/lib/imageTools'
import { ToolIcon } from '@/components/ToolIcon'
import { usePageMeta } from '@/hooks/usePageMeta'
import { APP_NAME } from '@/lib/brand'

const DISCOVERY_CARDS = [
  {
    icon: Image,
    title: 'Image Tools',
    description: 'Compress, resize, rotate, convert, watermark, and edit images, free and unlimited. Click to see all 13 tools.',
    expandable: true as const,
  },
  {
    to: '/developers',
    icon: Code2,
    title: 'Developer API',
    description: 'Every tool on this site as a REST API, with a dashboard, keys, and webhooks.',
    expandable: false as const,
  },
]

const STEPS = [
  { icon: Upload, title: 'Upload your file', body: 'Drag and drop a PDF or image, or click to browse. Nothing leaves your device until you choose a tool.' },
  { icon: Settings2, title: 'Pick a tool', body: 'Choose from 35+ PDF and image tools and set any options the tool needs, like a page range or password.' },
  { icon: Download, title: 'Download the result', body: 'Your file is ready in seconds. Download it once, and the original is auto-deleted an hour later.' },
]

const STATS = [
  { icon: Sparkles, label: '35+ tools', body: 'PDF and image tools in one place' },
  { icon: InfinityIcon, label: 'No limits', body: 'No signup, no watermark, no page caps' },
  { icon: ShieldCheck, label: '1-hour auto-delete', body: 'Every file is permanently wiped after processing' },
]

const FAQ_ITEMS: FaqItem[] = [
  {
    question: `Is ${APP_NAME} really free?`,
    answer: `Yes. Every PDF and image tool on ${APP_NAME} is completely free, with no signup, no watermark, and no hidden page or file-size caps beyond fair-use limits. The site is funded by ads, not by charging you.`,
  },
  {
    question: 'Do I need to create an account?',
    answer: 'No. Every tool works instantly without registering. An account is only needed if you want to use the Developer API to integrate tools into your own product.',
  },
  {
    question: 'What happens to the files I upload?',
    answer: 'Your files are processed to run the tool you selected, then automatically and permanently deleted from our servers one hour later. We never read, sell, or share their contents.',
  },
  {
    question: 'Is there a limit to how many files I can process?',
    answer: "There's no limit on the number of tools you can run. Individual tools have generous fair-use limits on file size and requests per hour, to keep the service fast and usable for everyone.",
  },
  {
    question: 'Can I use these tools on my phone?',
    answer: 'Yes. Every tool works in any modern browser on desktop, tablet, or mobile, with no app to install.',
  },
  {
    question: 'Can I use PDFHives tools in my own app?',
    answer: 'Yes. The Developer API exposes every tool as a REST endpoint with a free tier, API keys, quotas, and webhooks, so you can integrate PDF and image processing directly into your own product.',
  },
]

const FILTER_KEYS: ('all' | (typeof CATEGORIES)[number])[] = ['all', ...CATEGORIES]

export function Home() {
  const { t } = useTranslation()
  usePageMeta(
    'Free PDF & Image Tools Online',
    'Merge, split, compress, convert, and edit PDFs and images for free. No signup, no watermark, no file limits.',
  )
  const [active, setActive] = useState<(typeof FILTER_KEYS)[number]>('all')
  const tools = toolsByCategory(active)
  const [imagesOpen, setImagesOpen] = useState(false)

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
        <p className="mt-3 text-lg" style={{ color: 'var(--text)' }}>
          {t('home.subtitle')}
        </p>
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
                  : { borderColor: 'var(--border)', color: 'var(--text-h)' }
              }
            >
              {label}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {tools.map((tool, i) => (
          <ToolCard key={tool.slug} tool={tool} index={i} />
        ))}
      </div>

      <section className="mt-16">
        <h2 className="text-center text-3xl font-semibold" style={{ color: 'var(--text-h)' }}>
          More from {APP_NAME}
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-base" style={{ color: 'var(--text)' }}>
          {APP_NAME} isn't just PDFs. A full image toolkit and a developer API live right alongside it.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {DISCOVERY_CARDS.map((card) => {
            const Icon = card.icon
            const cardStyle = { borderColor: 'var(--border)', background: 'var(--surface)' }
            const inner = (
              <>
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold" style={{ color: 'var(--text-h)' }}>
                    {card.title}
                  </h3>
                  <p className="mt-1 text-sm" style={{ color: 'var(--text)' }}>
                    {card.description}
                  </p>
                </div>
                {card.expandable && (
                  <ChevronDown
                    className="mt-1 h-5 w-5 shrink-0 transition-transform"
                    style={{ color: 'var(--accent)', transform: imagesOpen ? 'rotate(180deg)' : undefined }}
                  />
                )}
              </>
            )

            if (card.expandable) {
              return (
                <button
                  key={card.title}
                  type="button"
                  onClick={() => setImagesOpen((o) => !o)}
                  aria-expanded={imagesOpen}
                  className="flex items-start gap-4 rounded-2xl border p-5 text-left transition-shadow hover:shadow-lg"
                  style={cardStyle}
                >
                  {inner}
                </button>
              )
            }

            return (
              <Link key={card.title} to={card.to!} className="flex items-start gap-4 rounded-2xl border p-5 transition-shadow hover:shadow-lg" style={cardStyle}>
                {inner}
              </Link>
            )
          })}
        </div>

        <AnimatePresence>
          {imagesOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 rounded-2xl border p-5" style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)' }}>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {IMAGE_TOOLS.map((tool) => (
                    <Link
                      key={tool.slug}
                      to={tool.to}
                      className="flex items-center gap-2.5 rounded-xl border p-2.5 transition-shadow hover:shadow-md"
                      style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
                    >
                      <ToolIcon icon={tool.icon} color={IMAGE_CATEGORY_ICON_COLOR[tool.category]} size="sm" />
                      <span className="text-sm font-medium" style={{ color: 'var(--text-h)' }}>
                        {tool.label}
                      </span>
                    </Link>
                  ))}
                </div>
                <Link to="/images" className="mt-4 inline-block text-sm font-medium" style={{ color: 'var(--accent)' }}>
                  See all image tools →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <AdSlot variant="banner" className="mt-12" />

      <section className="mt-16">
        <h2 className="text-center text-3xl font-semibold" style={{ color: 'var(--text-h)' }}>
          How it works
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-base" style={{ color: 'var(--text)' }}>
          Three steps, no learning curve. Every tool on {APP_NAME} follows the same simple flow.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative rounded-2xl border p-6" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white"
                style={{ background: 'var(--accent)' }}
              >
                {i + 1}
              </span>
              <step.icon className="mt-4 h-6 w-6" style={{ color: 'var(--accent)' }} strokeWidth={1.75} />
              <h3 className="mt-3 text-base font-semibold" style={{ color: 'var(--text-h)' }}>
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-3xl border p-8 sm:p-10" style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)' }}>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="mx-auto h-6 w-6" style={{ color: 'var(--accent)' }} strokeWidth={1.75} />
              <p className="mt-3 text-2xl font-semibold" style={{ color: 'var(--text-h)' }}>
                {stat.label}
              </p>
              <p className="mt-1 text-sm" style={{ color: 'var(--text)' }}>
                {stat.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-center text-3xl font-semibold" style={{ color: 'var(--text-h)' }}>
          Frequently asked questions
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-base" style={{ color: 'var(--text)' }}>
          Everything you need to know before you get started.
        </p>
        <div className="mt-8">
          <Faq items={FAQ_ITEMS} />
        </div>
      </section>
    </div>
  )
}
