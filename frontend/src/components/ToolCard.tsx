import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { CATEGORY_STYLES, type Tool } from '@/lib/tools'

interface ToolCardProps {
  tool: Tool
  index?: number
}

export function ToolCard({ tool, index = 0 }: ToolCardProps) {
  const { t } = useTranslation()
  const Icon = tool.icon
  const badgeClass = CATEGORY_STYLES[tool.category]

  const content = (
    <>
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${badgeClass}`}>
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <h3 className="font-medium" style={{ color: 'var(--text-h)' }}>
          {t(`tools.${tool.slug}.label`, tool.label)}
        </h3>
        {tool.category === 'exclusive' && (
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
          >
            {t('common.freeForever')}
          </span>
        )}
        {!tool.ready && tool.category !== 'exclusive' && (
          <span className="rounded-full px-2 py-0.5 text-[10px] font-medium opacity-50" style={{ background: 'var(--bg-soft)' }}>
            {t('common.soon')}
          </span>
        )}
      </div>
      <p className="mt-1 text-sm opacity-70">{t(`tools.${tool.slug}.description`, tool.description)}</p>
    </>
  )

  const className = `block rounded-2xl border p-5 transition-shadow ${tool.ready ? 'hover:shadow-lg' : 'cursor-not-allowed opacity-60'}`
  const style = { borderColor: 'var(--border)', background: 'var(--surface)' }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
      whileHover={tool.ready ? { y: -3 } : undefined}
    >
      {tool.ready ? (
        <Link to={tool.to} className={className} style={style}>
          {content}
        </Link>
      ) : (
        <div className={className} style={style} aria-disabled>
          {content}
        </div>
      )}
    </motion.div>
  )
}
