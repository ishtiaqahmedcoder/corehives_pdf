import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

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
      <header className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 font-semibold" style={{ color: 'var(--text-h)' }}>
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
              style={{ background: 'var(--accent)' }}
            >
              C
            </span>
            CoreHives PDF
          </Link>
          <button
            type="button"
            onClick={toggle}
            className="rounded-full border px-3 py-1.5 text-sm"
            style={{ borderColor: 'var(--border)' }}
            aria-label="Toggle theme"
          >
            {dark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">{children}</main>

      <footer className="border-t py-6 text-center text-xs opacity-60" style={{ borderColor: 'var(--border)' }}>
        © {new Date().getFullYear()} CoreHives — free PDF tools, no signup required.
      </footer>
    </div>
  )
}
