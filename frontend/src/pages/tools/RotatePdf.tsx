import { SimpleToolPage } from '@/components/SimpleToolPage'
import { PageRangeField } from '@/components/PageRangeField'

export function RotatePdf() {
  return (
    <SimpleToolPage
      tool="rotate"
      title="Rotate PDF"
      description="Fix sideways or upside-down pages."
      submitLabel="Rotate PDF"
      optionsForm={(options, setOptions) => (
        <div className="space-y-4">
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

          <PageRangeField
            label="Pages (optional — leave empty for all pages)"
            value={options.pages ?? ''}
            onChange={(pages) => setOptions({ ...options, pages })}
          />
        </div>
      )}
    />
  )
}
