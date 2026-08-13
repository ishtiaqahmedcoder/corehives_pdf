import { useTranslation } from 'react-i18next'

interface PageRangeFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export function PageRangeField({ label, value, onChange }: PageRangeFieldProps) {
  const { t } = useTranslation()
  return (
    <label className="block text-left text-sm">
      <span className="font-medium" style={{ color: 'var(--text-h)' }}>
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('common.pageRangePlaceholder')}
        className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm outline-none"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
      />
      <span className="mt-1 block text-xs opacity-60">{t('common.pageRangeHelper')}</span>
    </label>
  )
}
