import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AllToolsMenu } from '@/components/AllToolsMenu'
import { Footer } from '@/components/Footer'

function useTheme() {
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return { dark, toggle: () => setDark((d) => !d) }
}

export function Layout({ children }: { children: ReactNode }) {
  const { dark, toggle } = useTheme()

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-40 border-b backdrop-blur" style={{ borderColor: 'var(--border)', background: 'color-mix(in srgb, var(--bg) 85%, transparent)' }}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
          <Link to="/" className="flex items-center gap-2 font-semibold" style={{ color: 'var(--text-h)' }}>
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
              style={{ background: 'var(--accent)' }}
            >
              C
            </span>
            CoreHives PDF
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              to="/merge"
              className="rounded-full px-3 py-1.5 text-sm font-medium"
              style={{ color: 'var(--text-h)' }}
            >
              Merge PDF
            </Link>
            <AllToolsMenu />
            <button
              type="button"
              onClick={toggle}
              className="ml-2 rounded-full border px-3 py-1.5 text-sm"
              style={{ borderColor: 'var(--border)' }}
              aria-label="Toggle theme"
            >
              {dark ? '☀️' : '🌙'}
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">{children}</main>

      <Footer />
    </div>
  )
}
