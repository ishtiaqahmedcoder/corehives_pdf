interface AdSlotProps {
  variant?: 'banner' | 'inline'
  className?: string
}

/**
 * Placeholder for a Google AdSense unit. Swap the inner content for the
 * actual <ins class="adsbygoogle"> snippet once the AdSense account is approved.
 */
export function AdSlot({ variant = 'inline', className = '' }: AdSlotProps) {
  const height = variant === 'banner' ? 'h-24' : 'h-40'

  return (
    <div
      className={`flex ${height} w-full items-center justify-center rounded-xl border border-dashed text-xs opacity-40 ${className}`}
      style={{ borderColor: 'var(--border)' }}
    >
      Ad slot ({variant})
    </div>
  )
}
