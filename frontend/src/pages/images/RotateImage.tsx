import { SimpleToolPage } from '@/components/SimpleToolPage'

export function RotateImage() {
  return (
    <SimpleToolPage
      tool="rotate-image"
      title="Rotate Image"
      description="Fix a sideways or upside-down photo"
      submitLabel="Rotate Image"
      accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }}
      optionsForm={(options, setOptions) => (
        <label className="block text-left text-sm">
          <span className="font-medium" style={{ color: 'var(--text-h)' }}>
            Rotation
          </span>
          <select
            value={options.degrees ?? '90'}
            onChange={(e) => setOptions({ ...options, degrees: e.target.value })}
            className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm outline-none"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
          >
            <option value="90">90° clockwise</option>
            <option value="180">180°</option>
            <option value="270">90° counter-clockwise</option>
          </select>
        </label>
      )}
    />
  )
}
