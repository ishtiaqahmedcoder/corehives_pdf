import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { TOOLS } from '@/lib/tools'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

const FOOTER_TOOLS = TOOLS.filter((t) => t.ready).slice(0, 5)

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide opacity-50">{title}</h3>
      <ul className="mt-3 space-y-2.5">{children}</ul>
    </div>
  )
}

export function Footer() {
  const { t } = useTranslation()

  const legalLinks = [
    { label: t('footer.privacyPolicy'), to: '/privacy' },
    { label: t('footer.terms'), to: '/terms' },
    { label: t('footer.cookies'), to: '/cookies' },
  ]
  const companyLinks = [
    { label: t('footer.about'), to: '/about' },
    { label: t('footer.contact'), to: '/contact' },
    { label: t('footer.blog'), to: '/blog' },
  ]

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
            <p className="mt-3 max-w-[220px] text-sm opacity-60">{t('footer.tagline')}</p>
          </div>

          <FooterColumn title={t('footer.tools')}>
            {FOOTER_TOOLS.map((tool) => (
              <li key={tool.slug}>
                <Link to={tool.to} className="text-sm opacity-70 hover:opacity-100">
                  {t(`tools.${tool.slug}.label`, tool.label)}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
                {t('footer.allTools')}
              </Link>
            </li>
          </FooterColumn>

          <FooterColumn title={t('footer.legal')}>
            {legalLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm opacity-70 hover:opacity-100">
                  {link.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title={t('footer.company')}>
            {companyLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm opacity-70 hover:opacity-100">
                  {link.label}
                </Link>
              </li>
            ))}
          </FooterColumn>
        </div>

        <div
          className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 text-xs opacity-60 sm:flex-row"
          style={{ borderColor: 'var(--border)' }}
        >
          <span>{t('footer.copyright', { year: new Date().getFullYear() })}</span>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  )
}
