import { useEffect, useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { AllToolsMenu } from '@/components/AllToolsMenu'
import { Footer } from '@/components/Footer'
import { Logo } from '@/components/Logo'
import { APP_NAME } from '@/lib/brand'

function useTheme() {
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return { dark, toggle: () => setDark((d) => !d) }
}

function BackButton() {
  const navigate = useNavigate()
  const location = useLocation()

  if (location.pathname === '/') return null

  function handleBack() {
    if (location.key === 'default') {
      navigate('/')
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={handleBack}
        aria-label="Go back"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border"
        style={{ borderColor: 'var(--border)', color: 'var(--text-h)' }}
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
      <span className="h-6 w-px" style={{ background: 'var(--border)' }} />
    </div>
  )
}

export function Layout({ children }: { children: ReactNode }) {
  const { dark, toggle } = useTheme()
  const { t } = useTranslation()

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-40 border-b backdrop-blur" style={{ borderColor: 'var(--border)', background: 'color-mix(in srgb, var(--bg) 85%, transparent)' }}>
        <div className="flex w-full items-center justify-between gap-4 px-6 py-3.5 lg:px-10">
          <div className="flex items-center gap-4">
            <BackButton />
            <Link to="/" className="flex items-center gap-2.5 font-semibold" style={{ color: 'var(--text-h)' }}>
              <Logo />
              <span>{APP_NAME}</span>
            </Link>
          </div>

          <nav className="flex items-center gap-1">
            <Link
              to="/merge"
              className="rounded-full px-3 py-1.5 text-sm font-medium"
              style={{ color: 'var(--text-h)' }}
            >
              {t('nav.mergePdf')}
            </Link>
            <AllToolsMenu />
            <button
              type="button"
              onClick={toggle}
              className="ml-2 rounded-full border px-3 py-1.5 text-sm"
              style={{ borderColor: 'var(--border)' }}
              aria-label={t('nav.toggleTheme')}
            >
              {dark ? '☀️' : '🌙'}
            </button>
          </nav>
        </div>
      </header>

      <main className="w-full flex-1 px-6 py-10 lg:px-10">{children}</main>

      <Footer />
    </div>
  )
}
