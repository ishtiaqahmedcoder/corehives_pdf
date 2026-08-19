import { SimpleToolPage } from '@/components/SimpleToolPage'

export function ResizeImage() {
  return (
    <SimpleToolPage
      tool="resize-image"
      title="Resize Image"
      description="Change the width and height"
      submitLabel="Resize Image"
      accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }}
      validateOptions={(options) => {
        if (!options.width && !options.height) return 'Enter a width or a height.'
        return null
      }}
      optionsForm={(options, setOptions) => (
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-left text-sm">
            <span className="font-medium" style={{ color: 'var(--text-h)' }}>
              Width (px)
            </span>
            <input
              type="number"
              min={1}
              value={options.width ?? ''}
              onChange={(e) => setOptions({ ...options, width: e.target.value })}
              placeholder="e.g. 800"
              className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm outline-none"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
            />
          </label>
          <label className="block text-left text-sm">
            <span className="font-medium" style={{ color: 'var(--text-h)' }}>
              Height (px)
            </span>
            <input
              type="number"
              min={1}
              value={options.height ?? ''}
              onChange={(e) => setOptions({ ...options, height: e.target.value })}
              placeholder="e.g. 600"
              className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm outline-none"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
            />
          </label>
          <p className="col-span-2 text-xs opacity-60">Leave one empty to keep the original aspect ratio.</p>
        </div>
      )}
    />
  )
}
