import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IMAGE_CATEGORY_ICON_COLOR, type ImageTool } from '@/lib/imageTools'
import { ToolIcon } from '@/components/ToolIcon'

export function ImageToolCard({ tool, index = 0 }: { tool: ImageTool; index?: number }) {
  const content = (
    <>
      <ToolIcon icon={tool.icon} color={IMAGE_CATEGORY_ICON_COLOR[tool.category]} className="group-hover:-translate-y-1 group-hover:scale-110" />
      <div className="mt-4 flex items-center gap-2">
        <h3 className="text-base font-semibold" style={{ color: 'var(--text-h)' }}>
          {tool.label}
        </h3>
        {!tool.ready && (
          <span className="rounded-full px-2 py-0.5 text-[10px] font-medium opacity-50" style={{ background: 'var(--bg-soft)' }}>
            Soon
          </span>
        )}
      </div>
      <p className="mt-1.5 text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
        {tool.description}
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
