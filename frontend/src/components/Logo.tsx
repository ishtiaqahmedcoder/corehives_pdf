export function Logo({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M16 1 L29 8.5 L29 23.5 L16 31 L3 23.5 L3 8.5 Z" style={{ fill: 'var(--accent)' }} />
      <path
        d="M12.5 9 H18 L22 13 V22.5 C22 23.05 21.55 23.5 21 23.5 H12.5 C11.95 23.5 11.5 23.05 11.5 22.5 V10 C11.5 9.45 11.95 9 12.5 9 Z"
        fill="#ffffff"
      />
      <path d="M18 9 V13 H22 Z" style={{ fill: 'var(--accent)' }} opacity="0.35" />
    </svg>
  )
}
