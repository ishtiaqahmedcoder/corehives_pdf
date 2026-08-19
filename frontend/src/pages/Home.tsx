import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Image, Code2, Upload, Settings2, Download, ShieldCheck, Infinity as InfinityIcon, Sparkles } from 'lucide-react'
import { AdSlot } from '@/components/AdSlot'
import { ToolCard } from '@/components/ToolCard'
import { ToolIcon, type ToolIconColor } from '@/components/ToolIcon'
import { Faq, type FaqItem } from '@/components/Faq'
import { CATEGORIES, CATEGORY_LABELS, toolsByCategory } from '@/lib/tools'
import { usePageMeta } from '@/hooks/usePageMeta'
import { APP_NAME } from '@/lib/brand'

const DISCOVERY_CARDS = [
  {
    to: '/images',
    icon: Image,
    color: 'fuchsia' as ToolIconColor,
    title: 'Image Tools',
    description: 'Compress, resize, rotate, convert, watermark, and edit images, free and unlimited.',
  },
  {
    to: '/developers',
    icon: Code2,
    color: 'violet' as ToolIconColor,
    title: 'Developer API',
    description: 'Every tool on this site as a REST API, with a dashboard, keys, and webhooks.',
  },
]

const STEPS = [
  { icon: Upload, color: 'sky' as ToolIconColor, title: 'Upload your file', body: 'Drag and drop a PDF or image, or click to browse. Nothing leaves your device until you choose a tool.' },
  { icon: Settings2, color: 'amber' as ToolIconColor, title: 'Pick a tool', body: 'Choose from 35+ PDF and image tools and set any options the tool needs, like a page range or password.' },
  { icon: Download, color: 'emerald' as ToolIconColor, title: 'Download the result', body: 'Your file is ready in seconds. Download it once, and the original is auto-deleted an hour later.' },
]

const STATS = [
  { icon: Sparkles, color: 'fuchsia' as ToolIconColor, label: '35+ tools', body: 'PDF and image tools in one place' },
  { icon: InfinityIcon, color: 'violet' as ToolIconColor, label: 'No limits', body: 'No signup, no watermark, no page caps' },
  { icon: ShieldCheck, color: 'rose' as ToolIconColor, label: '1-hour auto-delete', body: 'Every file is permanently wiped after processing' },
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
          {DISCOVERY_CARDS.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="flex items-start gap-4 rounded-2xl border p-5 transition-shadow hover:shadow-lg"
              style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
            >
              <ToolIcon icon={card.icon} color={card.color} />
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold" style={{ color: 'var(--text-h)' }}>
                  {card.title}
                </h3>
                <p className="mt-1 text-sm" style={{ color: 'var(--text)' }}>
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
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
              <div className="mt-4">
                <ToolIcon icon={step.icon} color={step.color} />
              </div>
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
            <div key={stat.label} className="flex flex-col items-center text-center">
              <ToolIcon icon={stat.icon} color={stat.color} />
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
