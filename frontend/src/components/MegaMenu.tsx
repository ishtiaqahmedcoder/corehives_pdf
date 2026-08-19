import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { ChevronDown } from 'lucide-react'
import { ToolIcon, type ToolIconColor } from '@/components/ToolIcon'

interface MegaMenuTool {
  slug: string
  label: string
  to: string
  icon: LucideIcon
  ready: boolean
}

export function MegaMenu<C extends string>({
  label,
  categories,
  categoryLabels,
  categoryIconColor,
  toolsByCategory,
}: {
  label: string
  categories: readonly C[]
  categoryLabels: Record<C, string>
  categoryIconColor: Record<C, ToolIconColor>
  toolsByCategory: (category: C) => MegaMenuTool[]
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  function openNow() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }

  function closeSoon() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpen(false), 150)
  }

  return (
    <div ref={rootRef} className="relative" onMouseEnter={openNow} onMouseLeave={closeSoon}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium"
        style={{ color: open ? 'var(--accent)' : 'var(--text-h)' }}
        aria-expanded={open}
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-x-0 top-[61px] z-50 w-full border-b shadow-2xl"
            style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
          >
            <div className="grid max-h-[70vh] grid-cols-2 gap-x-6 gap-y-5 overflow-y-auto px-6 py-6 sm:grid-cols-3 lg:px-10 xl:grid-cols-5">
              {categories.map((category) => (
                <div key={category}>
                  <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-h)', opacity: 0.6 }}>
                    {categoryLabels[category]}
                  </h3>
                  <ul className="space-y-1">
                    {toolsByCategory(category).map((tool) => {
                      const rowClass = tool.ready ? 'hover:bg-[var(--bg-soft)]' : 'cursor-not-allowed opacity-50'
                      const row = (
                        <span className={`flex items-center gap-2 rounded-lg px-1.5 py-1.5 text-sm ${rowClass}`}>
                          <ToolIcon icon={tool.icon} color={categoryIconColor[category]} size="sm" />
                          <span style={{ color: 'var(--text-h)' }}>{tool.label}</span>
                          {!tool.ready && <span className="ml-auto shrink-0 text-[10px] opacity-60">Soon</span>}
                        </span>
                      )
                      return (
                        <li key={tool.slug}>
                          {tool.ready ? (
                            <Link to={tool.to} onClick={() => setOpen(false)} className="block">
                              {row}
                            </Link>
                          ) : (
                            <div aria-disabled>{row}</div>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
