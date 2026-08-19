import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Check,
  Zap,
  Layers,
  Code2,
  Server,
  FileStack,
  Minimize2,
  FileType,
  PencilLine,
  Lock,
  Image as ImageIcon,
  Globe,
  PackageOpen,
} from 'lucide-react'
import { ApiKey } from '@/lib/apiKeyPlans'
import { usePageMeta } from '@/hooks/usePageMeta'
import { APP_NAME } from '@/lib/brand'

const PLANS = [
  { name: 'Free', price: '$0', quota: ApiKey.free, features: ['All PDF and image tools', 'Webhooks', 'Community support'] },
  { name: 'Starter', price: '$19/mo', quota: ApiKey.starter, features: ['Everything in Free', 'Priority queue', 'Email support'], highlight: true },
  { name: 'Pro', price: '$79/mo', quota: ApiKey.pro, features: ['Everything in Starter', 'Highest priority queue', 'Priority support'] },
]

const TRUST_POINTS = [
  { icon: Zap, title: 'Fast, queued processing', body: 'Every job runs on a dedicated queue and returns a signed download link the moment it finishes.' },
  { icon: Layers, title: 'PDF & image experts', body: '35+ tools covering documents and images, built and maintained as one product.' },
  { icon: Code2, title: 'Easy to integrate', body: 'A plain REST API with one request shape for every tool, plus a live tester in the docs.' },
  { icon: Server, title: 'Free & open-source engine', body: 'Powered by real open-source PDF and image libraries, not a black-box third party.' },
]

const FEATURE_CARDS = [
  { icon: FileStack, color: '#7c3aed', title: 'Organize PDF', body: 'Merge, split, remove, extract, and reorder pages with simple endpoints.' },
  { icon: Minimize2, color: '#059669', title: 'Optimize PDF', body: 'Compress large PDFs and run OCR to make scanned pages searchable.' },
  { icon: FileType, color: '#0284c7', title: 'Convert PDF', body: 'Convert between PDF, Word, PowerPoint, Excel, Markdown, and images.' },
  { icon: PencilLine, color: '#d97706', title: 'Edit & Sign', body: 'Add watermarks, page numbers, freeform text, and signatures to any PDF.' },
  { icon: Lock, color: '#e11d48', title: 'PDF Security', body: 'Password-protect or unlock PDFs to control exactly who can open them.' },
  { icon: ImageIcon, color: '#c026d3', title: 'Image Tools', body: 'Compress, resize, crop, convert, and edit images, plus AI upscaling and background removal.' },
  { icon: Globe, color: '#7c3aed', title: 'HTML to Image', body: 'Render any public web page as a JPG or PNG screenshot from a single URL.' },
  { icon: PackageOpen, color: '#059669', title: 'Batch Processing', body: 'Run one tool across up to 20 files at once, in a single request.' },
]

const CODE_EXAMPLE = `curl -X POST https://corehives.com/api/v1/tools/compress \\
  -H "Authorization: Bearer pdfh_live_xxxxxxxxxxxxxxxxxxxxxxxx" \\
  -F "files[]=@document.pdf"

# => { "job_id": "0199f1a2-..." }

curl https://corehives.com/api/v1/jobs/0199f1a2-... \\
  -H "Authorization: Bearer pdfh_live_xxxxxxxxxxxxxxxxxxxxxxxx"

# => { "status": "completed", "download_url": "https://..." }`

export function DevelopersLanding() {
  usePageMeta('Developer API', 'Every PDF and image tool on PDFHives, available as a REST API with keys, quotas, and webhooks.')

  return (
    <div className="w-full">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl" style={{ color: 'var(--text-h)' }}>
          Every tool, in a REST API for developers
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed" style={{ color: 'var(--text)' }}>
          Whether you're a solo project or a growing product, the {APP_NAME} API automates your PDF
          and image processing. Merge, split, compress, convert, sign, and more, all in one place.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            to="/developers/register"
            className="rounded-xl px-6 py-3 font-semibold text-white"
            style={{ background: 'var(--accent)' }}
          >
            Get your API key
          </Link>
          <Link to="/developers/docs" className="rounded-xl border px-6 py-3 font-semibold" style={{ borderColor: 'var(--border)', color: 'var(--text-h)' }}>
            Read the docs
          </Link>
        </div>
      </motion.div>

      <section className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_POINTS.map((point) => (
          <div key={point.title}>
            <point.icon className="h-6 w-6" style={{ color: 'var(--accent)' }} strokeWidth={1.75} />
            <h3 className="mt-3 text-base font-semibold" style={{ color: 'var(--text-h)' }}>
              {point.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
              {point.body}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-20">
        <h2 className="text-center text-3xl font-semibold" style={{ color: 'var(--text-h)' }}>
          Start building with any tool
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-base" style={{ color: 'var(--text)' }}>
          Every category below maps to a set of REST endpoints, documented in full with a live tester.
        </p>
        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURE_CARDS.map((card) => (
            <Link
              key={card.title}
              to="/developers/docs"
              className="rounded-2xl p-5 text-white transition-transform hover:-translate-y-0.5"
              style={{ background: card.color }}
            >
              <card.icon className="h-6 w-6" strokeWidth={1.75} />
              <h3 className="mt-4 font-semibold">{card.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed opacity-90">{card.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 grid max-w-5xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-semibold" style={{ color: 'var(--text-h)' }}>
            The same three steps, every time
          </h2>
          <p className="mt-3 text-base leading-relaxed" style={{ color: 'var(--text)' }}>
            Submit a file, poll for the result, download it. No SDK to install, no odd request
            shapes to memorize between tools.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/developers/docs" className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white" style={{ background: 'var(--accent)' }}>
              Read the full API reference
            </Link>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border shadow-lg" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between px-4 py-2.5 text-xs font-medium text-white" style={{ background: '#16141f' }}>
            <span>Compress example</span>
            <span className="opacity-60">curl</span>
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-[#e5e2f0]" style={{ background: '#0f0e17' }}>
            <code>{CODE_EXAMPLE}</code>
          </pre>
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-center text-3xl font-semibold" style={{ color: 'var(--text-h)' }}>
          Simple, predictable pricing
        </h2>
        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border p-5"
              style={{
                borderColor: plan.highlight ? 'var(--accent)' : 'var(--border)',
                background: 'var(--surface)',
              }}
            >
              <h3 className="font-semibold" style={{ color: 'var(--text-h)' }}>
                {plan.name}
              </h3>
              <p className="mt-1 text-2xl font-bold" style={{ color: 'var(--text-h)' }}>
                {plan.price}
              </p>
              <p className="text-sm" style={{ color: 'var(--text)' }}>
                {plan.quota.toLocaleString()} files / month
              </p>
              <ul className="mt-4 space-y-1.5 text-sm" style={{ color: 'var(--text)' }}>
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--accent)' }} />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <p className="mt-6 text-center text-sm" style={{ color: 'var(--text)' }}>
          Paid plans are launching soon. Every account starts on Free today.
        </p>
      </section>
    </div>
  )
}
