import type { LucideIcon } from 'lucide-react'

const COLORS = {
  violet: { front: '#7c3aed', back: '#ddd6fe' },
  emerald: { front: '#059669', back: '#a7f3d0' },
  sky: { front: '#0284c7', back: '#bae6fd' },
  amber: { front: '#d97706', back: '#fde68a' },
  rose: { front: '#e11d48', back: '#fecdd3' },
  fuchsia: { front: '#c026d3', back: '#f5d0fe' },
} as const

export type ToolIconColor = keyof typeof COLORS

export function ToolIcon({ icon: Icon, color, size = 'md' }: { icon: LucideIcon; color: ToolIconColor; size?: 'md' | 'lg' }) {
  const { front, back } = COLORS[color]
  const box = size === 'lg' ? 'h-14 w-14' : 'h-12 w-12'
  const iconSize = size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'

  return (
    <div className={`relative ${box} shrink-0`}>
      <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-xl" style={{ background: back }} />
      <div className="absolute inset-0 flex items-center justify-center rounded-xl shadow-sm" style={{ background: front }}>
        <Icon className={`${iconSize} text-white`} strokeWidth={2} />
      </div>
    </div>
  )
}
