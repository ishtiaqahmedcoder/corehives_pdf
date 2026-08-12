import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AdSlot } from '@/components/AdSlot'

const TOOLS = [
  { to: '/merge', label: 'Merge PDF', desc: 'Combine multiple PDFs into one', ready: true },
  { to: '#', label: 'Split PDF', desc: 'Extract or split pages', ready: false },
  { to: '#', label: 'Compress PDF', desc: 'Reduce file size', ready: false },
  { to: '#', label: 'PDF to Word', desc: 'Convert to editable Word', ready: false },
]

export function Home() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10 text-center"
      >
        <h1 className="text-4xl font-semibold" style={{ color: 'var(--text-h)' }}>
          Free PDF tools. No signup. No limits.
        </h1>
        <p className="mt-3 text-lg opacity-70">Merge, split, compress and convert — all free, forever.</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {TOOLS.map((tool, i) => (
          <motion.div
            key={tool.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Link
              to={tool.ready ? tool.to : '#'}
              className={`block rounded-2xl border p-5 transition ${tool.ready ? 'hover:shadow-lg' : 'cursor-not-allowed opacity-50'}`}
              style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
              onClick={(e) => !tool.ready && e.preventDefault()}
            >
              <h2 className="font-medium" style={{ color: 'var(--text-h)' }}>
                {tool.label} {!tool.ready && <span className="text-xs opacity-50">(soon)</span>}
              </h2>
              <p className="mt-1 text-sm opacity-70">{tool.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <AdSlot variant="banner" className="mt-10" />
    </div>
  )
}
