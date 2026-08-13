import { SimpleToolPage } from '@/components/SimpleToolPage'
import { PageRangeField } from '@/components/PageRangeField'

export function ExtractPages() {
  return (
    <SimpleToolPage
      tool="extract-pages"
      title="Extract Pages"
      description="Pull specific pages out of a PDF into a new file."
      submitLabel="Extract Pages"
      optionsForm={(options, setOptions) => (
        <PageRangeField
          label="Pages to extract"
          value={options.pages ?? ''}
          onChange={(pages) => setOptions({ ...options, pages })}
        />
      )}
      validateOptions={(options) => (!options.pages?.trim() ? 'Enter which pages to extract.' : null)}
    />
  )
}
