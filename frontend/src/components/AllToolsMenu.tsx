import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Image, Code2, LayoutDashboard } from 'lucide-react'
import { CATEGORIES, CATEGORY_DOT, CATEGORY_LABELS, toolsByCategory } from '@/lib/tools'

const QUICK_LINKS = [
  { to: '/images', label: 'Image tools', icon: Image },
  { to: '/developers', label: 'Developer API', icon: Code2 },
  { to: '/developers/dashboard', label: 'API dashboard', icon: LayoutDashboard },
]

export function AllToolsMenu() {
  const { t } = useTranslation()
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
        {t('nav.allTools')}
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
            <div className="grid max-h-[70vh] grid-cols-2 gap-x-6 gap-y-5 overflow-y-auto px-6 py-6 sm:grid-cols-3 lg:px-10 xl:grid-cols-6">
              {CATEGORIES.map((category) => (
                <div key={category}>
                  <div className="mb-2 flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${CATEGORY_DOT[category]}`} />
                    <h3 className="text-xs font-semibold uppercase tracking-wide opacity-60">
                      {t(`categories.${category}`, CATEGORY_LABELS[category])}
                    </h3>
                  </div>
                  <ul className="space-y-0.5">
                    {toolsByCategory(category).map((tool) => {
                      const Icon = tool.icon
                      const rowClass = tool.ready
                        ? 'hover:bg-[var(--bg-soft)]'
                        : 'cursor-not-allowed opacity-50'
                      const row = (
                        <span className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm ${rowClass}`}>
                          <Icon className="h-4 w-4 shrink-0" style={{ color: 'var(--accent)' }} strokeWidth={1.75} />
                          <span style={{ color: 'var(--text-h)' }}>{t(`tools.${tool.slug}.label`, tool.label)}</span>
                          {!tool.ready && (
                            <span className="ml-auto shrink-0 text-[10px] opacity-60">{t('common.soon')}</span>
                          )}
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
            <div
              className="flex flex-wrap items-center gap-2 border-t px-6 py-3 lg:px-10"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)' }}
            >
              {QUICK_LINKS.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-h)', background: 'var(--surface)' }}
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color: 'var(--accent)' }} />
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
