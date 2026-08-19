import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { TOOLS } from '@/lib/tools'
import { IMAGE_TOOLS } from '@/lib/imageTools'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Logo } from '@/components/Logo'
import { APP_NAME } from '@/lib/brand'

const FOOTER_TOOLS = TOOLS.filter((t) => t.ready).slice(0, 5)
const FOOTER_IMAGE_TOOLS = IMAGE_TOOLS.filter((t) => t.ready).slice(0, 5)

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
    { label: 'Developer API', to: '/developers' },
  ]

  return (
    <footer className="border-t" style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)' }}>
      <div className="w-full px-6 py-12 lg:px-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-semibold" style={{ color: 'var(--text-h)' }}>
              <Logo className="h-7 w-7" />
              {APP_NAME}
            </Link>
            <p className="mt-3 max-w-[240px] text-sm opacity-60">{t('footer.tagline')}</p>
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

          <FooterColumn title="Image Tools">
            {FOOTER_IMAGE_TOOLS.map((tool) => (
              <li key={tool.slug}>
                <Link to={tool.to} className="text-sm opacity-70 hover:opacity-100">
                  {tool.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/images" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
                All image tools →
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
