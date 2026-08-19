import { SimpleToolPage } from '@/components/SimpleToolPage'

export function MemeGenerator() {
  return (
    <SimpleToolPage
      tool="meme-generator"
      title="Meme Generator"
      description="Caption an image in seconds"
      submitLabel="Generate Meme"
      accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }}
      validateOptions={(options) => (!options.top_text?.trim() && !options.bottom_text?.trim() ? 'Add a top or bottom caption.' : null)}
      optionsForm={(options, setOptions) => (
        <div className="space-y-3">
          <label className="block text-left text-sm">
            <span className="font-medium" style={{ color: 'var(--text-h)' }}>
              Top text
            </span>
            <input
              type="text"
              value={options.top_text ?? ''}
              onChange={(e) => setOptions({ ...options, top_text: e.target.value })}
              placeholder="e.g. WHEN THE CODE"
              className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm outline-none"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
            />
          </label>
          <label className="block text-left text-sm">
            <span className="font-medium" style={{ color: 'var(--text-h)' }}>
              Bottom text
            </span>
            <input
              type="text"
              value={options.bottom_text ?? ''}
              onChange={(e) => setOptions({ ...options, bottom_text: e.target.value })}
              placeholder="e.g. FINALLY WORKS"
              className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm outline-none"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
            />
          </label>
        </div>
      )}
    />
  )
}
