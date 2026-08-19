import { SimpleToolPage } from '@/components/SimpleToolPage'

function marginField(
  label: string,
  key: 'top' | 'right' | 'bottom' | 'left',
  options: Record<string, string>,
  setOptions: (o: Record<string, string>) => void,
) {
  return (
    <label className="block text-left text-sm">
      <span className="font-medium" style={{ color: 'var(--text-h)' }}>
        {label}
      </span>
      <input
        type="number"
        min={0}
        value={options[key] ?? ''}
        onChange={(e) => setOptions({ ...options, [key]: e.target.value })}
        placeholder="0"
        className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm outline-none"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
      />
    </label>
  )
}

export function CropImage() {
  return (
    <SimpleToolPage
      tool="crop-image"
      title="Crop Image"
      description="Trim the edges of a photo"
      submitLabel="Crop Image"
      accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }}
      optionsForm={(options, setOptions) => (
        <div className="grid grid-cols-2 gap-3">
          {marginField('Top (px)', 'top', options, setOptions)}
          {marginField('Right (px)', 'right', options, setOptions)}
          {marginField('Bottom (px)', 'bottom', options, setOptions)}
          {marginField('Left (px)', 'left', options, setOptions)}
          <p className="col-span-2 text-xs opacity-60">Leave a field empty or 0 to keep that side unchanged.</p>
        </div>
      )}
    />
  )
}
