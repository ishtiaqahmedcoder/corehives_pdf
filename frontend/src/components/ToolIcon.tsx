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

const SIZES = {
  xs: { box: 'h-6 w-6', icon: 'h-3 w-3', offset: 'translate-x-0.5 translate-y-0.5' },
  sm: { box: 'h-8 w-8', icon: 'h-3.5 w-3.5', offset: 'translate-x-1 translate-y-1' },
  md: { box: 'h-12 w-12', icon: 'h-5 w-5', offset: 'translate-x-2 translate-y-2' },
  lg: { box: 'h-14 w-14', icon: 'h-6 w-6', offset: 'translate-x-2 translate-y-2' },
} as const

export function ToolIcon({
  icon: Icon,
  color,
  size = 'md',
  className = '',
}: {
  icon: LucideIcon
  color: ToolIconColor
  size?: keyof typeof SIZES
  className?: string
}) {
  const { front, back } = COLORS[color]
  const { box, icon, offset } = SIZES[size]

  return (
    <div className={`relative ${box} shrink-0 transition-transform ${className}`}>
      <div className={`absolute inset-0 ${offset} rounded-lg`} style={{ background: back }} />
      <div className="absolute inset-0 flex items-center justify-center rounded-lg shadow-sm" style={{ background: front }}>
        <Icon className={`${icon} text-white`} strokeWidth={2} />
      </div>
    </div>
  )
}
