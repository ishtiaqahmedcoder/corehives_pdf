import { SimpleToolPage } from '@/components/SimpleToolPage'

export function Watermark() {
  return (
    <SimpleToolPage
      tool="watermark"
      title="Add Watermark"
      description="Stamp a diagonal text watermark across every page."
      submitLabel="Add Watermark"
      optionsForm={(options, setOptions) => (
        <label className="block text-left text-sm">
          <span className="font-medium" style={{ color: 'var(--text-h)' }}>
            Watermark text
          </span>
          <input
            type="text"
            value={options.text ?? ''}
            onChange={(e) => setOptions({ ...options, text: e.target.value })}
            placeholder="e.g. CONFIDENTIAL"
            className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm outline-none"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
          />
        </label>
      )}
      validateOptions={(options) => (!options.text?.trim() ? 'Enter watermark text.' : null)}
    />
  )
}
