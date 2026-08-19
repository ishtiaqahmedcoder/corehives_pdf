import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export interface FaqItem {
  question: string
  answer: string
}

function FaqRow({ item, open, onToggle }: { item: FaqItem; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b" style={{ borderColor: 'var(--border)' }}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-base font-semibold" style={{ color: 'var(--text-h)' }}>
          {item.question}
        </span>
        <ChevronDown
          className="h-5 w-5 shrink-0 transition-transform"
          style={{ color: 'var(--accent)', transform: open ? 'rotate(180deg)' : undefined }}
        />
      </button>
      {open && (
        <p className="pb-4 text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
          {item.answer}
        </p>
      )}
    </div>
  )
}

export function Faq({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="mx-auto max-w-3xl">
      {items.map((item, i) => (
        <FaqRow key={item.question} item={item} open={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? null : i)} />
      ))}
    </div>
  )
}
