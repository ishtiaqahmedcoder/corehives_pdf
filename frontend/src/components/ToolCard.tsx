import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { CATEGORY_ICON_COLOR, type Tool } from '@/lib/tools'
import { ToolIcon } from '@/components/ToolIcon'

interface ToolCardProps {
  tool: Tool
  index?: number
}

export function ToolCard({ tool, index = 0 }: ToolCardProps) {
  const { t } = useTranslation()

  const content = (
    <>
      <ToolIcon icon={tool.icon} color={CATEGORY_ICON_COLOR[tool.category]} className="group-hover:-translate-y-1 group-hover:scale-110" />
      <div className="mt-4 flex items-center gap-2">
        <h3 className="text-base font-semibold" style={{ color: 'var(--text-h)' }}>
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
      <p className="mt-1.5 text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
        {t(`tools.${tool.slug}.description`, tool.description)}
      </p>
    </>
  )

  const className = `group block rounded-2xl border p-5 transition-shadow ${tool.ready ? 'hover:shadow-lg' : 'cursor-not-allowed opacity-60'}`
  const style = { borderColor: 'var(--border)', background: 'var(--surface)' }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
      whileHover={tool.ready ? { y: -3 } : undefined}
      className="h-full"
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
