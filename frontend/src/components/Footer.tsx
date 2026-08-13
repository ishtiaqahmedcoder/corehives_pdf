import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Globe } from 'lucide-react'
import { TOOLS } from '@/lib/tools'

const FOOTER_TOOLS = TOOLS.filter((t) => t.ready).slice(0, 5)

const LEGAL_LINKS = ['Privacy Policy', 'Terms & Conditions', 'Cookie Policy']
const COMPANY_LINKS = ['About CoreHives', 'Contact', 'Blog']

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide opacity-50">{title}</h3>
      <ul className="mt-3 space-y-2.5">{children}</ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)' }}>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-semibold" style={{ color: 'var(--text-h)' }}>
              <span
                className="flex h-7 w-7 items-center justify-center rounded-lg text-sm text-white"
                style={{ background: 'var(--accent)' }}
              >
                C
              </span>
              CoreHives PDF
            </Link>
            <p className="mt-3 max-w-[220px] text-sm opacity-60">
              Free PDF tools, no signup, no watermark — a CoreHives product.
            </p>
          </div>

          <FooterColumn title="Tools">
            {FOOTER_TOOLS.map((tool) => (
              <li key={tool.slug}>
                <Link to={tool.to} className="text-sm opacity-70 hover:opacity-100">
                  {tool.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
                All tools →
              </Link>
            </li>
          </FooterColumn>

          <FooterColumn title="Legal">
            {LEGAL_LINKS.map((label) => (
              <li key={label} className="flex items-center gap-1.5 text-sm opacity-40" title="Coming soon">
                {label}
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Company">
            {COMPANY_LINKS.map((label) => (
              <li key={label} className="flex items-center gap-1.5 text-sm opacity-40" title="Coming soon">
                {label}
              </li>
            ))}
          </FooterColumn>
        </div>

        <div
          className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 text-xs opacity-60 sm:flex-row"
          style={{ borderColor: 'var(--border)' }}
        >
          <span>© {new Date().getFullYear()} CoreHives — free PDF tools, no signup required.</span>
          <span className="flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5" />
            English
          </span>
        </div>
      </div>
    </footer>
  )
}
