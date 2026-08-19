import { SimpleToolPage } from '@/components/SimpleToolPage'

export function ConvertFromJpg() {
  return (
    <SimpleToolPage
      tool="convert-from-jpg"
      title="Convert from JPG"
      description="Turn a JPG into PNG, GIF, or WEBP"
      submitLabel="Convert Image"
      accept={{ 'image/jpeg': ['.jpg', '.jpeg'] }}
      optionsForm={(options, setOptions) => (
        <label className="block text-left text-sm">
          <span className="font-medium" style={{ color: 'var(--text-h)' }}>
            Output format
          </span>
          <select
            value={options.format ?? 'png'}
            onChange={(e) => setOptions({ ...options, format: e.target.value })}
            className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm outline-none"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
          >
            <option value="png">PNG</option>
            <option value="gif">GIF</option>
            <option value="webp">WEBP</option>
          </select>
        </label>
      )}
    />
  )
}
