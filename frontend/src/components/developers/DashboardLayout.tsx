import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  KeyRound,
  Webhook,
  UserCircle,
  ShieldCheck,
  Package,
  BookOpen,
  LogOut,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const NAV_GROUPS = [
  {
    title: 'Overview',
    items: [{ label: 'Console', to: '/developers/dashboard', icon: LayoutDashboard }],
  },
  {
    title: 'Developer',
    items: [
      { label: 'API Keys', to: '/developers/dashboard/keys', icon: KeyRound },
      { label: 'Webhooks', to: '/developers/dashboard/webhooks', icon: Webhook },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'My Account', to: '/developers/dashboard/account', icon: UserCircle },
      { label: 'Security', to: '/developers/dashboard/security', icon: ShieldCheck },
      { label: 'Plans & Packages', to: '/developers/dashboard/plans', icon: Package },
    ],
  },
]

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4338ca)' }}
            >
              {(user?.name?.[0] ?? user?.email?.[0] ?? '?').toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold" style={{ color: 'var(--text-h)' }}>
                {user?.name}
              </p>
              <p className="truncate text-xs" style={{ color: 'var(--text)', opacity: 0.7 }}>
                {user?.email}
              </p>
            </div>
          </div>

          <nav className="mt-4 space-y-4">
            {NAV_GROUPS.map((group) => (
              <div key={group.title}>
                <p className="px-2 text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text)', opacity: 0.5 }}>
                  {group.title}
                </p>
                <div className="mt-1.5 space-y-0.5">
                  {group.items.map((item) => {
                    const active = location.pathname === item.to
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors"
                        style={{
                          color: active ? 'var(--accent)' : 'var(--text-h)',
                          background: active ? 'var(--accent-soft)' : 'transparent',
                        }}
                      >
                        {active && <span className="absolute left-0 top-1/2 h-4 w-1 -translate-y-1/2 rounded-r-full" style={{ background: 'var(--accent)' }} />}
                        <item.icon className="h-4 w-4 shrink-0" />
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}

            <div className="border-t pt-3" style={{ borderColor: 'var(--border)' }}>
              <Link
                to="/developers/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium"
                style={{ color: 'var(--text-h)' }}
              >
                <BookOpen className="h-4 w-4 shrink-0" />
                Documentation
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-500/5"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                Log out
              </button>
            </div>
          </nav>
        </div>
      </aside>

      <div className="min-w-0">{children}</div>
    </div>
  )
}
